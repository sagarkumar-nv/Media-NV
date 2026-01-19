import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/createuser.dto";
import { UpdateUserDto } from "./dto/updateuser.dto";
import { QueryUserDto } from "./dto/queryuser.dto";

@Controller("users")
export class UserController {
    constructor(private readonly service: UserService) { }

    @Post()
    create(@Body() dto: CreateUserDto) {
        return this.service.create(dto);
    }

    @Get()
    findAll(@Query() query: QueryUserDto) {
        return this.service.findAll(query.page, query.limit);
    }

    @Get(":id")
    findOne(@Param("id") id: number) {
        return this.service.findOne(id);
    }

    @Patch(":id")
    update(@Param("id") id: number, @Body() dto: UpdateUserDto) {
        return this.service.update(id, dto);
    }

    @Delete(":id")
    delete(@Param("id") id: number) {
        return this.service.softDelete(id);
    }
}
