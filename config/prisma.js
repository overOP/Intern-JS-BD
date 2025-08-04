const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

async function connectDB() {
  try {
    await prisma.$connect();
    console.log("✅ Successfully connected to the database.");
  } catch (error) {
    console.error("❌ Failed to connect to the database:", error);
    process.exit(1);
  }
}
connectDB();

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  console.log("🔄 Disconnected from the database.");
  process.exit(0);
});

module.exports = prisma;
