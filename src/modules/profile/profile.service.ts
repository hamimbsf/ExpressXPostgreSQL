import { pool } from "../../db";

const createProfileIntoDB = async (payload: any) => {
  const { user_id, bio, address, gender, phone } = payload;

  const user = await pool.query(
    `
  SELECT * FROM users WHERE id=$1
  `,
    [user_id],
  );
  if (user.rows.length === 0) {
    throw new Error("User not exist");
  }

  const result = await pool.query(
    `
  INSERT INTO profiles(user_id, bio, address, gender, phone) VALUES($1,$2,$3,$4,$5) RETURNING *
  `,
    [user_id, bio, address, gender, phone],
  );
  return result;
};

export const profileService = {
  createProfileIntoDB,
};
