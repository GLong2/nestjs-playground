import { Injectable } from '@nestjs/common';
import { Client } from '@notionhq/client';
import { numberProperty, richTextProperty, titleProperty } from './helpers/properties.helper';

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

  async createEmployee(createEmployeeDto: any): Promise<any> {
    try {
      const propertyFirstName = richTextProperty('FirstName', '홍규');
      const propertyLastName = richTextProperty('LastName', '정');
      const propertySalary = numberProperty('Salary', 3000);
      const propertyAge = numberProperty('Age', 30);

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

  async updateEmployee(id: string, updateEmployeeDto: any): Promise<any> {
    try {
      // const propertyFirstName = richTextProperty('FirstName', '홍규');
      // const propertyLastName = richTextProperty('LastName', '정');
      // const propertySalary = numberProperty('Salary', 3000);
      // const propertyAge = numberProperty('Age', 30);

      // const responseSelectEmployee = await this.selectEmployee();
      // const propertyNo = titleProperty('No', (responseSelectEmployee.length + 1).toString());

      // const employee = { ...propertyFirstName, ...propertyLastName, ...propertySalary, ...propertyAge, ...propertyNo };

      const propertyFirstName = richTextProperty('FirstName', '민규');
      const propertyLastName = richTextProperty('LastName', '김');
      const employee = { ...propertyLastName, ...propertyFirstName };

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
