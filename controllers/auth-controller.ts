import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes';

type ControllerFunction = (req: Request, res: Response) => Promise<void>;

const register: ControllerFunction = async (req, res) => {
    res.status(StatusCodes.OK).json({msg: 'ok'})
};

const verifyEmail: ControllerFunction = async (req, res) => {
    res.status(StatusCodes.OK).json({msg: 'ok'})
};

const login: ControllerFunction = async (req, res) => {
    res.status(StatusCodes.OK).json({msg: 'ok'})
};

const logout: ControllerFunction = async (req, res) => {
    res.status(StatusCodes.OK).json({msg: 'ok'})
};

const forgotPassword: ControllerFunction = async (req, res) => {
    res.status(StatusCodes.OK).json({msg: 'ok'})
};

const resetPassword: ControllerFunction = async (req, res) => {
    res.status(StatusCodes.OK).json({msg: 'ok'})
};

export { register, verifyEmail, login, logout, forgotPassword, resetPassword }