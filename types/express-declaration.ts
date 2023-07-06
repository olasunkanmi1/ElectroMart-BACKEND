import { Types } from 'mongoose';
import { User } from '.';

declare module 'express' {
    interface Request { 
        /**
        - Augments the Request interface in the 'express' module by adding the user property and setting its type as User.
        - Removes the _id property from the User interface and adds the userId property.
        */
        user?: Omit<User, '_id'> & { userId: Types.ObjectId };
    }
}