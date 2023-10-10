import { ExceptionFilter, Catch, ArgumentsHost, NotFoundException } from '@nestjs/common';
import { Response } from 'express';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(404).header('Content-Type', 'text/html; charset=utf-8').send(this.getErrorPage());
  }

  getErrorPage() {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Hong Ground</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  text-align: center;
                  margin-top: 50px;
              }
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  border: 1px solid #ccc;
                  border-radius: 5px;
                  background-color: #f9f9f9;
              }
              button {
                  padding: 10px 20px;
                  border: none;
                  border-radius: 5px;
                  background-color: #007BFF;
                  color: white;
                  cursor: pointer;
                  transition: background-color 0.3s;
              }
              button:hover {
                  background-color: #0056b3;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>Hong Ground는<br>API 서비스만 제공하고 있습니다.</h1>
              <p>아래의 버튼을 통하여 제공중인 API 서비스를 확인하여 주시길 바랍니다.</p>
              <button onclick="window.location.href='/api/docs'">Go to Documentation</button>
          </div>
      </body>
      </html>
    
    `;
  }
}
