const prisma = require("../config/prisma");

async function main() {
  await prisma.role.createMany({
    data: [
      { roleName: "User" },
      { roleName: "Admin" }
    ],
    skipDuplicates: true,
  });
  console.log("✅ Roles seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
