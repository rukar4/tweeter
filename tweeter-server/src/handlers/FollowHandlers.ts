import {
  GetCountResponse,
  IsFollowerRequest,
  IsFollowerResponse,
  PagedUserItemRequest,
  PagedUserItemResponse,
  UpdateFollowingResponse,
  UserDto,
  UserRequest
} from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

const followService = new FollowService()

export const getFolloweesHandler = async (req: PagedUserItemRequest): Promise<PagedUserItemResponse> => {
  const [items, hasMore] = await followService.loadMoreFollowees(req.token, req.userAlias, req.pageSize, req.lastItem)

  return {
    success: true,
    message: null,
    items,
    hasMore
  }
}

export const getFollowersHandler = async (req: PagedUserItemRequest): Promise<PagedUserItemResponse> => {
  const [items, hasMore] = await followService.loadMoreFollowers(req.token, req.userAlias, req.pageSize, req.lastItem)

  return {
    success: true,
    message: null,
    items,
    hasMore
  }
}

export async function getIsFollowerStatusHandler(req: IsFollowerRequest): Promise<IsFollowerResponse> {
  const isFollower = await followService.getIsFollowerStatus(req.token, req.user, req.selectedUser)

  return {
    success: true,
    message: null,
    isFollower
  }
}

export async function getFolloweeCountHandler(req: UserRequest): Promise<GetCountResponse> {
  return getCount(req, followService.getFolloweeCount.bind(followService))
}

export async function getFollowerCountHandler(req: UserRequest) {
  return getCount(req, followService.getFollowerCount.bind(followService))
}

export function followHandler(req: UserRequest): Promise<UpdateFollowingResponse> {
  return updateFollowingCounts(req, followService.follow.bind(followService))
}

export function unfollowHandler(req: UserRequest): Promise<UpdateFollowingResponse> {
  return updateFollowingCounts(req, followService.unfollow.bind(followService))
}

async function getCount(
  req: UserRequest,
  serviceCall: (token: string, user: UserDto) => Promise<number>
): Promise<GetCountResponse> {
  const count = await serviceCall(req.token, req.user)

  return {
    success: true,
    message: null,
    count: count
  }
}

async function updateFollowingCounts(
  req: UserRequest,
  serviceCall: (token: string, user: UserDto) => Promise<[number, number]>
): Promise<UpdateFollowingResponse> {
  const [followerCount, followeeCount] = await serviceCall(req.token, req.user)

  return {
    success: true,
    message: null,
    followerCount,
    followeeCount
  }
}
