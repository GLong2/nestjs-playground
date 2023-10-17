import { Inject, Injectable, LoggerService, OnModuleInit } from '@nestjs/common';
import { Client } from '@notionhq/client';
import { numberProperty, richTextProperty, titleProperty } from './helpers/properties.helper';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto ';
import { transformData } from './helpers/objectConvertor.helper';
import { Observable, Subject, mergeMap } from 'rxjs';

@Injectable()
export class NotionService implements OnModuleInit {
  constructor(@Inject('NotionServiceLogger') private readonly logger: LoggerService) {}

  private notion = new Client({ auth: process.env.NOTION_TOKEN });
  private readonly databaseId = process.env.NOTION_DATABASE_ID;
  private employee$: Subject<any> = new Subject();

  async onModuleInit() {}

  sseEmployee(): Observable<any> {
    return this.employee$.pipe(
      mergeMap(async (_) => {
        const employee = await this.selectEmployee();
        return { data: { employee } };
      }),
    );
  }

  async selectEmployee(): Promise<any> {
    try {
      const response: any = await this.notion.databases.query({
        database_id: this.databaseId,
      });
      const outputData = transformData(response.results);
      return outputData;
    } catch (error) {
      this.logger.error(error, error.stack);
      throw error;
    }
  }

  async createEmployee(createEmployeeDto: CreateEmployeeDto): Promise<any> {
    try {
      const propertyFirstName = richTextProperty('FirstName', createEmployeeDto.FirstName);
      const propertyLastName = richTextProperty('LastName', createEmployeeDto.LastName);
      const propertySalary = numberProperty('Salary', createEmployeeDto.Salary);
      const propertyAge = numberProperty('Age', createEmployeeDto.Age);

      const responseSelectEmployee = await this.selectEmployee();
      const propertyNo = titleProperty('No', (responseSelectEmployee.length + 1).toString());

      const employee = { ...propertyFirstName, ...propertyLastName, ...propertySalary, ...propertyAge, ...propertyNo };

      const response: any = await this.notion.pages.create({
        parent: { database_id: this.databaseId },
        properties: employee,
      });
      this.employee$.next(null);
      return response.results;
    } catch (error) {
      this.logger.error(error, error.stack);
      throw error;
    }
  }

  async updateEmployee(id: string, updateEmployeeDto: UpdateEmployeeDto): Promise<any> {
    try {
      let employee = {};

      if (updateEmployeeDto.FirstName) {
        const propertyFirstName = richTextProperty('FirstName', updateEmployeeDto.FirstName);
        employee = { ...employee, ...propertyFirstName };
      }

      if (updateEmployeeDto.LastName) {
        const propertyLastName = richTextProperty('LastName', updateEmployeeDto.LastName);
        employee = { ...employee, ...propertyLastName };
      }

      if (updateEmployeeDto.Salary) {
        const propertySalary = numberProperty('Salary', updateEmployeeDto.Salary);
        employee = { ...employee, ...propertySalary };
      }

      if (updateEmployeeDto.Age) {
        const propertyAge = numberProperty('Age', updateEmployeeDto.Age);
        employee = { ...employee, ...propertyAge };
      }

      const response: any = await this.notion.pages.update({
        page_id: id,
        properties: employee,
      });
      this.employee$.next(null);
      return response.results;
    } catch (error) {
      this.logger.error(error, error.stack);
      throw error;
    }
  }

  async removeEmployee(id: string): Promise<any> {
    try {
      const response: any = await this.notion.pages.update({ page_id: id, archived: true });
      this.employee$.next(null);
      return response.results;
    } catch (error) {
      this.logger.error(error, error.stack);
      throw error;
    }
  }
}
