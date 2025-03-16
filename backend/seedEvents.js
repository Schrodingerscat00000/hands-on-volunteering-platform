// backend/seedEvents.js
const { sequelize, Event } = require('./models');

async function seed() {
  try {
    // Sync database (force: false to avoid dropping existing data)
    await sequelize.sync({ force: false });

    // Insert events
    await Event.bulkCreate([
      {
        title: 'Park Cleanup',
        description: 'Join us to clean the local park.',
        date: '2025-03-20',
        time: '10:00',
        location: 'Central Park',
        category: 'environment',
        organizerId: 1, 
        teamId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Tutoring Session',
        description: 'Help kids with homework.',
        date: '2025-03-22',
        time: '14:00',
        location: 'Community Center',
        category: 'education',
        organizerId: 2, 
        teamId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Food Drive',
        description: 'Collect donations for the needy.',
        date: '2025-03-25',
        time: '09:00',
        location: 'Downtown Square',
        category: 'poverty',
        organizerId: 3, 
        teamId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    console.log('Events seeded successfully');
  } catch (err) {
    console.error('Error seeding events:', err);
  } finally {
    await sequelize.close(); // Close the connection
    process.exit();
  }
}

seed();