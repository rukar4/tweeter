import { UserDto } from "../../dto/UserDto";
import { TweeterResponse } from "./TweeterResponse";

export interface PagedUserItemResponse extends TweeterResponse{
  readonly items: UserDto[] | null
  readonly hasMore: boolean
}

export interface IsFollowerResponse extends TweeterResponse {
  readonly isFollower: boolean
}

export interface GetCountResponse extends TweeterResponse {
  readonly count: number
}

export interface UpdateFollowingResponse extends TweeterResponse {
  readonly followerCount: number
  readonly followeeCount: number
}