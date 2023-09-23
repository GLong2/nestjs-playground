import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';

function rotationFormat(): string {
  return new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD' 형식
}

export const consoleTransport = new winston.transports.Console({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
  format: winston.format.combine(winston.format.timestamp(), nestWinstonModuleUtilities.format.nestLike('playground', { colors: true, prettyPrint: true })),
});

export const fileTransport = new winston.transports.File({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
  filename: `logs-${rotationFormat()}.log`,
  dirname: './logs',
  format: winston.format.combine(winston.format.timestamp(), winston.format.prettyPrint()),
});
