const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  try {
    // Create admin user
    const hash = await bcrypt.hash('admin123', 10);
    await prisma.user.upsert({
      where: { email: 'admin@carental.com' },
      create: {
        email: 'admin@carental.com',
        name: 'Administrator',
        password: hash,
        isAdmin: true
      },
      update: {
        password: hash,
        isAdmin: true
      }
    });

    // Mark app as configured
    await prisma.appConfig.upsert({
      where: { key: 'configured' },
      create: { key: 'configured', value: 'true' },
      update: { value: 'true' }
    });

    // Set app URL
    await prisma.appConfig.upsert({
      where: { key: 'app_url' },
      create: { key: 'app_url', value: 'http://localhost:5173' },
      update: { value: 'http://localhost:5173' }
    });

    console.log('✅ Admin account created successfully!');
    console.log('📧 Email: admin@carental.com');
    console.log('🔑 Password: admin123');
    console.log('🎉 App configured and ready to use!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
