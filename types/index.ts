
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
    dateOfBirth: Date;
    phoneNo: number;
}