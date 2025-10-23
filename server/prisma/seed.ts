import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Seed cars
  const cars = [
    {
      name: 'Tesla Model 3',
      brand: 'Tesla',
      type: 'Electric',
      dailyPrice: 89.99,
      featured: true,
    },
    {
      name: 'Tesla Model Y',
      brand: 'Tesla',
      type: 'Electric SUV',
      dailyPrice: 109.99,
      featured: true,
    },
    {
      name: 'Nissan Leaf',
      brand: 'Nissan',
      type: 'Electric',
      dailyPrice: 59.99,
      featured: false,
    },
    {
      name: 'Toyota Camry',
      brand: 'Toyota',
      type: 'Sedan',
      dailyPrice: 49.99,
      featured: true,
    },
    {
      name: 'Honda CR-V',
      brand: 'Honda',
      type: 'SUV',
      dailyPrice: 69.99,
      featured: false,
    },
    {
      name: 'Ford Mustang',
      brand: 'Ford',
      type: 'Sports Car',
      dailyPrice: 129.99,
      featured: true,
    },
  ];

  for (const car of cars) {
    await prisma.car.upsert({
      where: { id: car.name.toLowerCase().replace(/\s+/g, '-') },
      update: {},
      create: {
        id: car.name.toLowerCase().replace(/\s+/g, '-'),
        ...car,
      },
    });
  }

  console.log(`✅ Seeded ${cars.length} cars`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
