import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface UserItemView {
  addItems: (items: User[]) => void
  displayErrorMessage: (message: string) => void
}

export abstract class UserItemPresenter {
  private readonly _view: UserItemView
  private userService: UserService
  private _hasMoreItems = true
  private _lastItem: User | null = null

  protected constructor(view: UserItemView) {
    this._view = view
    this.userService = new UserService()
  }

  public abstract loadMoreItems(authToken: AuthToken, userAlias: string): void

  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    return await this.userService.getUser(authToken, alias)
  }

  reset() {
    this._lastItem = null
    this._hasMoreItems = true;
  }

  protected get view() {
    return this._view
  }

  public get hasMoreItems(): boolean {
    return this._hasMoreItems;
  }

  protected set hasMoreItems(value: boolean) {
    this._hasMoreItems = value;
  }

  protected get lastItem(): User | null {
    return this._lastItem;
  }

  protected set lastItem(value: User | null) {
    this._lastItem = value;
  }
}
