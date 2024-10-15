import { Model, Table, Column, DataType, Default, ForeignKey, BelongsTo } from "sequelize-typescript";
import { User } from "./User.Model";
import { Product } from "./Product.Model";

@Table({
    tableName: "order",
    modelName: "order",
    timestamps: true
})

export class Order extends Model {
    @Column({
        type: DataType.STRING
    })
    email: string;

    @BelongsTo(() => User, {
        foreignKey: 'email',
        targetKey: 'email'
    })
    user: User;

    @Column({
        type: DataType.DATE
    })
    date: Date;

    @ForeignKey(() => Product)
    @Column({
        type: DataType.INTEGER
    })
    productid: number;

    @BelongsTo(() => Product, {
        targetKey: 'id',
        foreignKey: 'productid'
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