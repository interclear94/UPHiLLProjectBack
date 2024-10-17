import { BelongsTo, Column, DataType, Default, Model, Table } from "sequelize-typescript";
import { User } from "./User.Model";
import { Product } from "./Product.Model";

@Table({
    tableName: "avatar",
    modelName: 'avatar',
    timestamps: true,
})

export class Avatar extends Model {
    @Column({
        type: DataType.STRING
    })
    email: string

    @BelongsTo(() => User, {
        targetKey: "email",
        foreignKey: "email"
    })
    user: User;

    @Default(1)
    @Column({
        type: DataType.INTEGER
    })
    productid: number;

    @BelongsTo(() => Product, {
        targetKey: "id",
        foreignKey: "productid"
    })
    product: Product;
}