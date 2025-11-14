import { AuthenticatedRequest, PagedItemRequest, PagedItemResponse, StatusDto, UserDto } from "tweeter-shared";

export async function getList<T extends UserDto | StatusDto>(
  req: PagedItemRequest<T>,
  serviceCall: (
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: T | null
  ) => Promise<[T[], boolean]>
): Promise<PagedItemResponse<T>> {
  await authenticate(req)
  const [items, hasMore] = await serviceCall(req.token, req.userAlias, req.pageSize, req.lastItem)

  return {
    success: true,
    message: null,
    items,
    hasMore
  }
}

export async function authenticate<T extends AuthenticatedRequest>(req: T) {
  // TODO: Check if token is valid
  if (!req.token)
    throw new Error("unauthorized: invalid auth token provided")
}