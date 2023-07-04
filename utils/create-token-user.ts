import { Types } from 'mongoose'

const createTokenUser = (userId: Types.ObjectId) => { 
    return { userId } 
};

export default createTokenUser;