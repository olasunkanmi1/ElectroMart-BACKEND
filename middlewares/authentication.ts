import { Request, Response, NextFunction } from 'express'
import { JwtPayload } from 'jsonwebtoken';
import { UnAuthenticatedError } from "../errors";
import { User as UserObject } from '../types';
import User from '../models/User';
import { isTokenValid } from '../utils';
import '../types/express-declaration';

const userObj = (user: UserObject) => {
    const { firstName, lastName, email, isVerified, dateOfBirth, phoneNo, isAdmin } = user
    return {
        firstName,
        lastName,
        email,
        isVerified,
        dateOfBirth,
        phoneNo,
        isAdmin
    }
}

const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.signedCookies;
    
    if(!token) {
        throw new UnAuthenticatedError('Authentication Invalid');          
    }

    try {
        const { userId } = isTokenValid(token) as JwtPayload;
        const user = await User.findOne({ _id: userId });
        
        if(user) {
            const obj = userObj(user);
            req.user = { ...obj, userId: user._id };
        } else {
            throw new UnAuthenticatedError('Authentication Invalid');
        }

        next();
    } catch (error) {
        throw new UnAuthenticatedError('Authentication Invalid');
    }
}

export { authenticateUser, userObj }