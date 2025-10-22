const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.appConfig.deleteMany({});
    await prisma.user.deleteMany({});
    console.log('✅ Reset complete: Removed all configuration and users');
    console.log('🔄 App is now in setup mode - visit /setup to configure');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
