import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserDto } from './dtos/CreateUserDto';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) { }

    @Get()
    async getHello() {
        const result = await this.appService.getHello()

        return result;
    }

    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        console.log("createUserDto", createUserDto)

        return "Hello User!"
    }
}