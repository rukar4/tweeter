import {
  AuthenticatedRequest,
  GetUserRequest,
  GetUserResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest
} from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { authenticate } from "../util";
import { UserDao } from "../dao/UserDao";
import { S3ImageDao } from "../dao/S3ImageDao";

const userService = new UserService(new UserDao(), new S3ImageDao())

export async function getUserHandler(req: GetUserRequest): Promise<GetUserResponse> {
  await authenticate(req)
  const user = await userService.getUser(req.token, req.alias)

  return {
    success: true,
    message: null,
    user
  }
}

export async function loginHandler(req: LoginRequest): Promise<LoginResponse> {
  if (!req.alias || !req.password)
    throw new Error("bad request: expected alias and password")

  const [user, token] = await userService.login(req.alias, req.password)

  return {
    success: true,
    message: null,
    user,
    token
  }
}

export async function registerHandler(req: RegisterRequest): Promise<LoginResponse> {
  if (!req.firstName || !req.lastName || !req.alias || !req.password || !req.imageStringBase64 || !req.imageFileExtension)
    throw new Error("bad-request: missing required request parameters to register user")

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

export async function logoutHandler(req: AuthenticatedRequest) {
  await userService.logout(req.token)

  return {
    success: true,
    message: null
  }
}