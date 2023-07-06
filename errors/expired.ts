import { StatusCodes } from "http-status-codes";
import CustomAPIError from "./custom-api";

class ExpiredError extends CustomAPIError{
    statusCode: StatusCodes;

    constructor(message: string) {
        super(message)
        this.statusCode = StatusCodes.GONE
    }
}

export default ExpiredError