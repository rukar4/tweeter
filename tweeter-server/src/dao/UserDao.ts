import { UserDto } from "tweeter-shared";
import { DynamoDbDao } from "./DynamoDbDao";

export class UserDao extends DynamoDbDao<UserDto, { alias: string }> {
  readonly userAliasAttr = 'alias'
  readonly firstNameAttr = 'first_name'
  readonly lastNameAttr = 'last_name'
  readonly imageUrlAttr = 'image_url'

  constructor() {
    super('user');
  }

  protected convertToDto(itemRecord: Record<string, any>): UserDto {
    return {
      alias: itemRecord[this.userAliasAttr],
      firstName: itemRecord[this.firstNameAttr],
      lastName: itemRecord[this.lastNameAttr],
      imageUrl: itemRecord[this.imageUrlAttr]
    }
  }

  protected getRowData(dto: UserDto): Record<string, any> {
    return {
      [this.userAliasAttr]: dto.alias,
      [this.firstNameAttr]: dto.firstName,
      [this.lastNameAttr]: dto.lastName,
      [this.imageUrlAttr]: dto.imageUrl
    }
  }

  protected getKey(dto: UserDto) {
    return { alias: dto.alias }
  }
}