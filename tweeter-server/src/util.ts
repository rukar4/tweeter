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
  const [items, hasMore] = await serviceCall(req.token, req.userAlias, req.pageSize, req.lastItem)

  return {
    success: true,
    message: null,
    items,
    hasMore
  }
}

export function withAuth<TReq extends AuthenticatedRequest, TRes>(
  handler: (req: TReq) => Promise<TRes>
) {
  return async (req: TReq): Promise<TRes> => {
    if (!req.token)
      throw new Error("unauthorized: invalid auth token provided")

    // TODO: Check if token is valid

    return handler(req)
  }
}