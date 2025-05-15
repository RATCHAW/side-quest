import { db } from "./db";
import { randomUUID } from "crypto";

const createMockPost = () => {
  return Array.from({ length: 40 }, (_, i) => ({
    title: `Post Title ${i + 1}`,
    description: `This is the description for post ${i + 1}. It contains some interesting content about various topics.`,
  }));
};

async function main() {
  console.log("Starting database seeding...");
  const mockPosts = createMockPost();

  let userId: string;
  const existingUser = await db.user.findFirst();

  if (existingUser) {
    userId = existingUser.id;
    console.log(`Using existing user: ${existingUser.name} (${existingUser.id})`);
  } else {
    const newUser = await db.user.create({
      data: {
        id: randomUUID(),
        name: "Seed User",
        email: "seed@example.com",
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    userId = newUser.id;
    console.log(`Created new user: ${newUser.name} (${newUser.id})`);
  }

  await db.post.createMany({
    data: mockPosts.map((post) => ({
      title: post.title,
      description: post.description,
      userId: userId,
    })),
  });

  console.log("Database seeding completed!");
}

main().catch((e) => {
  console.error("Error during seeding:", e);
  process.exit(1);
});
