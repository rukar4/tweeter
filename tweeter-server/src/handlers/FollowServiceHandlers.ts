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
import { authenticate, getList } from "../util"

const followService = new FollowService()

interface PagedUserItemRequest extends PagedItemRequest<UserDto> {}
interface PagedUserItemResponse extends PagedItemResponse<UserDto> {}

export const getFolloweesHandler = async (req: PagedUserItemRequest): Promise<PagedUserItemResponse> => {
  return getList(req, followService.loadMoreFollowees.bind(followService))
}

export const getFollowersHandler = async (req: PagedUserItemRequest): Promise<PagedUserItemResponse> => {
  return getList(req, followService.loadMoreFollowers.bind(followService))
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

export async function getIsFollowerStatusHandler(req: IsFollowerRequest): Promise<IsFollowerResponse> {
  await authenticate(req)
  const isFollower = await followService.getIsFollowerStatus(req.token, req.user, req.selectedUser)

  return {
    success: true,
    message: null,
    isFollower
  }
}

async function getCount(
  req: UserRequest,
  serviceCall: (token: string, user: UserDto) => Promise<number>
): Promise<GetCountResponse> {
  await authenticate(req)
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
  await authenticate(req)
  const [followerCount, followeeCount] = await serviceCall(req.token, req.user)

  return {
    success: true,
    message: null,
    followerCount,
    followeeCount
  }
}
