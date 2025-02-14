import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../database';

interface ItemAttributes {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    userId: number;
}

interface ItemCreationAttributes extends Optional<ItemAttributes, 'id' | 'image'> {}

class Item extends Model<ItemAttributes, ItemCreationAttributes> implements ItemAttributes {
    public id!: number;
    public name!: string;
    public description!: string;
    public price!: number;
    public image!: string;
    public userId!: number;
}

Item.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
        description: {
            type: new DataTypes.STRING(256),
            allowNull: false,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        image: {
            type: new DataTypes.STRING(256),
            allowNull: true,
            // defaultValue: 'https://via.placeholder.com/150',
        },
        userId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
    },
    {
        tableName: 'items',
        sequelize,
    }
);

export default Item;
