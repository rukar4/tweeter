import { AuthenticatedRequest, TweeterRequest } from "./TweeterRequests"

export interface GetUserRequest extends AuthenticatedRequest {
  readonly alias: string
}

export interface LoginRequest extends TweeterRequest {
  readonly alias: string
  readonly password: string
}

export interface RegisterRequest extends LoginRequest {
  readonly firstName: string
  readonly lastName: string
  readonly imageStringBase64: string
  readonly imageFileExtension: string
}