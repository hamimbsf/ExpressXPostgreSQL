import bcrypt from "bcryptjs";
import { pool } from "../../db";
import jwt from "jsonwebtoken";
import config from "../../config";

const loginUserIntoDB = async (payload: {
  email: string;
  password: string;
}) => {
  const { email, password } = payload;

  const userData = await pool.query(
    `
    SELECT * FROM users WHERE email=$1
    `,
    [email],
  );

  if (userData.rows.length === 0) {
    throw new Error("Invalid Credentials");
  }
  const user = userData.rows[0];

  const matchPass = await bcrypt.compare(password, user.password);
  console.log(matchPass);
  if (!matchPass) {
    throw new Error("Invalid Credentials");
  }
  // console.log(user);
  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    is_active: user.is_active,
  };

  const accessToken = jwt.sign(jwtPayload, config.secret as string, {
    expiresIn: "1d",
  });

  return { accessToken };
};

export const authService = {
  loginUserIntoDB,
};
