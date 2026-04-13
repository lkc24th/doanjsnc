const prisma = require('./server/config/db.js');

async function testQuery() {
    console.log("Testing Prisma connection...");
    try {
        const users = await prisma.user.findMany({ take: 1 });
        console.log("Found users:", users);
    } catch (err) {
        console.error("Prisma error:", err);
    } finally {
        await prisma.$disconnect();
    }
}
testQuery();
