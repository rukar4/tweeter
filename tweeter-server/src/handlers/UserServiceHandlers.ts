import {
  GetUserRequest,
  GetUserResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  UserServiceRequest
} from "tweeter-shared";
import { UserService } from "../model/service/UserService";

const userService = new UserService()

export async function getUserHandler(req: GetUserRequest): Promise<GetUserResponse> {
  const user = await userService.getUser(req.token, req.alias)

  return {
    success: true,
    message: null,
    user
  }
}

export async function loginHandler(req: LoginRequest): Promise<LoginResponse> {
  const [user, token] = await userService.login(req.alias, req.password)

  return {
    success: true,
    message: null,
    user,
    token
  }
}

export async function registerHandler(req: RegisterRequest): Promise<LoginResponse> {
  const [user, token] = await userService
    .register
    (
      req.firstName,
      req.lastName,
      req.alias,
      req.password,
      req.imageStringBase64,
      req.imageFileExtension
    )

  return {
    success: true,
    message: null,
    user,
    token
  }
}

export async function logoutHandler(req: UserServiceRequest) {
  await userService.logout(req.token)

  return {
    success: true,
    message: null
  }
}