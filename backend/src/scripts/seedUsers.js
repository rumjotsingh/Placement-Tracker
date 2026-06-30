import connectDB from '../config/db.js';
import User from '../models/User.js';
import { ROLES } from '../constants/index.js';

const users = [
  {
    name: 'System Admin',
    email: 'admin@placetrack.edu',
    password: 'admin123',
    role: ROLES.ADMIN,
  },
  {
    name: 'Placement Coordinator',
    email: 'coordinator@placetrack.edu',
    password: 'coord123',
    role: ROLES.COORDINATOR,
  },
];

const seed = async () => {
  await connectDB();

  for (const data of users) {
    const existing = await User.findOne({ email: data.email });
    if (existing) {
      console.log(`Skipped (exists): ${data.email} (${data.role})`);
      continue;
    }

    await User.create(data);
    console.log(`Created: ${data.email} (${data.role})`);
  }

  console.log('\n--- Login Credentials ---');
  console.log('Admin:       admin@placetrack.edu / admin123');
  console.log('Coordinator: coordinator@placetrack.edu / coord123');

  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
