import { TweeterRequest } from "./TweeterRequest";
import { UserDto } from "../../dto/UserDto";

export interface FollowServiceRequest extends TweeterRequest {
  readonly token: string
}

export interface PagedUserItemRequest extends FollowServiceRequest {
  readonly userAlias: string
  readonly pageSize: number
  readonly lastItem: UserDto | null
}

export interface UserRequest extends FollowServiceRequest {
  readonly user: UserDto
}

export interface IsFollowerRequest extends UserRequest {
  readonly selectedUser: UserDto
}
