import express, {
  type Application,
  type Request,
  type Response,
} from "express";

import { Pool } from "pg";

const app: Application = express();
const port = 3000;

app.use(express.json());

const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:npg_XxgR1wopf2Eb@ep-spring-lake-aqewtjg8-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
});

const initDb = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        is_active BOOLEAN DEFAULT true,
        age INT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    console.log("DB connected successfully");
  } catch (error) {
    console.error(error);
  }
};

initDb();

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "This is root",
    author: "Hamim",
  });
});

app.post("/api/users", async (req: Request, res: Response) => {
  const { email, name, password, age } = req.body;

  try {
    const result = await pool.query(
      `
    INSERT INTO users(name,email,age,password) VALUES($1,$2,$3,$4)
    RETURNING *
    `,
      [name, email, password, age],
    );

    res.status(201).json({
      message: "post created",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(401).json({
      message: error.message,
      error: error,
    });
  }
});

app.get("/api/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT * FROM users
    `);
    res.status(200).json({
      success: true,
      message: " users get successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
});

app.get("/api/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
    SELECT * FROM users WHERE id=$1
    `,
      [id],
    );
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "user not found",
        data: {},
      });
    }
    res.status(200).json({
      success: true,
      message: " user get successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
});

app.put("/api/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, password, is_active, age } = req.body;

  try {
    const result = await pool.query(
      `
    UPDATE users
    SET
    name=COALESCE($1,name),
    password=COALESCE($2,password),
    is_active=COALESCE($3,is_active),
    age=COALESCE($4,age)
    WHERE id=$5 RETURNING *
    `,
      [name, password, is_active, age, id],
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "user not found",
        data: {},
      });
    }
    res.status(200).json({
      success: true,
      message: " user updated successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
});

app.delete("/api/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
  DELETE FROM users
  WHERE id = $1
`,
      [id],
    );
    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "user not found",
        data: {},
      });
    }
    res.status(200).json({
      success: true,
      message: " user deleted successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
