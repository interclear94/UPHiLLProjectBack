import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { User } from "./User.Model";

@Table({
    tableName: "avatar",
    modelName: 'avatar',
    timestamps: true,
    // paranoid: true
})
export class Avatar extends Model {
    @HasMany(() => User, {
        sourceKey: "id",
        foreignKey: "imgid"
    })
    users: User[];

    @Column({
        type: DataType.STRING
    })
    imgurl: string;

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
}