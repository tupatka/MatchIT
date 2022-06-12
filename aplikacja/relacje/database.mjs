// tabela wszystkich użytkowników - w mikroserwisie users
// tabela match relacji jednokierunkowych
// tabela odrzuceni 

import { Sequelize, DataTypes } from 'sequelize';

// baza danych w chmurze
const sequelize = new Sequelize('matchit', 'postgres', 'matchit12345', {
  host: '34.159.32.117',
  dialect: 'postgres',
  omitNull: true
});

const Match = sequelize.define('Match', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_1: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  user_2: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'Matches'
});

console.log(`Model matches zsynchronizowany pomyslnie`);

const Hate = sequelize.define('Hate', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_1: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  user_2: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'Hates'
});

console.log(`Model Hates zsynchronizowany pomyslnie`);


try {
  console.log('Nawiązuję połączenie z bazą...');

  await sequelize.authenticate();
  console.log('Udało się.');

  console.log('Synchronizuję modele z zawartością bazy...');
  await sequelize.sync();
  console.log('Udało się.');

} catch (err) {
  console.error('Unable to connect to the database:', err);
  throw err;
}

export { sequelize, Match, Hate };
