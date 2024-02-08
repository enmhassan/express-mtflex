const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');

const Role = sequelize.define('Role', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING
    }
});

module.exports = Role