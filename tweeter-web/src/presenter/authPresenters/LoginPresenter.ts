import { AuthToken, User } from "tweeter-shared";
import { AuthPresenter, AuthView } from "./AuthPresenter";

export interface LoginView extends AuthView {
  setIsLoading: (isLoading: boolean) => void
  updateUserInfo: (currentUser: User, displayedUser: any, authToken: AuthToken, remember: boolean) => void
  navigateToOriginal: (url: string) => void
  navigateToFeed: (alias: string) => void
}

export class LoginPresenter extends AuthPresenter<LoginView> {
  public async login(alias: string, password: string, rememberMe: boolean, originalUrl?: string) {
    try {
      this._view.setIsLoading(true);

      const [user, authToken] = await this.authService.login(alias, password);

      this._view.updateUserInfo(user, user, authToken, rememberMe);

      if (originalUrl) {
        this._view.navigateToOriginal(originalUrl)
      } else {
        this._view.navigateToFeed(user.alias)
      }
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to log user in because of exception: ${ error }`
      );
    } finally {
      this._view.setIsLoading(false);
    }
  };
}