const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');
const Role = require('./role');

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    }
});


const UserRoles = sequelize.define('UserRoles', {
    userrolesId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
}, {
        timestamps: false
})

module.exports = { User, UserRoles }