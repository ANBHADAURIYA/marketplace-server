import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('hashers', 'root', '828521', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
});

export default sequelize;
