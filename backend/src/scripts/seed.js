import 'dotenv/config';
import { connectDB, mongoose } from '../config/db.js';
import { Car } from '../models/Car.js';
import { User } from '../models/User.js';

const demoCars = [
  {
    brand: 'BMW', model: 'X5', year: 2023, category: 'SUV', seating_capacity: 5,
    fuel_type: 'Hybrid', transmission: 'Automatic', pricePerDay: 185,
    location: 'New York', description: 'A comfortable premium SUV for city trips and weekend drives.',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=85',
  },
  {
    brand: 'Porsche', model: '911 Carrera', year: 2024, category: 'Coupe', seating_capacity: 2,
    fuel_type: 'Gas', transmission: 'Automatic', pricePerDay: 320,
    location: 'Los Angeles', description: 'A sports coupe for a memorable coastal drive.',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85',
  },
  {
    brand: 'Mercedes-Benz', model: 'C-Class', year: 2023, category: 'Sedan', seating_capacity: 5,
    fuel_type: 'Gas', transmission: 'Automatic', pricePerDay: 165,
    location: 'Chicago', description: 'A refined sedan with room for everyday travel.',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=85',
  },
  {
    brand: 'Jeep', model: 'Wrangler', year: 2022, category: 'SUV', seating_capacity: 5,
    fuel_type: 'Gas', transmission: 'Manual', pricePerDay: 145,
    location: 'Houston', description: 'A versatile SUV ready for road trips and outdoor plans.',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=85',
  },
  {
    brand: 'Tesla', model: 'Model 3', year: 2024, category: 'Sedan', seating_capacity: 5,
    fuel_type: 'Electric', transmission: 'Automatic', pricePerDay: 155,
    location: 'New York', description: 'A quiet electric sedan for comfortable urban travel.',
    image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=85',
  },
  {
    brand: 'Ford', model: 'Mustang', year: 2023, category: 'Coupe', seating_capacity: 4,
    fuel_type: 'Gas', transmission: 'Automatic', pricePerDay: 175,
    location: 'Los Angeles', description: 'An iconic coupe for a spirited weekend away.',
    image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=85',
  },
];

const run = async () => {
  const email = process.env.DEMO_OWNER_EMAIL?.trim().toLowerCase();
  const password = process.env.DEMO_OWNER_PASSWORD;
  if (!email) throw new Error('Set DEMO_OWNER_EMAIL before seeding.');

  await connectDB();
  let owner = await User.findOne({ email });
  if (!owner) {
    if (!password || password.length < 8) {
      throw new Error('Set DEMO_OWNER_PASSWORD to at least 8 characters to create the demo owner.');
    }
    owner = await User.create({ name: 'Demo Fleet Owner', email, password, role: 'owner' });
  } else if (owner.role !== 'owner') {
    owner.role = 'owner';
    await owner.save();
  }

  for (const car of demoCars) {
    await Car.updateOne(
      { owner: owner._id, brand: car.brand, model: car.model },
      { $set: { ...car, owner: owner._id, isAvailable: true } },
      { upsert: true, runValidators: true }
    );
  }

  console.info(`Seeded ${demoCars.length} demo cars for ${email}.`);
};

run()
  .catch((error) => {
    console.error(`Database seed failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
