import { AuthenticatedRequest } from "./TweeterRequests";
import { UserDto } from "../../dto/UserDto";

export interface UserRequest extends AuthenticatedRequest {
  readonly user: UserDto
}

export interface IsFollowerRequest extends UserRequest {
  readonly selectedUser: UserDto
}
