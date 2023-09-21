import { Injectable } from '@nestjs/common';
import { Client } from '@notionhq/client';

@Injectable()
export class NotionService {
  private notion = new Client({ auth: process.env.NOTION_TOKEN });
  private readonly databaseId = process.env.NOTION_DATABASE_ID;

  async fetchPages(): Promise<any> {
    try {
      const response: any = await this.notion.databases.query({
        database_id: this.databaseId,
      });
      return response.results;
    } catch (error) {ㅋㅋ
      console.error('Error fetching Notion pages: ', error);
      throw error;
    }
  }
}
