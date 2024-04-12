import express from 'express';
const router = express.Router();

import cors from 'cors';
import config from './config';
import { errorHandler, jsonParseErrorHandler, methodNotAllowedErrorHandler, notFoundErrorHandler, payloadTooLargeErrorHandler, uuidErrorHandler } from './middleware/error_middleware';
import { errorLogger, requestLogger } from './middleware/logging_middleware';

// Import controllers
import health from './routes/health';
import resource from './routes/resource';
import test from './routes/testing_resources';
import admin_resource from './routes/v1/admin_resource';

const createServer = (app) => {
    app.disable('x-powered-by');
    // Enable all cors requests
    app.use(cors());
    app.use(requestLogger);
    app.use(express.json({ limit: config.storage.requestBodyPayloadSizeLimit }));
    app.use(jsonParseErrorHandler);
    app.use(express.urlencoded({ limit: config.storage.requestBodyPayloadSizeLimit, extended: false }));
    app.use(payloadTooLargeErrorHandler);

    // Health checks
    app.use('/health', health, router.all('/', methodNotAllowedErrorHandler));

    // Only load test route if in development or tests
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
        app.use('/test', test, router.all('/', methodNotAllowedErrorHandler));
    }

    // Set routes
    app.use('/index', resource, router.all('/', methodNotAllowedErrorHandler));

    // Admin routes
    app.use('/api/v1/admin', admin_resource, router.all('/', methodNotAllowedErrorHandler));

    // Middleware error handlers
    app.use(notFoundErrorHandler);
    app.use(errorLogger);
    app.use(uuidErrorHandler);
    app.use(errorHandler);
};

export default createServer;
