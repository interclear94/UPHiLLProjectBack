import { Model, Table, Column, DataType } from 'sequelize-typescript';
@Table({
    tableName: 'authcode',
    modelName: 'authcode',
    timestamps: true
})
export class AuthCode extends Model {
    @Column({
        type: DataType.STRING
    })
    dscr: string;
    @Column({
        type: DataType.TEXT
    })
    auth: string;
}