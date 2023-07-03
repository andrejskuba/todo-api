import {
  Table,
  Column,
  DataType,
  Model,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
  BelongsTo,
  NotNull,
} from 'sequelize-typescript';
import { User } from '../user/user.model';
import { TodoList } from 'src/todo-list/todo-list.model';

@Table({
  tableName: 'todo_list_owner',
})
export class TodoListOwner extends Model<TodoListOwner> {
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
    field: 'user_id',
    allowNull: false,
  })
  userId: string;

  @ForeignKey(() => User)
  @NotNull
  @Column({
    type: DataType.UUID,
    field: 'author_id',
    allowNull: false,
  })
  authorId: string;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;

  @BelongsTo(() => User)
  author: User;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => TodoList)
  todoList: TodoList;
}
