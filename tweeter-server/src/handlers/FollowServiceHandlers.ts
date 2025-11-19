import {
  GetCountResponse,
  IsFollowerRequest,
  IsFollowerResponse,
  PagedItemRequest,
  PagedItemResponse,
  UpdateFollowingResponse,
  UserDto,
  UserRequest
} from "tweeter-shared"
import { FollowService } from "../model/service/FollowService"
import { getList, withAuth } from "../util"
import FollowDao from "../dao/FollowDao"

const followService = new FollowService(new FollowDao())

interface PagedUserItemRequest extends PagedItemRequest<UserDto> {}
interface PagedUserItemResponse extends PagedItemResponse<UserDto> {}

export const getFolloweesHandler = withAuth(async (req: PagedUserItemRequest): Promise<PagedUserItemResponse> => {
  return getList(req, followService.loadMoreFollowees.bind(followService))
})

export const getFollowersHandler = withAuth(async (req: PagedUserItemRequest): Promise<PagedUserItemResponse> => {
  return getList(req, followService.loadMoreFollowers.bind(followService))
})

export const getFolloweeCountHandler = withAuth(async (req: UserRequest): Promise<GetCountResponse> => {
  return getCount(req, followService.getFolloweeCount.bind(followService))
})

export const getFollowerCountHandler = withAuth(async (req: UserRequest): Promise<GetCountResponse> => {
  return getCount(req, followService.getFollowerCount.bind(followService))
})

export const followHandler = withAuth(async (req: UserRequest): Promise<UpdateFollowingResponse> => {
  return updateFollowingCounts(req, followService.follow.bind(followService))
})

export const unfollowHandler = withAuth(async (req: UserRequest): Promise<UpdateFollowingResponse> => {
  return updateFollowingCounts(req, followService.unfollow.bind(followService))
})

export const getIsFollowerStatusHandler = withAuth(async (req: IsFollowerRequest): Promise<IsFollowerResponse> => {
  const isFollower = await followService.getIsFollowerStatus(req.token, req.user, req.selectedUser)

  return {
    success: true,
    message: null,
    isFollower
  }
})

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
