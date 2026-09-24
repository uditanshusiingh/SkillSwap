// Usage: npm run seed            -> adds sample gigs only if the database has none
//        npm run seed -- --force -> adds them even if gigs already exist
require('dotenv').config();
const mongoose = require('mongoose');
const { seedIfEmpty } = require('./seedData');

(async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error('MONGO_URI is required');
    await mongoose.connect(process.env.MONGO_URI);
    const n = await seedIfEmpty({ force: process.argv.includes('--force') });
    console.log(n ? `Seeded ${n} sample gigs.` : 'Gigs already exist - nothing seeded (use --force to add anyway).');
  } catch (e) {
    console.error(e.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();
