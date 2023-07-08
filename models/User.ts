import { Schema, model, SchemaTypes } from "mongoose";
import isEmail from 'validator/lib/isEmail';
import bcrypt from "bcryptjs";
import { UserModel } from '../types'

const UserSchema = new Schema<UserModel>({
    firstName: {
        type: String,
        required: [true, 'Please provide first name'],
        minLength: 3,
        maxLength: 20,
        trim: true,
        set: (value: string) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(),
    },
    lastName: {
        type: String,
        required: [true, 'Please provide last name'],
        minLength: 3,
        maxLength: 20,
        trim: true,
        set: (value: string) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(),
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
    },
    verificationCode: String,
    isVerified: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    dateOfBirth: {
        type: Date,
        required: [true, 'Please provide date of birth'],
    },
    phoneNo: {
        type: String,
        unique: true,
        required: [true, 'Please provide phone number'],
    },
    passwordToken: String,
    passwordTokenExpirationDate: {}, //empty object {} means same as Schema.Types.Mixed i.e a mixed type 
    favorites: {
        type: [
          {
            type: SchemaTypes.ObjectId,
            ref: "Product",
          },
        ],
    },
}, {
    timestamps: true,
});

UserSchema.pre('save', async function() {
    if(!this.isModified('password')) return;

    const salt = await bcrypt.genSalt(10);
    const lowercasePassword = this.password.toLowerCase();
    this.password = await bcrypt.hash(lowercasePassword, salt)
});

UserSchema.methods.comparePassword = async function (candidatePassword: string) {
    const isMatch = await bcrypt.compare(candidatePassword.toLowerCase(), this.password);
    return isMatch;
};

export default model<UserModel>('User', UserSchema);