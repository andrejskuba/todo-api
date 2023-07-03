import {
  Get,
  Post,
  Patch,
  Body,
  Param,
  Controller,
  ParseUUIDPipe,
  Delete,
  Request,
  HttpException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { TodoListService } from './todo-list.service';
import { TodoListDto } from './dto/todo-list.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { UserService } from 'src/user/user.service';
import { Action, CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { TodoListCreateDto } from './dto/todo-list-create.dto';
import { TodoListShareDto } from './dto/todo-list-share.dto';
import { ValidationPipe } from 'src/validation.pipe';
import { UserDto } from 'src/user/dto/user.dto';
import { TodoTaskCreateDto } from 'src/todo-task/dto/todo-task-create.dto';
import { TodoTaskService } from 'src/todo-task/todo-task.service';
import { TodoTaskUpdateDto } from 'src/todo-task/dto/todo-task-update.dto';

@Controller('todo-lists')
@ApiTags('todo-lists')
export class TodoListController {
  constructor(
    private readonly todoListService: TodoListService,
    private readonly todoTaskService: TodoTaskService,
    private readonly userService: UserService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get the list of todos' })
  @ApiOkResponse({ type: [TodoListDto] })
  async findAll(): Promise<TodoListDto[]> {
    return (await this.todoListService.findAll()).map(
      (list) => new TodoListDto(list),
    );
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get todo details' })
  @ApiOkResponse({ type: TodoListDto })
  @ApiParam({ name: 'id', required: true })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<TodoListDto> {
    return new TodoListDto(await this.todoListService.findOne(id));
  }

  @Get(':id/owners')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the list of owners' })
  @ApiOkResponse({ type: [UserDto] })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'No access' })
  async owners(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UserDto[]> {
    const user = await this.userService.getCurrentUser(req);
    const todoList = await this.todoListService.findOne(id);
    const ability = this.caslAbilityFactory.createForUser(user);
    if (!ability.can(Action.Share, todoList)) {
      throw new HttpException(
        'No access to this todo list',
        HttpStatus.FORBIDDEN,
      );
    }
    return todoList.owners.map((owner) => new UserDto(owner.user));
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new todo list' })
  @ApiBody({ type: TodoListCreateDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successfully created',
    type: TodoListDto,
  })
  async create(
    @Request() req,
    @Body() todoListCreateDto: TodoListCreateDto,
  ): Promise<TodoListDto> {
    const user = await this.userService.getCurrentUser(req);
    const todoList = await this.todoListService.create(
      {
        authorId: user.id,
        ...todoListCreateDto,
      },
      user,
    );
    return new TodoListDto(todoList);
  }

  @Post(':id/owners')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Share todo list to another user' })
  @ApiParam({ name: 'id', required: true })
  @ApiBody({ type: TodoListShareDto })
  @ApiOkResponse({ type: [UserDto] })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'No access' })
  async share(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ValidationPipe()) todoListShareDto: TodoListShareDto,
  ): Promise<UserDto[]> {
    const user = await this.userService.getCurrentUser(req);
    const todoList = await this.todoListService.findOne(id);
    const ability = this.caslAbilityFactory.createForUser(user);
    if (!ability.can(Action.Share, todoList)) {
      throw new HttpException(
        'No access to this todo list',
        HttpStatus.FORBIDDEN,
      );
    }
    await this.todoListService.share(id, todoListShareDto.userId, user);
    return todoList.owners.map((owner) => new UserDto(owner.user));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete todo list' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Successfully deleted',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'No access' })
  async delete(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<any> {
    const user = await this.userService.getCurrentUser(req);
    const todoList = await this.todoListService.findOne(id);

    const ability = this.caslAbilityFactory.createForUser(user);
    if (!ability.can(Action.Delete, todoList)) {
      throw new HttpException(
        'No access to this todo list',
        HttpStatus.FORBIDDEN,
      );
    }
    return this.todoListService.delete(id);
  }

  @Delete(':id/owners/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete todo list owner' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Successfully deleted',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'No access' })
  async deleteOwner(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<any> {
    const user = await this.userService.getCurrentUser(req);
    const todoList = await this.todoListService.findOne(id);

    const ability = this.caslAbilityFactory.createForUser(user);
    if (!ability.can(Action.Share, todoList)) {
      throw new HttpException(
        'No access to this todo list',
        HttpStatus.FORBIDDEN,
      );
    }
    return this.todoListService.deleteOwner(todoList, userId);
  }

  @Post(':id/tasks')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new task' })
  @ApiBody({ type: TodoTaskCreateDto })
  @ApiOkResponse({ type: TodoListDto })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'No access' })
  async addTodoTask(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ValidationPipe()) todoTaskCreateDto: TodoTaskCreateDto,
  ): Promise<TodoListDto> {
    const user = await this.userService.getCurrentUser(req);
    const todoList = await this.todoListService.findOne(id);
    const ability = this.caslAbilityFactory.createForUser(user);
    if (!ability.can(Action.Update, todoList)) {
      throw new HttpException(
        'No access to this todo list',
        HttpStatus.FORBIDDEN,
      );
    }
    await this.todoTaskService.create(todoList, todoTaskCreateDto, user);
    // re-load with all actual data
    return new TodoListDto(await this.todoListService.findOne(todoList.id));
  }

  @Patch(':id/tasks/:taskId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update existing task' })
  @ApiBody({ type: TodoTaskUpdateDto })
  @ApiOkResponse({ type: TodoListDto })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'No access' })
  async updateTodoTask(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Param('task_id', ParseUUIDPipe) taskId: string,
    @Body(new ValidationPipe()) todoTaskUpdateDto: TodoTaskUpdateDto,
  ): Promise<TodoListDto> {
    const user = await this.userService.getCurrentUser(req);
    const todoList = await this.todoListService.findOne(id);
    const ability = this.caslAbilityFactory.createForUser(user);
    if (!ability.can(Action.Update, todoList)) {
      throw new HttpException(
        'No access to this todo list',
        HttpStatus.FORBIDDEN,
      );
    }
    await this.todoTaskService.update(taskId, todoTaskUpdateDto, user);
    // re-load with all actual data
    return new TodoListDto(await this.todoListService.findOne(todoList.id));
  }

  @Delete(':id/tasks/:taskId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete todo task' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Successfully deleted',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'No access' })
  async deleteTask(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Param('taskId', ParseUUIDPipe) taskId: string,
  ): Promise<any> {
    const user = await this.userService.getCurrentUser(req);
    const todoList = await this.todoListService.findOne(id);

    const ability = this.caslAbilityFactory.createForUser(user);
    if (!ability.can(Action.Delete, todoList)) {
      throw new HttpException(
        'No access to this todo list',
        HttpStatus.FORBIDDEN,
      );
    }
    return this.todoTaskService.deleteTask(taskId);
  }
}
