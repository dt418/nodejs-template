import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { pino } from "pino";
import { openAPIRouter } from "./api-docs/openapi.router";
import { healthCheckRouter } from "./api/health-check/health-check.router";
import { userRouter } from "./api/user/user.router";
import rateLimiter from "./common/middleware/rate-limiter.middleware";
import requestLoggerMiddleware from "./common/middleware/request-logger.middleware";
import { env } from "./common/utils/env.config";

const logger = pino({ name: "server start" });
const app: Express = express();

// Set the application to trust the reverse proxy
app.set("trust proxy", true);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use(rateLimiter);

// Request logging
app.use(requestLoggerMiddleware);

// Routes
app.use("/health-check", healthCheckRouter);
app.use("/users", userRouter);

// Swagger UI
app.use(openAPIRouter);

export { app, logger };
