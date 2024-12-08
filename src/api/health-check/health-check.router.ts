import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Request, type Response } from "express";
import { z } from "zod";
import { createApiResponse } from "~/api-docs/openapi.builder";
import { ServiceResponse } from "~/common/model/service.response";
import { handleServiceResponse } from "~/common/utils/http-handlers";

const router = express.Router();
export const healthCheckRegistry = new OpenAPIRegistry();

healthCheckRegistry.registerPath({
  method: "get",
  path: "/health-check",
  tags: ["Health Check"],
  responses: createApiResponse(z.null(), "Success"),
});

router.get("/", (_req: Request, res: Response) => {
  const serviceResponse = ServiceResponse.success("Service is healthy", null);
  handleServiceResponse(serviceResponse, res);
});

export { router as healthCheckRouter };
