export interface TweeterResponse {
  readonly success: boolean
  readonly message: string | null
}

export interface PagedItemResponse<DTO_TYPE> extends TweeterResponse {
  readonly items: DTO_TYPE[] | null
  readonly hasMore: boolean
}