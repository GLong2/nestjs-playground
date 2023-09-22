import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { NotionService } from './notion.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto ';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('notion')
@Controller('notion')
export class NotionController {
  constructor(private readonly notionService: NotionService) {}

  @Get('employee/get')
  async selectEmployee() {
    return await this.notionService.selectEmployee();
  }

  @Post('employee/add')
  async createEmployee(@Body() createEmployeeDto: CreateEmployeeDto) {
    return await this.notionService.createEmployee(createEmployeeDto);
  }

  @Patch('employee/update/:id')
  async updateEmployee(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return await this.notionService.updateEmployee(id, updateEmployeeDto);
  }

  @Delete('employee/remove/:id')
  async removeEmployee(@Param('id') id: string) {
    return await this.notionService.removeEmployee(id);
  }
}
