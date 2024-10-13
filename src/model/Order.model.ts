import { Model, Table, Column, DataType, Default, ForeignKey, BelongsTo } from "sequelize-typescript";
import { User } from "./User.Model";
import { Product } from "./Product.Model";

@Table({
    tableName: "order",
    modelName: "order",
    timestamps: true
})
export class Order extends Model {
    @ForeignKey(() => User)
    @Column({
        type: DataType.STRING
    })
    userid: string;

    @BelongsTo(() => User, {
        foreignKey: 'userid',
        targetKey: 'userid'
    })
    user: User;

    @Column({
        type: DataType.DATE
    })
    data: Date;

    @ForeignKey(() => Product)
    @Column({
        type: DataType.INTEGER
    })
    productid: number;

    @BelongsTo(() => Product, {
        foreignKey: 'productid',
        targetKey: 'id'
    })
    product: Product;

    @Column({
        type: DataType.INTEGER
    })
    price: number;

    @Default(false)
    @Column({
        type: DataType.BOOLEAN
    })
    usage: boolean;
}