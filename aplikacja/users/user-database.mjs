// tabela wszystkich użytkowników - id, imię, wiek, opis

import { Sequelize, DataTypes } from 'sequelize';

// baza danych w chmurze
const sequelize = new Sequelize('matchit', 'postgres', 'matchit12345', {
    host: '34.159.32.117',
    dialect: 'postgres',
    omitNull: true
});

const Users = sequelize.define('Users', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    desc: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'Users'
});

console.log(`Model users zsynchronizowany pomyslnie`);

try {
    console.log('Nawiązuję połączenie z bazą...');

    await sequelize.authenticate();
    console.log('Udało się.');

    console.log('Synchronizuję modele z zawartością bazy...');
    await sequelize.sync({});
    console.log('Udało się.');

} catch (err) {
    console.error('Unable to connect to the database:', err);
    throw err;
}

export { sequelize, Users };
