import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const DRAMABOX_SERIES_ID = '42000019792';
const BASE_WATCH_URL = `https://drama.sansekai.my.id/watch/dramabox/${DRAMABOX_SERIES_ID}`;

const SAMPLE_COVERS = [
  'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80',
];

async function main() {
  console.log('🌱 Starting Database Seeding with Real Short Drama Streams...');

  await prisma.watchHistory.deleteMany();
  await prisma.unlock.deleteMany();
  await prisma.purchase.deleteMany();
  await prisma.episode.deleteMany();
  await prisma.series.deleteMany();
  await prisma.user.deleteMany();

  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@drama.com',
      passwordHash: adminPassword,
      name: 'System Admin',
      role: 'ADMIN',
      coinsBalance: 1000,
    },
  });

  const testUser = await prisma.user.create({
    data: {
      email: 'user@drama.com',
      passwordHash: userPassword,
      name: 'Jane Doe',
      role: 'USER',
      coinsBalance: 150,
    },
  });

  console.log(`👤 Admin created: admin@drama.com (pass: admin123)`);
  console.log(`👤 Test User created: user@drama.com (pass: user123, balance: 150 coins)`);

  const series1 = await prisma.series.create({
    data: {
      title: "The Billionaire's Secret Heir",
      description: "Separated at birth, young Alex returns to claim his rightful empire after discovering his true lineage. Secrets, romance, and fierce corporate vengeance unfold in fast-paced 60-second episodes.",
      coverImage: SAMPLE_COVERS[0],
      category: 'CEO Romance',
      status: 'ONGOING',
      viewsCount: 142500,
    },
  });

  const series2 = await prisma.series.create({
    data: {
      title: 'Reborn as the Martial Monarch',
      description: 'Betrayed by his trusted general, master fighter Chen awakens 10 years in the future inside the body of a weak high school student. Watch his meteoric rise to supreme ruler.',
      coverImage: SAMPLE_COVERS[1],
      category: 'Revenge & Martial Arts',
      status: 'ONGOING',
      viewsCount: 98400,
    },
  });

  const series3 = await prisma.series.create({
    data: {
      title: 'Double Life of the Masked Heiress',
      description: 'By day she is an understated assistant, by night she commands a secret global intelligence syndicate. But her handsome boss is closing in on her secret identity.',
      coverImage: SAMPLE_COVERS[2],
      category: 'Urban Thriller',
      status: 'COMPLETED',
      viewsCount: 231000,
    },
  });

  const seriesList = [series1, series2, series3];

  for (const s of seriesList) {
    console.log(`🎬 Adding real drama episodes for series: ${s.title}`);
    for (let i = 1; i <= 10; i++) {
      const isFree = i <= 3;
      await prisma.episode.create({
        data: {
          seriesId: s.id,
          episodeNumber: i,
          title: `Episode ${i}: ${isFree ? 'The Encounter' : 'Unveiling the Truth'}`,
          videoUrl: `${BASE_WATCH_URL}?ep=${i}`,
          isFree: isFree,
          coinCost: 10,
          duration: 60,
        },
      });
    }
  }

  const ep4Series1 = await prisma.episode.findFirst({
    where: { seriesId: series1.id, episodeNumber: 4 },
  });

  if (ep4Series1) {
    await prisma.unlock.create({
      data: {
        userId: testUser.id,
        episodeId: ep4Series1.id,
      },
    });
    console.log(`🔓 Unlocked Episode 4 of Series 1 for test user.`);
  }

  await prisma.purchase.create({
    data: {
      userId: testUser.id,
      amount: 4.99,
      coinsAdded: 200,
      paymentMethod: 'Simulated Card',
    },
  });

  console.log('✅ Database Seeding Completed Successfully with Real Short Drama Streams!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
