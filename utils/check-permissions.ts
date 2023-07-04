import { UnAuthorizededError } from "../errors";
import { CheckPermissionsProps } from "../types";

const checkPermissions = ({requestUser, resourceUserId}: CheckPermissionsProps) => {
    if (requestUser.isAdmin) return;
    if (requestUser.userId.toString() === resourceUserId.toString()) return;
    throw new UnAuthorizededError('Not authorized to access this route');
};

export default checkPermissions;  