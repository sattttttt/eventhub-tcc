import db from './config/database.js';
import { Category } from './model/index.js';

const seedCategories = async () => {
  try {
    await db.sync(); // Sinkronkan database
    console.log('Database synchronized.');

    const categories = [
      { name: 'Workshop' },
      { name: 'Seminar' },
      { name: 'Musik' },
      { name: 'Olahraga' },
      { name: 'Teknologi' },
      { name: 'Seni & Budaya' },
    ];

    // Cek apakah kategori sudah ada, jika tidak, baru buat
    for (const cat of categories) {
      await Category.findOrCreate({
        where: { name: cat.name },
        defaults: cat
      });
    }

    console.log('Categories have been seeded successfully!');
  } catch (error) {
    console.error('Error seeding categories:', error);
  } finally {
    await db.close();
  }
};

seedCategories();