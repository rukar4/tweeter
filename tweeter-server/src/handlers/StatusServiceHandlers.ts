import { PagedItemRequest, StatusDto, PostStatusRequest, TweeterResponse } from "tweeter-shared";
import { authenticate, getList } from "../util";
import { StatusService } from "../model/service/StatusService";

interface PagedStatusItemRequest extends PagedItemRequest<StatusDto> {}

const statusService = new StatusService()

export async function getStoryItemsHandler(req: PagedStatusItemRequest) {
  return getList(req, statusService.loadMoreStoryItems.bind(statusService))
}

export async function getFeedItemsHandler(req: PagedStatusItemRequest) {
  return getList(req, statusService.loadMoreFeedItems.bind(statusService))
}

export async function postStatusHandler(req: PostStatusRequest): Promise<TweeterResponse> {
  await authenticate(req)
  await statusService.postStatus(req.token, req.newStatus)

  return {
    success: true,
    message: null
  }
}