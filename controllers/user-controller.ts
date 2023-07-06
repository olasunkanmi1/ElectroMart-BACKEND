import { StatusCodes } from 'http-status-codes';
import { ControllerFunction, User as UserType } from '../types';
import User from '../models/User';
import { BadRequestError, UnAuthenticatedError, ConflictError, NotFoundError } from '../errors';
import { checkPermissions, generateCode } from '../utils';
import { userObj } from '../middlewares';

// GET ALL USERS
const getAllUsers: ControllerFunction = async (req, res) => {
    const users = await User.find({ });
    const usersObj = users.map((user: UserType) => userObj(user));

    res.status(StatusCodes.OK).json({ users: usersObj });
};
  
//  GET SINGLE USER
const getSingleUser: ControllerFunction = async (req, res) => {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      throw new NotFoundError(`No user with id : ${req.params.id}`);
    }

    checkPermissions({ requestUser: req.user, resourceUserId: user._id});
    const obj = userObj(user);
    res.status(StatusCodes.OK).json({ user: obj });
};

// SHOW CURRENT USER
const showCurrentUser: ControllerFunction = async (req, res) => {
    res.status(StatusCodes.OK).json({ user: req.user });
};

// UPDATE USER PASSWORD
const updateUserPassword: ControllerFunction = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      throw new BadRequestError('Please provide both values');
    }

    const user = await User.findOne({ _id: req.user?.userId }).select('+password');
    if(user) {
        const isPasswordCorrect = await user.comparePassword(oldPassword);
        if (!isPasswordCorrect) {
            throw new UnAuthenticatedError('Invalid Credentials');
        }

        user.password = newPassword;
        await user.save();
    }

    res.status(StatusCodes.OK).json({ msg: 'Success! Password Updated.' });
};

// UPDATE USER
const updateUser: ControllerFunction = async (req, res) => {
    const { email, firstName, lastName, dateOfBirth, phoneNo } = req.body;
    if (!email || !firstName || !lastName || !dateOfBirth || !phoneNo) {
        throw new BadRequestError('Please provide all values');
    }
  
    const user = await User.findOne({ _id: req.user?.userId })
    if (!user) {
        throw new UnAuthenticatedError('Authentication Invalid');
    }

    const emailChanged = email.toLowerCase() !== user.email
    const  userAlreadyExists = await User.findOne({ email });

    if(userAlreadyExists && emailChanged) {
        throw new ConflictError('Email already exist');
    }

    if(user.isVerified && emailChanged) {
        user.isVerified = false;
        user.verificationCode = generateCode();
    }

    user.email = email;
    user.firstName = firstName;
    user.lastName = lastName;
    user.dateOfBirth = dateOfBirth;
    user.phoneNo = phoneNo;

    await user.save();
    const obj = userObj(user);
    res.status(StatusCodes.OK).json({ user: obj, msg: 'Profile updated successfully' });
};

export { showCurrentUser, updateUserPassword, updateUser, getAllUsers, getSingleUser }