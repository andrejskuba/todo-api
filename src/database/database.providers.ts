import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';
import { TodoListOwner } from 'src/todo-list-owner/todo-list-owner.model';
import { TodoList } from 'src/todo-list/todo-list.model';
import { TodoTask } from 'src/todo-task/todo-task.model';
import { User } from 'src/user/user.model';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async (configService: ConfigService) => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: configService.get('DB_HOST') || 'localhost',
        port: configService.get('DB_PORT') || 5432,
        username: configService.get('DB_USER') || 'postgres',
        password: configService.get('DB_PASS') || '',
        database: configService.get('DB_NAME') || 'todo_db',
        logging: false,
      });
      sequelize.addModels([User, TodoList, TodoTask, TodoListOwner]);
      // await sequelize.sync();
      return sequelize;
    },
    inject: [ConfigService],
  },
];
