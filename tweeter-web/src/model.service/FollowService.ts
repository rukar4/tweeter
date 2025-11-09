import { AuthToken, FakeData, User, ListType } from "tweeter-shared"
import { Service } from "./Service"


export class FollowService extends Service {
  public loadMoreUsers(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null,
    listType: ListType
  ): Promise<[User[], boolean]> {
    return this.serverFacade.getUserDtos(
      {
        token: authToken.token,
        userAlias,
        pageSize,
        lastItem: lastItem?.dto ?? null
      },
      listType
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
    itemsDesc: ListType
  ): Promise<number> {
    return this.serverFacade.getCount({
        token: authToken.token,
        user: user.dto
      },
      itemsDesc
    )
  }

  public async updateFollowing(
    authToken: AuthToken,
    userToUpdate: User,
    isFollowing: boolean
  ): Promise<[followerCount: number, followeeCount: number]> {
    await new Promise((f) => setTimeout(f, 2000))

    // TODO: Call the server facade based on follow

    const followerCount = await this.getCount(authToken, userToUpdate, "followers")
    const followeeCount = await this.getCount(authToken, userToUpdate, "followees")

    return [followerCount, followeeCount]
  }
}
