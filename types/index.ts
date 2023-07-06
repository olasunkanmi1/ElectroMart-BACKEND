import { Types } from 'mongoose';
import { Request, Response } from 'express';

export interface CustomError extends Error {
    statusCode?: number;
    errors: {
        item: {
            message: string;
        }
    };
    code?: number;
    keyValue: string;
    value: string;
}

export interface User {
    firstName: string;
    lastName: string;
    email: string;
    isVerified: boolean;
    isAdmin: boolean;
    dateOfBirth: Date;
    phoneNo: string;
}

export interface UserModel  extends  User {
    password: string;
    verificationCode: string;
    verified: Date;
    passwordToken: string;
    passwordTokenExpirationDate: Date | null;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface CheckPermissionsProps {
    requestUser?: {
        isAdmin: boolean;
        userId: Types.ObjectId;
    }
    resourceUserId: Types.ObjectId;
}

export interface AttachCookiesToResponseProps {
    res: Response;
    tokenUser: {
        userId: Types.ObjectId;
    }
}

export interface CreateJWTProps {
    payload: AttachCookiesToResponseProps['tokenUser'];
}

export interface SendEmailProps {
    to: string;
    subject: string;
    html: string;
}

export interface SendResetPasswordEmailProps {
    name: string;
    email: string;
    passwordToken: string;
}

export interface SendVerificationEmailProps {
    name: string;
    email: string;
    verificationCode: string;
}

export type ControllerFunction = (req: Request, res: Response) => Promise<any>;