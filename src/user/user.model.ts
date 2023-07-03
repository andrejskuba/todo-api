import {
  Table,
  Column,
  Model,
  Unique,
  DataType,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  NotNull,
} from 'sequelize-typescript';

@Table({
  tableName: 'user',
})
export class User extends Model<User> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV1,
    primaryKey: true,
  })
  id: string;

  @Unique
  @NotNull
  @Column({
    allowNull: false,
  })
  username: string;

  @NotNull
  @Column({
    allowNull: false,
  })
  password: string;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;

  @DeletedAt
  @Column({ field: 'deleted_at' })
  deletedAt: Date;
}
