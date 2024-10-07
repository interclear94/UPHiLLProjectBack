import { Model, Table, Column, DataType, BelongsTo, HasMany, PrimaryKey, AutoIncrement } from 'sequelize-typescript';
import { User } from './User.Model';
@Table({
    tableName: 'authcode',
    modelName: 'authcode',
    timestamps: true
})
export class AuthCode extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @Column({
        type: DataType.STRING
    })
    dscr: string;

    @Column({
        type: DataType.TEXT
    })
    auth: string;


    @HasMany(() => User, {
        sourceKey: 'id'
    })
    user: User[];
}