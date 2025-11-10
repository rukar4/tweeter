import {
  GetCountResponse,
  IsFollowerRequest, IsFollowerResponse,
  ListType,
  PagedUserItemRequest,
  PagedUserItemResponse, UpdateFollowingResponse,
  User,
  UserDto, UserRequest,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL = "https://818okq4ej5.execute-api.us-west-2.amazonaws.com/prod";

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  public async getUserDtos(request: PagedUserItemRequest, listName: ListType): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, `/${listName}/list`);

    // Convert the UserDto array returned by ClientCommunicator to a User array
    const items: User[] | null =
      response.success && response.items
        ? response.items.map((dto: UserDto) => User.fromDto(dto) as User)
        : null;

    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error(`No ${listName} found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async getIsFollowerStatus(req: IsFollowerRequest): Promise<boolean> {
    const res = await this.clientCommunicator.doPost<
      IsFollowerRequest,
      IsFollowerResponse
    >(req, '/followers/status')

    if (res.success) {
      const isFollower = res.isFollower ?? null
      if (isFollower === null) {
        throw new Error('No status found in response')
      } else {
        return isFollower
      }
    } else {
      console.error(res);
      throw new Error(res.message ?? undefined);
    }
  }

  public async getCount(req: UserRequest, listType: ListType): Promise<number> {
    const res = await this.clientCommunicator.doPost<
      UserRequest,
      GetCountResponse
    >(req, `/${listType}/count`)

    if (res.success) {
      const count = res.count ?? null
      if (count === null) {
        throw new Error('No count in response')
      } else {
        return count
      }
    } else {
      console.error(res);
      throw new Error(res.message ?? undefined);
    }
  }

  public async updateFollowing(
    req: UserRequest,
    isFollowing: boolean
  ): Promise<[followerCount: number, followeeCount: number]> {
    const res = await this.clientCommunicator.doPost<
      UserRequest,
      UpdateFollowingResponse
    >(req, isFollowing ? '/follow' : '/unfollow')

    if (res.success && res.followerCount && res.followeeCount) {
      return [res.followerCount, res.followeeCount]
    } else {
      console.error(res);
      throw new Error(res.message ?? undefined);
    }
  }
}