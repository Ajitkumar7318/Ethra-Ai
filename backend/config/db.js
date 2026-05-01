const { Sequelize } = require('sequelize');
const path = require('path');

let sequelize;

// Use PostgreSQL on Railway (DATABASE_URL provided automatically)
// Fall back to SQLite for local development
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Required for Railway/Heroku PG
      },
    },
    logging: false,
  });
} else {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '..', 'flowforge.sqlite'),
    logging: false,
  });
}

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    const dialect = process.env.DATABASE_URL ? 'PostgreSQL' : 'SQLite';
    console.log(`${dialect} connected successfully.`);
    await sequelize.sync({ alter: true });
    console.log('Database synced.');
  } catch (error) {
    console.error('Unable to connect to the database:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
