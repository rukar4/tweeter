import { PagedItemRequest, PostStatusRequest, StatusDto, TweeterResponse } from "tweeter-shared"
import { getList, withAuth } from "../util"
import { StatusService } from "../model/service/StatusService"

interface PagedStatusItemRequest extends PagedItemRequest<StatusDto> {}

const statusService = new StatusService()

export const getStoryItemsHandler = withAuth(async (req: PagedStatusItemRequest) => {
  return getList(req, statusService.loadMoreStoryItems.bind(statusService))
})

export const getFeedItemsHandler = withAuth(async (req: PagedStatusItemRequest) => {
  return getList(req, statusService.loadMoreFeedItems.bind(statusService))
})

export const postStatusHandler = withAuth(async (req: PostStatusRequest): Promise<TweeterResponse> => {
  await statusService.postStatus(req.token, req.newStatus)

  return {
    success: true,
    message: null
  }
})
