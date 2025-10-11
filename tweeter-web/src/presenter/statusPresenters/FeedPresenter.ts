import { AuthToken, Status } from "tweeter-shared";
import { PAGE_SIZE } from "../PagedItemPresenter";
import { StatusItemPresenter } from "./StatusItemPresenter";

export class FeedPresenter extends StatusItemPresenter {
  protected getMoreItems(authToken: AuthToken, userAlias: string): Promise<[Status[], boolean]> {
    return this.service.loadMoreFeedItems(authToken, userAlias, PAGE_SIZE, this.lastItem);
  }

  protected itemDesc(): string {
    return 'load feed items';
  }
}