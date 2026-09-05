import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Refusing to seed predictable development accounts in production.");
  }
  console.log('Starting seeding...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@localfind.com' },
    update: {},
    create: {
      email: 'admin@localfind.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('Admin user created');

  // Create some categories
  const categoriesData = [
    { name: 'Restaurants', slug: 'restaurants' },
    { name: 'Healthcare', slug: 'healthcare' },
    { name: 'Beauty & Salons', slug: 'salons' },
    { name: 'Fitness', slug: 'fitness' },
    { name: 'Automotive', slug: 'automotive' },
    { name: 'Home Services', slug: 'home-services' },
    { name: 'Education', slug: 'education' },
    { name: 'Professional Services', slug: 'professional' },
  ];

  for (const cat of categoriesData) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log('Categories created');

  const restaurants = await prisma.category.findUnique({ where: { slug: 'restaurants' } });
  const healthcare = await prisma.category.findUnique({ where: { slug: 'healthcare' } });
  const salons = await prisma.category.findUnique({ where: { slug: 'salons' } });
  if (!restaurants || !healthcare || !salons) {
    throw new Error("Required seed categories could not be created");
  }

  // Create business owners
  const ownerPassword = await bcrypt.hash('owner123', 10);
  const owner1 = await prisma.user.upsert({
    where: { email: 'owner1@localfind.com' },
    update: {},
    create: {
      email: 'owner1@localfind.com',
      name: 'Rahul Sharma',
      password: ownerPassword,
      role: 'BUSINESS_OWNER',
    },
  });

  const owner2 = await prisma.user.upsert({
    where: { email: 'owner2@localfind.com' },
    update: {},
    create: {
      email: 'owner2@localfind.com',
      name: 'Priya Patel',
      password: ownerPassword,
      role: 'BUSINESS_OWNER',
    },
  });

  // Create Businesses
  const businesses: Prisma.BusinessUncheckedCreateInput[] = [
    {
      ownerId: owner1.id,
      name: 'Sharma Dental Clinic',
      slug: 'sharma-dental-clinic-mohali',
      description: 'Providing comprehensive dental care and treatments in Mohali. Our experienced dentists ensure the best care for your smile.',
      categoryId: healthcare.id,
      phone: '+91 9876543210',
      whatsapp: '919876543210',
      address: 'Phase 7, Sector 61',
      locality: 'Phase 7',
      city: 'Mohali',
      state: 'Punjab',
      pincode: '160062',
      status: 'APPROVED',
      verified: true,
      seoTitle: 'Sharma Dental Clinic | Dentist in Mohali',
    },
    {
      ownerId: owner1.id,
      name: 'Punjab Dhaba',
      slug: 'punjab-dhaba-chandigarh',
      description: 'Authentic Punjabi cuisine with a modern twist. Enjoy the best butter chicken and dal makhani in town.',
      categoryId: restaurants.id,
      phone: '+91 9988776655',
      address: 'Sector 22-C',
      locality: 'Sector 22',
      city: 'Chandigarh',
      state: 'Chandigarh',
      pincode: '160022',
      status: 'APPROVED',
      verified: true,
    },
    {
      ownerId: owner2.id,
      name: 'Glow Up Beauty Salon',
      slug: 'glow-up-salon-panchkula',
      description: 'Premium bridal makeup, haircuts, and spa services in Panchkula.',
      categoryId: salons.id,
      phone: '+91 8877665544',
      address: 'Sector 11 Market',
      locality: 'Sector 11',
      city: 'Panchkula',
      state: 'Haryana',
      pincode: '134109',
      status: 'PENDING_APPROVAL',
      verified: false,
    }
  ];

  for (const bus of businesses) {
    const existing = await prisma.business.findUnique({ where: { slug: bus.slug } });
    if (!existing) {
      await prisma.business.create({
        data: {
          ...bus,
          media: {
            create: [
              { type: 'IMAGE', url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&q=80', sortOrder: 1 }
            ]
          },
          services: {
            create: [
              { name: 'Standard Service', price: '₹500 - ₹2000' }
            ]
          },
          hours: {
            create: [
              { day: 1, openTime: '09:00', closeTime: '18:00' },
              { day: 2, openTime: '09:00', closeTime: '18:00' },
              { day: 3, openTime: '09:00', closeTime: '18:00' },
              { day: 4, openTime: '09:00', closeTime: '18:00' },
              { day: 5, openTime: '09:00', closeTime: '18:00' },
              { day: 6, openTime: '10:00', closeTime: '15:00' },
              { day: 0, closed: true }
            ]
          }
        }
      });
    }
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
