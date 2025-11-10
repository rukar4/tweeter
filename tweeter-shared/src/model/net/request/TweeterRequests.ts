import { UserDto } from "../../dto/UserDto";
import { StatusDto } from "../../dto/StatusDto";

export interface TweeterRequest {}

export interface AuthenticatedRequest extends TweeterRequest {
  token: string
}

export interface PagedItemRequest<T extends UserDto | StatusDto> extends AuthenticatedRequest {
  readonly userAlias: string
  readonly pageSize: number
  readonly lastItem: T | null
}