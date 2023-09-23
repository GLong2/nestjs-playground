import { Body, Controller, Delete, Get, Inject, Logger, LoggerService, Param, Patch, Post } from '@nestjs/common';
import { NotionService } from './notion.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto ';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('notion')
@Controller('notion')
export class NotionController {
  constructor(
    private readonly notionService: NotionService,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {}

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

  // private printLoggerServiceLog(dto) {
  //   try {
  //     throw new InternalServerErrorException('test');
  //   } catch (e) {
  //     this.logger.error('error: ' + JSON.stringify(dto), e.stack);
  //   }
  //   this.logger.warn('warn: ' + JSON.stringify(dto));
  //   this.logger.log('log: ' + JSON.stringify(dto));
  //   this.logger.verbose('verbose: ' + JSON.stringify(dto));
  //   this.logger.debug('debug: ' + JSON.stringify(dto));
  // }
}
