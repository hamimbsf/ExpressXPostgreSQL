import bcrypt from "bcryptjs";
import { pool } from "../../db";
import type { IUser } from "./user.interface";

const createUserIntoDB = async (payload: IUser) => {
  const { name, email, password, age, role } = payload;

  const hashPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `
    INSERT INTO users(name,email,age,password,role)
    VALUES($1,$2,$3,$4,COALESCE($5,'user'))
    RETURNING *
    `,
    [name, email, age, hashPassword, role],
  );
  delete result.rows[0].password;

  return result;
};

const getAllUserIntoDB = async () => {
  const result = await pool.query(`
      SELECT * FROM users
    `);
  return result;
};

const getUserIntoDB = async (id: string) => {
  const result = await pool.query(
    `
    SELECT * FROM users WHERE id=$1
    `,
    [id],
  );
  return result;
};

const updateUserFromDB = async (payload: IUser, id: string) => {
  const { name, password, is_active, age } = payload;
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

  return result;
};

const deleteAnUserFromDB = async (id: string) => {
  const result = await pool.query(
    `
  DELETE FROM users
  WHERE id = $1
`,
    [id],
  );
  return result;
};

export const userService = {
  createUserIntoDB,
  getAllUserIntoDB,
  getUserIntoDB,
  updateUserFromDB,
  deleteAnUserFromDB,
};
