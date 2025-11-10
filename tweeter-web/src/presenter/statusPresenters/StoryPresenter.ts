import { AuthToken, Status } from "tweeter-shared"
import { PAGE_SIZE } from "../PagedItemPresenter"
import { StatusItemPresenter } from "./StatusItemPresenter";

export class StoryPresenter extends StatusItemPresenter {
  protected getMoreItems(authToken: AuthToken, userAlias: string): Promise<[Status[], boolean]> {
    return this.service.loadMoreStatusItems(authToken, userAlias, PAGE_SIZE, this.lastItem, 'story')
  }

  protected itemDesc(): string {
    return 'load story items'
  }
}