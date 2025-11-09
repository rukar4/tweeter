import { TweeterRequest } from "./TweeterRequest";
import { UserDto } from "../../dto/UserDto";

export interface PagedUserItemRequest extends TweeterRequest {
  readonly userAlias: string
  readonly pageSize: number
  readonly lastItem: UserDto | null
}

export interface UserRequest extends TweeterRequest {
  readonly user: UserDto
}

export interface IsFollowerRequest extends UserRequest {
  readonly selectedUser: UserDto
}
