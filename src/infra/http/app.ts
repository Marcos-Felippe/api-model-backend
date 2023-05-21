import "dotenv/config";

import express from "express";
import cors from "cors";

import "../database/mongo/config";

import router from "./routes/routes";

const app = express();

app.use(express.json());
app.use(cors());

app.use(router);

export default app;