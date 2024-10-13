import { Model, Table, Column, DataType, HasMany } from 'sequelize-typescript';
import { User } from './User.Model';
@Table({
    tableName: 'authcode',
    timestamps: true,
    paranoid: true
})
export class AuthCode extends Model {
    @Column({
        type: DataType.STRING
    })
    dscr: string;

    @Column({
        type: DataType.INTEGER
    })
    auth: number;

    @HasMany(() => User, {
        sourceKey: "authcode",
        foreignKey: "id"
    })
    user: User[];


}