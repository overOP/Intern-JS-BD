const prisma = require("../config/prisma");

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error("❌ Please provide an email. Usage: node scripts/promote.js user@example.com");
    process.exit(1);
  }

  // Find the admin role
  const adminRole = await prisma.role.findUnique({ where: { roleName: "Admin" } });
  if (!adminRole) {
    throw new Error("❌ Admin role not found. Please seed roles first.");
  }

  // Find the user by email
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error(`❌ User with email ${email} not found.`);
  }

  // Update the user's role to admin
  await prisma.user.update({
    where: { email },
    data: { role_id: adminRole.id },
  });

  console.log(`✅ User with email ${email} has been promoted to Admin.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
