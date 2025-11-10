import { UserDto } from "../../dto/UserDto";
import { StatusDto } from "../../dto/StatusDto";

export interface TweeterResponse {
  readonly success: boolean
  readonly message: string | null
}

export interface PagedItemResponse<T extends UserDto | StatusDto> extends TweeterResponse {
  readonly items: T[] | null
  readonly hasMore: boolean
}