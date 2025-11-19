import { UserDto } from "tweeter-shared";
import { DynamoDbDao } from "./DynamoDbDao";
import { UserDbItem } from "../entity/UserDbItem";

export class UserDao extends DynamoDbDao<UserDbItem, { alias: string }> {
  readonly userAliasAttr = 'alias'
  readonly firstNameAttr = 'first_name'
  readonly lastNameAttr = 'last_name'
  readonly imageUrlAttr = 'image_url'
  readonly passwordAttr = 'password'

  constructor() {
    super('user');
  }

  protected convertToDto(itemRecord: Record<string, any>): UserDbItem {
    return {
      alias: itemRecord[this.userAliasAttr],
      firstName: itemRecord[this.firstNameAttr],
      lastName: itemRecord[this.lastNameAttr],
      imageUrl: itemRecord[this.imageUrlAttr],
      passwordHash: itemRecord[this.passwordAttr]
    }
  }

  protected getRowData(dto: UserDbItem): Record<string, any> {
    return {
      [this.userAliasAttr]: dto.alias,
      [this.firstNameAttr]: dto.firstName,
      [this.lastNameAttr]: dto.lastName,
      [this.imageUrlAttr]: dto.imageUrl,
      [this.passwordAttr]: dto.passwordHash
    }
  }

  protected getKey(dto: UserDto) {
    return { alias: dto.alias }
  }
}