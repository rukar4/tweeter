import { TweeterResponse } from "./TweeterResponse";
import { UserDto } from "../../dto/UserDto";
import { AuthTokenDto } from "../../dto/AuthTokenDto";

export interface GetUserResponse extends TweeterResponse {
  readonly user: UserDto
}

export interface LoginResponse extends TweeterResponse {
  readonly user: UserDto
  readonly token: AuthTokenDto
}
