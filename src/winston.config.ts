import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';

function rotationFormat(): string {
  return new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD' 형식
}

function getKoreanTimestamp() {
  const KST_OFFSET = 9 * 60; // Korea is UTC +9
  const localDate = new Date(new Date().getTime() + KST_OFFSET * 60 * 1000);
  return localDate.toISOString().replace('T', ' ').substring(0, 19);
}

export const consoleTransport = new winston.transports.Console({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
  format: winston.format.combine(winston.format.timestamp(), nestWinstonModuleUtilities.format.nestLike('playground', { colors: true, prettyPrint: true })),
});

export const fileTransport = new winston.transports.File({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
  filename: `logs-${rotationFormat()}.log`,
  dirname: './logs',
  format: winston.format.combine(winston.format.timestamp({ format: getKoreanTimestamp() }), winston.format.prettyPrint()),
});
