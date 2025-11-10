export interface TweeterRequest {}

export interface AuthenticatedRequest extends TweeterRequest {
  token: string
}

export interface PagedItemRequest<DTO_TYPE> extends AuthenticatedRequest {
  readonly userAlias: string
  readonly pageSize: number
  readonly lastItem: DTO_TYPE | null
}