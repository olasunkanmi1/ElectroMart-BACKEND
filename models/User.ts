import { Schema, model } from "mongoose";
import isEmail from 'validator/lib/isEmail';
import bcrypt from "bcryptjs";
import { UserModel } from '@types'

const UserSchema = new Schema<UserModel>({
    firstName: {
        type: String,
        required: [true, 'Please provide first name'],
        minLength: 3,
        maxLength: 20,
        trim: true,
        set: (value: string) => value.charAt(0).toUpperCase() + value.slice(1),
    },
    lastName: {
        type: String,
        required: [true, 'Please provide last name'],
        minLength: 3,
        maxLength: 20,
        trim: true,
        set: (value: string) => value.charAt(0).toUpperCase() + value.slice(1),
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: [true, 'Please provide email'],
        validate: {
            validator: (value: string) => isEmail(value),
            message: 'Please provide a valid email'
        },
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minLength: 6,
        select: false,
        lowercase: true
    },
    verificationCode: String,
    isVerified: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    dateOfBirth: {
        type: Date,
        required: [true, 'Please provide date of birth'],
    },
    phoneNo: {
        type: Number,
        required: [true, 'Please provide phone number'],
    },
    verified: Date,
    passwordToken: String,
    passwordTokenExpirationDate: Date,
});

UserSchema.pre('save', async function() {
    if(!this.isModified('password')) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
});

UserSchema.methods.comparePassword = async function (candidatePassword: string) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
};

export default model<UserModel>('User', UserSchema)