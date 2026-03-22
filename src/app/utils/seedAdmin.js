const User = require('../modules/user/user.model');
const bcrypt = require('bcryptjs');
const env = require('../config/env');

const seedAdmin = async () => {
  try {
    const adminEmail = env.ADMIN.EMAIL;
    const adminPassword = env.ADMIN.PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.log(
        'No ADMIN_EMAIL or ADMIN_PASSWORD provided in .env. Skipping admin seeding.',
      );
      return;
    }

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      console.log('No default admin found. Seeding admin user...');

      // Hash the password defined in the env (or fallback)
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(env.ADMIN.PASSWORD, salt);

      const adminUser = new User({
        firstName: env.ADMIN.FIRST_NAME,
        lastName: env.ADMIN.LAST_NAME,
        name: `${env.ADMIN.FIRST_NAME} ${env.ADMIN.LAST_NAME}`.trim(),
        email: adminEmail,
        password: hashedPassword,
        role: 'admin', // Sets user to admin privileges
        isVerified: true, // Automatically verifiable so they can login immediately
        isActive: 'active',
        status: 'active',
      });

      await adminUser.save();
      console.log(`✅ Default Admin user created: ${adminEmail}`);
    } else {
      console.log(`✅ Admin user already exists: ${adminEmail}`);
    }
  } catch (error) {
    console.error('❌ Error seeding admin user:', error.message);
  }
};

module.exports = seedAdmin;
