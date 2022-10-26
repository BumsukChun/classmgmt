const winston = require('winston'); // logs into files

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error'}),
        new winston.transports.File({ filename: 'logs/combined.log'})
    ]
});

// logger levels ->  error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6 (higer, more important)

if (process.env.NODE_ENV !== 'production') {
    logger.add( new winston.transports.Console({ 
        format: winston.format.simple() 
    }));
}

module.exports = logger;