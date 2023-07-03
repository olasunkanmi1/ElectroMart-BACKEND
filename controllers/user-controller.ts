import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes';

type ControllerFunction = (req: Request, res: Response) => Promise<void>;

// SHOW CURRENT USER
const showCurrentUser: ControllerFunction = async (req, res) => {
    res.status(StatusCodes.OK).json({msg: 'ok'})
};

// UPDATE USER PASSWORD
const updateUserPassword: ControllerFunction = async (req, res) => {
    res.status(StatusCodes.OK).json({msg: 'ok'})
};

// UPDATE USER
const updateUser: ControllerFunction = async (req, res) => {
    res.status(StatusCodes.OK).json({msg: 'ok'})
};

export { showCurrentUser, updateUserPassword, updateUser }