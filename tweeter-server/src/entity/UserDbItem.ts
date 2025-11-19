import { UserDto } from "tweeter-shared";

export interface UserDbItem extends UserDto {
  passwordHash: string
}