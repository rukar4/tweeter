import {
  GetCountResponse,
  IsFollowerRequest,
  IsFollowerResponse,
  PagedUserItemRequest,
  PagedUserItemResponse,
  UserRequest
} from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export const getFolloweesHandler = async (req: PagedUserItemRequest): Promise<PagedUserItemResponse> => {
  const followService = new FollowService()
  const [items, hasMore] = await followService.loadMoreFollowees(req.token, req.userAlias, req.pageSize, req.lastItem)

  return {
    success: true,
    message: null,
    items,
    hasMore
  }
}

export const getFollowersHandler = async (req: PagedUserItemRequest): Promise<PagedUserItemResponse> => {
  const followService = new FollowService()
  const [items, hasMore] = await followService.loadMoreFollowers(req.token, req.userAlias, req.pageSize, req.lastItem)

  return {
    success: true,
    message: null,
    items,
    hasMore
  }
}

export async function getIsFollowerStatusHandler(req: IsFollowerRequest): Promise<IsFollowerResponse> {
  const followService = new FollowService()
  const isFollower = await followService.getIsFollowerStatus(req.token, req.user, req.selectedUser)

  return {
    success: true,
    message: null,
    isFollower
  }
}

export async function getFolloweeCountHandler(req: UserRequest): Promise<GetCountResponse> {
  const followService = new FollowService()
  const count  = await followService.getFolloweeCount(req.token, req.user)

  return {
    success: true,
    message: null,
    count: count
  }
}

export async function getFollowerCountHandler(req: UserRequest) {
  const followService = new FollowService()
  const count  = await followService.getFollowerCount(req.token, req.user)

  return {
    success: true,
    message: null,
    count: count
  }
}

export function followHandler(req: UserRequest) {

}

export function unfollowHandler(req: UserRequest) {

}