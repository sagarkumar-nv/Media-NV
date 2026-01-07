import { Body, Controller, Get, Param, Patch, Post, ParseIntPipe, Delete } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { CatService } from './cat.service';
import { Cat } from './entity/cat.entity';
import { CreateCatDto } from './dto/create-cat-dto';

@ApiTags('cats')
@Controller('cat')
export class CatController {
    constructor(private readonly catSer: CatService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new cat' })
    @ApiResponse({ status: 201, description: 'Cat created successfully' })
    create(@Body() createCatDto: CreateCatDto): Promise<Cat> {
        return this.catSer.create(createCatDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all cats' })
    @ApiResponse({ status: 200, description: 'List of cats' })
    findAll(): Promise<Cat[]> {
        return this.catSer.findAll();
    }

    @Get(':breed')
    @ApiOperation({ summary: 'Get cats by breed' })
    @ApiParam({ name: 'breed', example: 'Persian' })
    @ApiResponse({ status: 200, description: 'Cats filtered by breed' })
    findByBreed(@Param('breed') breed: string ) {
        return this.catSer.findByBreed(breed);
    }
    @Patch(':id')
    @ApiOperation({ summary: 'Update a cat by ID' })
    @ApiParam({
        name: 'id',
        type: Number,
        example: 1,
        description: 'ID of the cat to update',
    })
    @ApiBody({
        type: CreateCatDto,
        description: 'Updated cat data',
    })
    @ApiResponse({
        status: 200,
        description: 'Cat updated successfully',
    })
    @ApiResponse({
        status: 404,
        description: 'Cat not found',
    })
    update(@Param('id', ParseIntPipe) id: number,
    @Body() createCatDto: CreateCatDto,
    ): Promise<Cat> {
        return this.catSer.update(id, createCatDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a cat by ID' })
    @ApiParam({
        name: 'id',
        type: Number,
        example: 1,
        description: 'ID of the cat to delete',
    })
    @ApiResponse({
        status: 200,
        description: 'Cat deleted successfully',
    })
    @ApiResponse({
        status: 404,
        description: 'Cat not found',
    })
    remove(
        @Param('id', ParseIntPipe) id: number): Promise< { msg:  string }> {
            return this.catSer.remove(id);
        }

    
}
