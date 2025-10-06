import { AuthToken } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";
import { StatusItemPresenter, StatusItemView } from "./StatusItemPresenter";

export const PAGE_SIZE = 10;

export class FeedPresenter extends StatusItemPresenter{
  private service: StatusService

  constructor(view: StatusItemView) {
    super(view);
    this.service = new StatusService()
  }

  public async loadMoreItems (authToken: AuthToken, alias: string) {
    try {
      const [newItems, hasMore] = await this.service.loadMoreFeedItems(
        authToken,
        alias,
        PAGE_SIZE,
        this.lastItem
      );

      this.hasMoreItems = hasMore
      this.lastItem = newItems.length > 0 ? newItems[newItems.length - 1] : null
      this.view.addItems(newItems);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to load feed items because of exception: ${ error }`
      );
    }
  };
}