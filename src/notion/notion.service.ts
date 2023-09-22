import { Injectable } from '@nestjs/common';
import { Client } from '@notionhq/client';
import { numberProperty, richTextProperty, titleProperty } from './helpers/properties.helper';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto ';

@Injectable()
export class NotionService {
  private notion = new Client({ auth: process.env.NOTION_TOKEN });
  private readonly databaseId = process.env.NOTION_DATABASE_ID;

  async selectEmployee(): Promise<any> {
    try {
      const response: any = await this.notion.databases.query({
        database_id: this.databaseId,
      });
      return response.results;
    } catch (error) {
      console.error('Error fetching Notion pages: ', error);
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
      return response.results;
    } catch (error) {
      console.error('Error fetching Notion pages: ', error);
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
      return response.results;
    } catch (error) {
      console.error('Error fetching Notion pages: ', error);
      throw error;
    }
  }

  async removeEmployee(id: string): Promise<any> {
    try {
      const response: any = await this.notion.pages.update({ page_id: id, archived: true });
      return response.results;
    } catch (error) {
      console.error('Error fetching Notion pages: ', error);
      throw error;
    }
  }
}
