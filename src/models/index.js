// src/models/index.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'library.sqlite'
});

const Member = sequelize.define('Member', {
    code: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    name: DataTypes.STRING,
    penaltyUntil: DataTypes.DATE
});

const Book = sequelize.define('Book', {
    code: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    title: DataTypes.STRING,
    author: DataTypes.STRING,
    stock: DataTypes.INTEGER
});

const Borrow = sequelize.define('Borrow', {
    borrowDate: DataTypes.DATE,
    returnDate: DataTypes.DATE
});

Member.belongsToMany(Book, { through: Borrow });
Book.belongsToMany(Member, { through: Borrow });

module.exports = { sequelize, Member, Book, Borrow };
