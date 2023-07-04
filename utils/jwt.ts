import jwt from 'jsonwebtoken';
import { AttachCookiesToResponseProps, CreateJWTProps } from '@types';

const createJWT = ({ payload }: CreateJWTProps) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET!);
    return token
}

const isTokenValid = (token: string) => jwt.verify(token, process.env.JWT_SECRET!)

const attachCookiesToResponse = ({res, tokenUser}: AttachCookiesToResponseProps) => {
    const token = createJWT({ payload: tokenUser });

    const oneDay = 1000 * 60 * 60 * 24;

    res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        secure: process.env.NODE_ENV === 'production',
        signed: true,
        // sameSite: 'none',
    });
}

export { 
    createJWT, 
    isTokenValid, 
    attachCookiesToResponse 
}