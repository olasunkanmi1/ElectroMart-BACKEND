import { StatusCodes } from 'http-status-codes';
import crypto from 'crypto'
import { ControllerFunction } from '../types';
import { BadRequestError, UnAuthenticatedError, ConflictError, ExpiredError } from '../errors';
import User from '../models/User';
import { 
    createTokenUser, sendVerificationEmail, sendResetPasswordEmail, 
    createHash, attachCookiesToResponse, generateCode
} from '../utils';
import { userObj } from '../middlewares';

// create account
const register: ControllerFunction = async (req, res) => {
    const { firstName, lastName, email, password, dateOfBirth, phoneNo } = req.body;

    if(!firstName || !lastName || !email || !password || !dateOfBirth || !phoneNo) {
        throw new BadRequestError('please provide all values');
    }

    const  userAlreadyExists = await User.findOne({ 
        $or: [{ email }, { phoneNo }] 
    });
    if(userAlreadyExists) {
        throw new ConflictError('Email/Phone-No already exist');
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
    const { verificationCode } = req.body;

    const user = await User.findOne({  _id: req.user?.userId });
    
      if (!user) {
        throw new UnAuthenticatedError('Verification Failed');
      }
  
      if (user.verificationCode !== verificationCode) {
        throw new BadRequestError('Invalid code');
      }
      
      user.isVerified = true
      user.verificationCode = '';
      
      await user.save();
  
    res.status(StatusCodes.OK).json({ msg: 'Email verified successfully' });
};

// login
const login: ControllerFunction = async (req, res) => {
    const { email_or_phoneNumber, password } = req.body;

    if(!email_or_phoneNumber || !password) {
        throw new BadRequestError('please provide email/phone-number and password');
    }    

    const user = await User.findOne({ 
        $or: [{ email: email_or_phoneNumber }, { phoneNo: email_or_phoneNumber }] 
    }).select('+password');
    if(!user) {
      throw new UnAuthenticatedError('Invalid Credentials');
    }
    
    const isPasswordCorrect = await user.comparePassword(password)
    if(!isPasswordCorrect) {
      throw new UnAuthenticatedError('Invalid Credentials');
    }
    
    const tokenUser = createTokenUser(user._id);
    attachCookiesToResponse({ res, tokenUser });
    const obj = userObj(user);

    res.status(StatusCodes.OK).json({user: obj, msg: 'Logged in successfully'})
};

// logout
const logout: ControllerFunction = async (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(Date.now()),
    });

    res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
};

// forgot password
const forgotPassword: ControllerFunction = async (req, res) => {
    const { email } = req.body;
    if (!email) {
      throw new BadRequestError('Please provide valid email');
    }
  
    const user = await User.findOne({ email });
  
    if (user) {
        const passwordToken = crypto.randomBytes(70).toString('hex');
      
        // send email
        await sendResetPasswordEmail({
            name: user.firstName,
            email: user.email,
            passwordToken: passwordToken
        })
  
        const tenMinutes = 1000 * 60 * 10;
        const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);
    
        user.passwordToken = createHash(passwordToken);
        user.passwordTokenExpirationDate = passwordTokenExpirationDate;
        await user.save();
    }
  
    // still send success if no user with that email.
    res
      .status(StatusCodes.OK)
      .json({ msg: 'Please check your email for reset password link' });
};

// reset password
const resetPassword: ControllerFunction = async (req, res) => {
    const { passwordToken, email, password } = req.body;

    if (!passwordToken || !email || !password) {
      throw new BadRequestError('Please provide all values');
    }
    const user = await User.findOne({ email });
  
    if (user) {
        const currentDate = new Date();

        if(user.passwordToken !== createHash(passwordToken)) throw new BadRequestError('Invalid link')
        if(user.passwordTokenExpirationDate && currentDate > user.passwordTokenExpirationDate) {
            throw new ExpiredError('Expired link');
        } 
  
        user.password = password;
        user.passwordToken = '';
        user.passwordTokenExpirationDate = null;
        await user.save();
    }
  
    res.status(StatusCodes.OK).json({ msg: 'Password reset successfully' });
};

export { register, verifyEmail, login, logout, forgotPassword, resetPassword }