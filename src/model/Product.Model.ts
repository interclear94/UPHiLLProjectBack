import { Model, Table, Column, DataType } from "sequelize-typescript";

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
}