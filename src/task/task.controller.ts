import { Controller, Get, Post, Body, Put, Delete, Param, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../users/guards/jwt-auth.guard';

@Controller('tasks')
@UseGuards(JwtAuthGuard) // Protect all routes in this controller
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  findAll(@Request() req) {
    // req.user contains the authenticated user from JWT
    console.log('Authenticated user:', req.user.username);
    return this.taskService.findAll();
  }

  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @Request() req) {
    // You can access the authenticated user here
    const userId = req.user.id;
    console.log('Creating task for user:', userId);
    return this.taskService.create(createTaskDto, userId);
  }

  @Get('my-tasks')
  findMyTasks(@Request() req) {
    // Example of using user data from JWT
    const userId = req.user.id;
    console.log('Finding tasks for user:', userId);
    return this.taskService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const userId = req.user.id;
    return this.taskService.findOne(id, userId);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @Request() req,
  ) {
    const userId = req.user.id;
    return this.taskService.update(id, updateTaskDto, userId);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const userId = req.user.id;
    return this.taskService.remove(id, userId);
  }
}
