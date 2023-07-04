import { Types } from 'mongoose';
import { Response } from 'express';

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
    phoneNo: number;
    userId: Types.ObjectId;
}

export interface UserModel extends User {
    password: string;
    verificationCode: string;
    verified: Date;
    passwordToken: string;
    passwordTokenExpirationDate: Date;
}

export interface CheckPermissionsProps {
    requestUser: {
        isAdmin: string;
        userId: Types.ObjectId
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