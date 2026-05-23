import type { Request, Response } from "express";
import { userService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.createUserIntoDB(req.body);
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
};

const getAllUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.getAllUserIntoDB();

    res.status(200).json({
      success: true,
      message: "users get successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const getAnUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await userService.getUserIntoDB(id);
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
};

const updateAnUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await userService.updateUserFromDB(req.body, id);

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
};

const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await userService.deleteAnUserFromDB(id);

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
};

export const userController = {
  createUser,
  getAllUser,
  getAnUser,
  updateAnUser,
  deleteUser,
};
