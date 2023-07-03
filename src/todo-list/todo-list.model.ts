import {
  Table,
  Column,
  DataType,
  Model,
  ForeignKey,
  Length,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  BelongsTo,
  NotNull,
  HasMany,
} from 'sequelize-typescript';
import { User } from './../user/user.model';
import { TodoTask } from 'src/todo-task/todo-task.model';
import { TodoListOwner } from 'src/todo-list-owner/todo-list-owner.model';

@Table({
  tableName: 'todo_list',
})
export class TodoList extends Model<TodoList> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => User)
  @NotNull
  @Column({
    type: DataType.UUID,
    field: 'author_id',
    allowNull: false,
  })
  authorId: string;

  @Length({
    min: 1,
    max: 255,
  })
  @NotNull
  @Column({
    allowNull: false,
  })
  title: string;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;

  @DeletedAt
  @Column({ field: 'deleted_at' })
  deletedAt: Date;

  @BelongsTo(() => User)
  author: User;

  @HasMany(() => TodoTask)
  tasks: TodoTask[];

  @HasMany(() => TodoListOwner)
  owners: TodoListOwner[];
}
