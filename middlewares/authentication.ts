import { Request, Response, NextFunction } from 'express'
import { JwtPayload } from 'jsonwebtoken';
import { UnAuthenticatedError, UnAuthorizededError } from "../errors";
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
        if (!user) {
            throw new UnAuthenticatedError('Authentication Invalid');
        }
        
        const obj = userObj(user);
        req.user = { ...obj, userId: user._id };

        next();
    } catch (error) {
        throw new UnAuthenticatedError('Authentication Invalid');
    }
};

const authorizePermissions = (req: Request, res: Response, next: NextFunction) => {
      if (!req.user?.isAdmin) {
        throw new UnAuthorizededError('Unauthorized to access this route');
      }
      
      next();
};

export { authenticateUser, userObj, authorizePermissions }