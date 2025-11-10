import { TweeterRequest } from "./TweeterRequest";

export interface UserServiceRequest extends TweeterRequest {
  readonly token: string
}

export interface GetUserRequest extends UserServiceRequest {
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