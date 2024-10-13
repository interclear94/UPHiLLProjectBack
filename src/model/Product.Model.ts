import { Model, Table, Column, DataType, HasMany } from "sequelize-typescript";
import { Order } from "./Order.model";

@Table({
    tableName: "product",
    modelName: "product",
    timestamps: true
})
export class Product extends Model {
    @HasMany(() => Order, {
        sourceKey: "id",
        foreignKey: "productid"
    })
    orders: Order[];

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
}