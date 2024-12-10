import express from "express";
import { StatusCodes } from "http-status-codes";
import request from "supertest";
import { env } from "~/common/utils/env.config";
import errorMiddleware from "../error.middleware";
import rateLimiter from "../rate-limiter.middleware";
import requestLoggerMiddleware from "../request-logger.middleware";

const app = express();

// Apply middlewares
app.use(requestLoggerMiddleware);
app.use(rateLimiter);
app.use(errorMiddleware);

describe("Middleware Tests", () => {
  it("should log requests", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(StatusCodes.NOT_FOUND);
  });

  it("should respond with 404 for unexpected requests", async () => {
    const response = await request(app).get("/unknown-route");
    expect(response.status).toBe(StatusCodes.NOT_FOUND);
  });

  it("should limit requests", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
    // Simulate multiple requests to test rate limiting
    for (let i = 0; i < env.COMMON_RATE_LIMIT_MAX_REQUESTS; i++) {
      await request(app).get("/");
    }
    const limitResponse = await request(app).get("/");
    expect(limitResponse.statusCode).toBe(StatusCodes.TOO_MANY_REQUESTS);
    expect(limitResponse.text).toBe("Too many requests, please try again later.");
  });
});
