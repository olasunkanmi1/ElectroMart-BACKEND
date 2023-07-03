import { Request, Response, NextFunction } from 'express'
import { UnAuthenticatedError } from "../errors";
import { User } from '../types';

const userObj = (user: User) => {
    const { firstName, lastName, email, isVerified, dateOfBirth, phoneNo } = user
    return {
        firstName,
        lastName,
        email,
        isVerified,
        dateOfBirth,
        phoneNo
    }
}

const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.signedCookies.token;
    
    if(!token) {
        throw new UnAuthenticatedError('Authentication Invalid');          
    }

    try {
        next();
    } catch (error) {
        throw new UnAuthenticatedError('Authentication Invalid');
    }
}

export { authenticateUser, userObj }