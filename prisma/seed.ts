import fs from 'fs';
import { Prisma, PrismaClient } from '@prisma/client';
// import Data from "./seedData.json";
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

/**
 * seed data base using json data file for complex data and relation [product, post, author, shop,...]
 */
async function jsonMain() {
  const seedData = JSON.parse(fs.readFileSync('seedData.json', 'utf8'));

  for (const user of seedData.users) {
    const posts = seedData.posts.map((post) => ({
      ...post,
      comments: {
        create: seedData.comments.map((comment) => ({
          ...comment,
          author: {
            connectOrCreate: {
              where: {
                email:
                  seedData.users[
                    Math.floor(Math.random() * seedData.users.length)
                  ].email,
              },
              create: {
                email:
                  seedData.users[
                    Math.floor(Math.random() * seedData.users.length)
                  ].email,
                name: seedData.users[
                  Math.floor(Math.random() * seedData.users.length)
                ].name,
              },
            },
          },
        })),
      },
    }));

    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        name: user.name,
        posts: {
          create: posts,
        },
      },
    });
  }

  console.log('Seeding completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
