import { AuthToken, User } from "tweeter-shared"
import { UserItemPresenter } from "./UserItemPresenter"
import { PAGE_SIZE } from "../PagedItemPresenter"

export class FolloweePresenter extends UserItemPresenter {
  protected getMoreItems(authToken: AuthToken, userAlias: string): Promise<[User[], boolean]> {
    return this.service.loadMoreUsers(authToken, userAlias, PAGE_SIZE, this.lastItem, 'followees')
  }

  protected itemDesc(): string {
    return 'load followees'
  }
}
