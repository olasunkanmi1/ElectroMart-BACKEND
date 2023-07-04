import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, UnAuthenticatedError, ConflictError } from '../errors';
import User from '../models/User';
import { 
    createTokenUser, sendVerificationEmail, sendResetPasswordEmail, 
    createHash, attachCookiesToResponse, generateCode
} from '../utils';
import { userObj } from '../middlewares';


type ControllerFunction = (req: Request, res: Response) => Promise<any>;

const register: ControllerFunction = async (req, res) => {
    const { firstName, lastName, email, password, dateOfBirth, phoneNo } = req.body;

    if(!firstName || !lastName || !email || !password || !dateOfBirth || !phoneNo) {
        throw new BadRequestError('please provide all values');
    }

    const  userAlreadyExists = await User.findOne({ email });
    if(userAlreadyExists) {
        throw new ConflictError('Email already exist');
    }

     // first registered user is an admin
    const isAdmin = (await User.countDocuments({})) === 0;

    const verificationCode = generateCode();
    
    const user = await User.create({ ...req.body, isAdmin, verificationCode });
    const tokenUser = createTokenUser(user._id);
    attachCookiesToResponse({res, tokenUser});

    await sendVerificationEmail({
        name: user.firstName,
        email: user.email,
        verificationCode: user.verificationCode
    })

    const obj = userObj(user)

    res.status(StatusCodes.CREATED).json({user: obj, msg: 'Account created successfully'})
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