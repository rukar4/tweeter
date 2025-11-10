// All classes that should be available to other modules need to exported here. export * does not work when
// uploading to lambda. Instead we have to list each export.

// Domain classes
export { Follow } from "./model/domain/Follow";
export { PostSegment, Type } from "./model/domain/PostSegment";
export { Status } from "./model/domain/Status";
export { User } from "./model/domain/User";
export { AuthToken } from "./model/domain/AuthToken";

//
// DTOs
//
export type { UserDto } from "./model/dto/UserDto";
export type { AuthTokenDto } from "./model/dto/AuthTokenDto"

//
// Requests
//
export type { TweeterRequest } from "./model/net/request/TweeterRequest";
export type {
  LoginRequest, RegisterRequest, GetUserRequest, UserServiceRequest
} from "./model/net/request/UserServiceRequests"
export type { PagedUserItemRequest, UserRequest, IsFollowerRequest } from "./model/net/request/FollowServiceRequests";

//
// Responses
//
export type { TweeterResponse } from "./model/net/response/TweeterResponse"
export type {
  PagedUserItemResponse, IsFollowerResponse, UpdateFollowingResponse, GetCountResponse
} from "./model/net/response/FollowServiceResponses"
export type { GetUserResponse, LoginResponse } from "./model/net/response/UserServiceResponses"

// Other
export type ListType = 'followees' | 'followers'
export { FakeData } from "./util/FakeData";

