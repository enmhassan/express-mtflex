const sequelize = require("../config/db");
const User = require("./user").User;
const UserRoles = require("./user").UserRoles;
const Role = require("./role");

User.belongsToMany(Role, { through: "UserRoles", foreignKey: "user_id" });
Role.belongsToMany(User, { through: "UserRoles", foreignKey: "role_id" });

// (function initial() {
//     Role.create({
//         id: 1,
//         name: "user"
//     });

//     Role.create({
//         id: 2,
//         name: "moderator"
//     });

//     Role.create({
//         id: 3,
//         name: "admin"
//     });
// })()

sequelize.models.User.sync();
sequelize.models.Role.sync();
sequelize.models.UserRoles.sync();
