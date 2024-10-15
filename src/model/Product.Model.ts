import { Model, Table, Column, DataType, HasMany, PrimaryKey, AutoIncrement } from "sequelize-typescript";
import { Order } from "./Order.model";
import { Avatar } from "./Avatar.Model";

@Table({
    tableName: "product",
    modelName: "product",
    timestamps: true
})

export class Product extends Model {
    @Column({
        type: DataType.STRING
    })
    name: string;

    @Column({
        type: DataType.INTEGER
    })
    price: number;

    @Column({
        type: DataType.STRING
    })
    image: string;

    @Column({
        type: DataType.TEXT
    })
    dscr: string;

    @Column({
        type: DataType.STRING
    })
    type: string;

    @HasMany(() => Avatar, {
        sourceKey: "id",
        foreignKey: "productid"
    })
    avatars: Avatar[];

    @HasMany(() => Order, {
        sourceKey: 'id',
        foreignKey: 'productid'
    })
    orders: Order[];
}