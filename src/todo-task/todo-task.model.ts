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
} from 'sequelize-typescript';
import { User } from '../user/user.model';
import { TodoList } from 'src/todo-list/todo-list.model';

export enum TodoTaskStatus {
  ACTIVE = 'ACTIVE',
  DONE = 'DONE',
  CANCELLED = 'CANCELLED',
}

@Table({
  tableName: 'todo_task',
})
export class TodoTask extends Model<TodoTask> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => TodoList)
  @NotNull
  @Column({
    type: DataType.UUID,
    field: 'todo_list_id',
    allowNull: false,
  })
  todoListId;

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

  @NotNull
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description: string;

  @NotNull
  @Column({
    allowNull: false,
  })
  deadline: Date;

  @NotNull
  @Column({
    allowNull: false,
  })
  order: number;

  @NotNull
  @Column({
    type: DataType.ENUM(
      TodoTaskStatus.ACTIVE,
      TodoTaskStatus.CANCELLED,
      TodoTaskStatus.DONE,
    ),
    allowNull: false,
  })
  status: TodoTaskStatus;

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

  @BelongsTo(() => TodoList)
  todoList: TodoList;
}
