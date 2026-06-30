import app from './app.js';
import connectDB from './config/db.js';
import env from './config/env.js';
import { startCronJobs } from './jobs/profileSync.js';

const startServer = async () => {
  await connectDB();
  startCronJobs();

  app.listen(env.port, () => {
    console.log(`PlaceTrack Pro API running on port ${env.port}`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
