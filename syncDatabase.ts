import sequelize from './config/database'; // Adjust the path to your database configuration
import Transaction from './models/transaction'; // Adjust the path to your Transaction model

const syncDatabase = async () => {
    try {
        await sequelize.sync({ force: true }); // Use { force: true } to drop and recreate the table
        console.log('Database synchronized successfully.');
    } catch (error) {
        console.error('Error synchronizing database:', error);
    } finally {
        await sequelize.close();
    }
};

syncDatabase();
