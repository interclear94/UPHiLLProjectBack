import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({
    tableName: "avatar",
    modelName: 'avatar',
    timestamps: true
})
export class Avatar extends Model {
    @Column({
        type: DataType.STRING
    })
    imgurl: string;

    @Column({
        type: DataType.STRING
    })
    userid: string;
}