import { Request, Response, NextFunction } from 'express'
import { CustomError } from '../types';
import { StatusCodes } from 'http-status-codes';


const errorHandlerMiddleware = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    // set default error
    let defaultError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || 'Something went wrong. Try again later',
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    };

    if(err.name === "ValidationError") {
        defaultError.msg = Object.values(err.errors).map((item) => item.message).join(',');
        defaultError.statusCode = StatusCodes.BAD_REQUEST;
    }

    if (err.code && err.code === 11000) {
        defaultError.msg = `${Object.keys(err.keyValue)} field has to be unique`;
        defaultError.statusCode = StatusCodes.BAD_REQUEST;
    }
    
    if(err.name === "CastError") {
        defaultError.msg = `No item found with id : ${err.value}`;
        defaultError.statusCode = StatusCodes.BAD_REQUEST;
    }

    return res.status(defaultError.statusCode).json({ msg: defaultError.msg, stack: defaultError.stack })
}

export default errorHandlerMiddleware