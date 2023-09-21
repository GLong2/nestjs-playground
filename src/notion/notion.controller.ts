import { Controller, Get } from '@nestjs/common';
import { NotionService } from './notion.service';

@Controller('notion')
export class NotionController {
  constructor(private readonly notionService: NotionService) {}

  @Get('pages')
  async fetchPages() {
    return await this.notionService.fetchPages();
  }
}
