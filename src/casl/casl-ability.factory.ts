import { Injectable } from '@nestjs/common';
import {
  ExtractSubjectType,
  AbilityBuilder,
  createMongoAbility,
  InferSubjects,
} from '@casl/ability';
import { TodoList } from 'src/todo-list/todo-list.model';
import { User } from 'src/user/user.model';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
  Share = 'share',
}

type Subjects = InferSubjects<TodoList | typeof TodoList>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, build } = new AbilityBuilder(createMongoAbility);

    can([Action.Update, Action.Delete, Action.Share], TodoList, {
      owners: { $elemMatch: { userId: user.id } },
    });

    return build({
      // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
