import { NUMBER } from 'sequelize';
import { Table, Model, Column, DataType, Default } from 'sequelize-typescript';

@Table({
    tableName: 'user',
    modelName: 'user',
    timestamps: true,
})
export class User extends Model {
    @Column({
        type: DataType.STRING
    })
    name: string;

    @Column({
        type: DataType.STRING
    })
    nickname: string;

    @Column({
        type: DataType.STRING
    })
    userid: string;

    @Column({
        type: DataType.STRING
    })
    userpw: string

    @Column({
        type: DataType.INTEGER
    })
    authcode: number;

    @Column({
        type: DataType.STRING
    })
    imgid: string;

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