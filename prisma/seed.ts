import { PrismaClient } from '@prisma/client';
// import Data from "./seed";
// prisma/seed.ts

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  const alice = await prisma.user.upsert({
    where: { email: 'alice@prisma.io' },
    update: {},
    create: {
      email: 'alice@prisma.io',
      name: 'Alice',
      posts: {
        create: [
          {
            title: 'Check out Prisma with Next.js',
            content: 'https://www.prisma.io/nextjs',
            published: true,
            slug: 'follow-prisma-on-twitter',
          },
          {
            title: 'Prisma Adds Support for MongoDB',
            content:
              'Support for MongoDB has been one of the most requested features since the initial release of...',
            published: false,
            slug: 'follows-nexus-twitter',
          },
          {
            title: "What's new in Prisma? (Q1/22)",
            content:
              'Our engineers have been working hard, issuing new releases with many improvements...',
            published: true,
            slug: 'folow-nexus-twitter',
          },
        ],
      },
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: 'bob@prisma.io' },
    update: {},
    create: {
      email: 'bob@prisma.io',
      name: 'Bob',
      posts: {
        create: [
          {
            title: 'Follow Prisma on Twitter',
            content: 'https://twitter.com/prisma',
            published: true,
            slug: 'follow-prisma-twitter',
          },
          {
            title: 'Follow Nexus on Twitter',
            content: 'https://twitter.com/nexusgql',
            published: true,
            slug: 'follow-on-twitter',
          },
        ],
      },
    },
  });

  console.log({ alice, bob });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('successfully added');
  })
  .catch(async (e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
    // process.exit(1);
  });
