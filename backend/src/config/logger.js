const levelColors = {
  error: '\x1b[31m',
  warn: '\x1b[33m',
  info: '\x1b[32m',
  http: '\x1b[36m',
  debug: '\x1b[90m',
};

const level = process.env.LOG_LEVEL || 'info';
const levels = { error: 0, warn: 1, info: 2, http: 3, debug: 4 };

const shouldLog = (msgLevel) => levels[msgLevel] <= levels[level];

const formatTimestamp = () => new Date().toISOString();

const logger = {
  error: (msg, meta) => {
    if (!shouldLog('error')) return;
    console.error(`${levelColors.error}[ERROR]${'\x1b[0m'} ${formatTimestamp()} ${msg}`, meta || '');
  },
  warn: (msg, meta) => {
    if (!shouldLog('warn')) return;
    console.warn(`${levelColors.warn}[WARN]${'\x1b[0m'} ${formatTimestamp()} ${msg}`, meta || '');
  },
  info: (msg, meta) => {
    if (!shouldLog('info')) return;
    console.info(`${levelColors.info}[INFO]${'\x1b[0m'} ${formatTimestamp()} ${msg}`, meta || '');
  },
  http: (msg, meta) => {
    if (!shouldLog('http')) return;
    console.log(`${levelColors.http}[HTTP]${'\x1b[0m'} ${formatTimestamp()} ${msg}`, meta || '');
  },
  debug: (msg, meta) => {
    if (!shouldLog('debug')) return;
    console.debug(`${levelColors.debug}[DEBUG]${'\x1b[0m'} ${formatTimestamp()} ${msg}`, meta || '');
  },
};

export default logger;
