import { AuthToken, FollowList, User, UserDto } from "tweeter-shared"
import { Service } from "./Service"


export class FollowService extends Service {
  public loadMoreUsers(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null,
    listType: FollowList
  ): Promise<[User[], boolean]> {
    return this.serverFacade.getDtoList<UserDto, User>(
      {
        token: authToken.token,
        userAlias,
        pageSize,
        lastItem: lastItem?.dto ?? null
      },
      listType,
      User
    )
  }

  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    return this.serverFacade.getIsFollowerStatus({
      token: authToken.token,
      user: user.dto,
      selectedUser: selectedUser.dto
    })
  }

  public async getCount(
    authToken: AuthToken,
    user: User,
    listDesc: FollowList
  ): Promise<number> {
    return this.serverFacade.getCount({
        token: authToken.token,
        user: user.dto
      },
      listDesc
    )
  }

  public async updateFollowing(
    authToken: AuthToken,
    user: User,
    isFollowing: boolean
  ): Promise<[followerCount: number, followeeCount: number]> {
    return this.serverFacade.updateFollowing(
      {
        token: authToken.token,
        user: user.dto
      },
      isFollowing
    )
  }
}
