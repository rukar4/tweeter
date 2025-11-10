import { TweeterResponse } from "./TweeterResponses";

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