import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const flag = await prisma.appConfig.findUnique({
    where: { key: 'configured' },
  });
  
  if (!flag) {
    await prisma.appConfig.create({
      data: { key: 'configured', value: 'false' },
    });
    console.log('✅ Setup flag initialized to false');
  } else {
    console.log(`✅ Setup flag exists: ${flag.value}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
