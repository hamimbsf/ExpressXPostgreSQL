import express, {
  type Application,
  type Request,
  type Response,
} from "express";

import { initDb, pool } from "./db";
import { userRouter } from "./modules/user/user.route";
import { profileRouter } from "./modules/profile/profile.route";
import { authRoute } from "./modules/auth/auth.route";

const app: Application = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "This is root",
    author: "Hamim",
  });
});

app.use("/api/users", userRouter);
app.use("/api/profile", profileRouter);
app.use("/api/auth", authRoute);

export default app;
