import { Table, Model, Column, DataType, Default, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { AuthCode } from './Autocode.Model';
import { Avatar } from './Avatar.Model';

@Table({
    tableName: 'user',
    modelName: 'user',
    timestamps: true,
})
export class User extends Model {
    @Column({
        type: DataType.STRING
    })
    userid: string;

    @HasMany(() => Avatar, {
        sourceKey: "userid",
        foreignKey: "userid"
    })
    avatars: Avatar[];

    @Column({
        type: DataType.STRING
    })
    userpw: string;

    @Column({
        type: DataType.STRING
    })
    nickname: string;

    @Column({
        type: DataType.STRING
    })
    name: string

    @Column({
        type: DataType.STRING
    })
    phone: string;

    @Column({
        type: DataType.DATE
    })
    birth: Date

    @Default(1)
    @ForeignKey(() => AuthCode)
    @Column({
        type: DataType.INTEGER
    })
    auth: number;

    @BelongsTo(() => AuthCode, {
        foreignKey: 'auth',
        targetKey: 'id'
    })
    authcode: AuthCode;

    @ForeignKey(() => Avatar)
    @Column({
        type: DataType.STRING
    })
    imgid: string;

    @BelongsTo(() => Avatar, {
        foreignKey: 'imgid',
        targetKey: 'id'
    })
    avatar: Avatar;

    @Default(0)
    @Column({
        type: DataType.INTEGER,
    })
    point: number;

    @Column({
        type: DataType.STRING
    })
    phone: string;

}