import "dotenv/config";

import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";

import "../database/mongo/config";

import router from "./routes/routes";

import swaggerDocs from "./swagger.json";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(router);

export default app;