const prisma = require('./server/config/db.js');
prisma.$connect()
  .then(() => {
    console.log('OK');
    process.exit(0);
  })
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
