import { StatusCodes } from "http-status-codes";
import CustomAPIError from "./custom-api";

class UnauthorizededError extends CustomAPIError{
    statusCode: StatusCodes;

    constructor(message: string) {
        super(message)
        this.statusCode = StatusCodes.FORBIDDEN
    }
}

export default UnauthorizededError