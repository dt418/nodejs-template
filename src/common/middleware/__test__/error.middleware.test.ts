import express from "express";
import { StatusCodes } from "http-status-codes";
import request from "supertest";
import errorMiddleware from "../error.middleware";

const app = express();

app.use(errorMiddleware);

describe("Error Middleware", () => {
  it("should respond with 404 for unexpected requests", async () => {
    const response = await request(app).get("/unknown-route");
    expect(response.status).toBe(StatusCodes.NOT_FOUND);
  });

  it("should add error to response locals and call next", async () => {
    app.use((_req, _res, next) => {
      const error = new Error("Test Error");
      next(error);
    });

    app.use(errorMiddleware);

    app.use(() => {
      const res = app.get("res");
      expect(res.locals.err).toEqual(expect.any(Error));
      expect(res.locals.err.message).toBe("Test Error");
      res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    });

    const response = await request(app).get("/");
    expect(response.status).toBe(StatusCodes.NOT_FOUND);
  });
});
