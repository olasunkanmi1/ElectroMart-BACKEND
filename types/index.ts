import { Types, Document } from 'mongoose';
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
    favorites: [Types.ObjectId];
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

export interface ProductModel {
    name: string;
    price: number;
    description: string;
    images: string[];
    category: 'smartwatches' | 'computing' | 'drones' | 'gaming' | 'phonesAndTabs' | 'televisions' | 'audio' | 'photography' | 'homeAppliances';
    brand: string;
    featured: boolean;
    QuantityInStock: number;
    averageRating: number;
    numOfReviews: number;
    discount: number;
    createdBy: Types.ObjectId;
}

export interface ReviewModel {
    rating: number;
    title: string;
    comment: string;
    createdBy: Types.ObjectId;
    product: Types.ObjectId;
}

export interface SingleOrderItemModel {
    name: string;
    image: string;
    price: number;
    amount: number;
    product: Types.ObjectId;
}

export interface OrderModel {
    tax: number;
    shippingFee: number;
    subtotal: number;
    total: number;
    orderItems: SingleOrderItemModel[];
    status: 'pending' | 'failed' | 'paid' | 'delivered' | 'canceled';
    createdBy: Types.ObjectId;
    clientSecret: string;
    paymentIntentId: string;
}

export interface FakeStripeAPIProps {
    amount: number;
    currency: string;
}

export interface FlashSalesModel {
    startDate: Date;
    endDate: Date;
}