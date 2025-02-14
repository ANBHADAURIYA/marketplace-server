
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface TransactionAttributes {
    id: number;
    type: 'buy' | 'sell' | 'trade';
    itemId: number;
    userId: number;
    quantity: number;
    status: 'pending' | 'completed' | 'canceled';
    createdAt: Date;
    updatedAt: Date;
}

interface TransactionCreationAttributes extends Optional<TransactionAttributes, 'id' | 'status' | 'createdAt' | 'updatedAt'> {}

class Transaction extends Model<TransactionAttributes, TransactionCreationAttributes> implements TransactionAttributes {
    public id!: number;
    public type!: 'buy' | 'sell' | 'trade';
    public itemId!: number;
    public userId!: number;
    public quantity!: number;
    public status!: 'pending' | 'completed' | 'canceled';
    public createdAt!: Date;
    public updatedAt!: Date;
}

Transaction.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        type: {
            type: DataTypes.ENUM('buy', 'sell', 'trade'),
            allowNull: false,
        },
        itemId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        quantity: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('pending', 'completed', 'canceled'),
            allowNull: false,
            defaultValue: 'pending',
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: 'transactions',
        sequelize, 
    }
);

export default Transaction;
