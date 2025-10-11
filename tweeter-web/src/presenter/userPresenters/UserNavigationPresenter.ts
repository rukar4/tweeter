import { UserService } from "../../model.service/UserService";
import { AuthToken, User } from "tweeter-shared";

export interface UserNavigationView {
  setDisplayedUser: (user: User) => void,
  navigateToFeature: (alias: string) => void
  displayErrorMessage: (
    message: string,
    bootstrapClasses?: string,
  ) => string,
}

export class UserNavigationPresenter {
  private userService: UserService
  private _view: UserNavigationView

  public constructor(view: UserNavigationView) {
    this.userService = new UserService()
    this._view = view
  }

  public async useUserNavigation(authToken: AuthToken, url: string, user: User) {
    try {
      const alias = this.extractAlias(url);

      const toUser = await this.userService.getUser(authToken!, alias);

      if (toUser) {
        if (!toUser.equals(user!)) {
          this._view.setDisplayedUser(toUser);
          this._view.navigateToFeature(alias)
        }
      }
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to get user because of exception: ${ error }`
      );
    }
  }

  private extractAlias(value: string): string {
    const index = value.indexOf("@");
    return value.substring(index);
  };
}