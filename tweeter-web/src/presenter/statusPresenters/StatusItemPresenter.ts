import { AuthToken, Status, User } from "tweeter-shared";
import { UserService } from "../../model.service/UserService";

export interface StatusItemView {
  addItems: (items: Status[]) => void,
  displayErrorMessage: (message: string) => void
}

export abstract class StatusItemPresenter {
  private readonly _view: StatusItemView
  private userService: UserService
  private _hasMoreItems: boolean = true
  private _lastItem: Status | null = null

  protected constructor(view: StatusItemView) {
    this._view = view
    this.userService = new UserService()
  }

  public abstract loadMoreItems(authToken: AuthToken, alias: string): void

  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    // TODO: Replace with the result of calling server
    return this.userService.getUser(authToken, alias)
  };

  reset() {
    this._lastItem = null
    this._hasMoreItems = true
  }

  protected get view(): StatusItemView {
    return this._view;
  }

  public get hasMoreItems(): boolean {
    return this._hasMoreItems;
  }

  protected set hasMoreItems(value: boolean) {
    this._hasMoreItems = value;
  }

  protected get lastItem(): Status | null {
    return this._lastItem;
  }

  protected set lastItem(value: Status | null) {
    this._lastItem = value;
  }
}