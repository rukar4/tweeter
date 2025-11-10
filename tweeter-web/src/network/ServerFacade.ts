import {
  AuthToken,
  GetCountResponse, GetUserRequest, GetUserResponse,
  IsFollowerRequest, IsFollowerResponse,
  ListType, LoginRequest, LoginResponse,
  PagedItemRequest,
  PagedItemResponse, RegisterRequest, TweeterRequest, TweeterResponse, UpdateFollowingResponse,
  User,
  UserDto, UserRequest, AuthenticatedRequest, StatusDto, Status, FollowList, PostStatusRequest,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL = "https://818okq4ej5.execute-api.us-west-2.amazonaws.com/prod";

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  private async callServer<REQ extends TweeterRequest, RES extends TweeterResponse, RET_TYPE>(
    req: REQ,
    path: string,
    marshal: (res: RES) => RET_TYPE
  ): Promise<RET_TYPE> {
    const res: RES = await this.clientCommunicator.doPost<REQ, RES>(req, path)

    if (res.success) {
      return marshal(res)
    } else {
      console.error(res);
      throw new Error(res.message ?? undefined);
    }
  }

  public async getDtoList<
    DTO_TYPE extends UserDto | StatusDto,
    MODEL_TYPE extends User | Status
  >(
    request: PagedItemRequest<DTO_TYPE>,
    listName: ListType,
    modelClass: { fromDto(dto: DTO_TYPE): MODEL_TYPE | null }
  ): Promise<[MODEL_TYPE[],boolean]> {
    const marshal = (res: PagedItemResponse<DTO_TYPE>): [MODEL_TYPE[], boolean] => {
      const items: MODEL_TYPE[] | null =
        res.items
          ? res.items.map((dto: DTO_TYPE) => modelClass.fromDto(dto) as MODEL_TYPE)
          : null;

      if (items == null) {
        throw new Error(`No ${ listName } found`);
      } else {
        return [items, res.hasMore];
      }
    }

    return this.callServer(request, `/${ listName }/list`, marshal)
  }

  public async getIsFollowerStatus(req: IsFollowerRequest): Promise<boolean> {
    const marshal = (res: IsFollowerResponse) => {
      const isFollower = res.isFollower ?? null
      if (isFollower === null) {
        throw new Error('No status found in response')
      } else {
        return isFollower
      }
    }

    return this.callServer(req, '/followers/status', marshal)
  }

  public async getCount(req: UserRequest, listType: FollowList): Promise<number> {
    const marshal = (res: GetCountResponse) => {
      const count = res.count ?? null
      if (count === null) {
        throw new Error('No count in response')
      } else {
        return count
      }
    }

    return this.callServer(req, `/${ listType }/count`, marshal)
  }

  public async updateFollowing(
    req: UserRequest,
    isFollowing: boolean
  ): Promise<[followerCount: number, followeeCount: number]> {
    const marshal = (res: UpdateFollowingResponse):[followerCount: number, followeeCount: number] => {
      return [res.followerCount, res.followeeCount]
    }

    return this.callServer(req, isFollowing ? '/follow' : '/unfollow', marshal)
  }

  public async getUser(req: GetUserRequest): Promise<User | null> {
    const marshal = (res: GetUserResponse) => {
      return User.fromDto(res.user)
    }

    return this.callServer(req, '/user/get', marshal)
  }

  public async login(req: LoginRequest | RegisterRequest, pathExt: 'login' | 'register'): Promise<[User, AuthToken]> {
    const marshal = (res: LoginResponse): [User, AuthToken] => {
      const user = User.fromDto(res.user)
      const authToken = AuthToken.fromDto(res.token)

      if (!user) throw Error('Response is missing user DTO')
      if (!authToken) throw Error('Response is missing authentication token DTO')
      return [user, authToken]
    }

    return this.callServer(req, `/user/${ pathExt }`, marshal)
  }

  public async logout(req: AuthenticatedRequest): Promise<void> {
    const marshal = (req: TweeterResponse) => {}
    return await this.callServer(req, '/user/logout', marshal)
  }

  public async postStatus(req: PostStatusRequest): Promise<void> {
    const marshal = (req: TweeterResponse) => {}
    return await this.callServer(req, '/status/post', marshal)
  }
}