import { Model, Table, Column, DataType, Default } from "sequelize-typescript";

@Table({
    tableName: "order",
    modelName: "order",
    timestamps: true
})
export class Order extends Model {
    @Column({
        type: DataType.STRING
    })
    userid: string;

    @Column({
        type: DataType.DATE
    })
    data: Date;

    @Column({
        type: DataType.INTEGER
    })
    productid: number;

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