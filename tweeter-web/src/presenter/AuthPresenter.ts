import { AuthService } from "../model.service/AuthService";
import { AuthToken, User } from "tweeter-shared";

export interface AuthView {
  displayInfoMessage: (
    message: string,
    duration: number,
    bootstrapClasses?: string,
  ) => string,
  displayErrorMessage: (
    message: string,
    bootstrapClasses?: string,
  ) => string,
}

export interface LoginView extends AuthView {
  setIsLoading: (isLoading: boolean) => void
  updateUserInfo: (currentUser: User, displayedUser: any, authToken: AuthToken, remember: boolean) => void
  navigateToOriginal: (url: string) => void
  navigateToFeed: (alias: string) => void
}

export interface LogoutView extends AuthView {
  deleteMessage: (messageId: string) => void,
  clearUserInfo: () => void,
  navigateToLogin: () => void
}

export abstract class AuthPresenter<T extends AuthView> {
  protected readonly _view: T
  protected authService: AuthService

  constructor(view: T) {
    this._view = view
    this.authService = new AuthService()
  }
}

export class LogoutPresenter extends AuthPresenter<LogoutView>{
  public async logout(authToken: AuthToken) {
    const loggingOutToastId = this._view.displayInfoMessage("Logging Out...", 0)

    try {
      await this.authService.logout(authToken)

      this._view.deleteMessage(loggingOutToastId)
      this._view.clearUserInfo()
      this._view.navigateToLogin()
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to log user out because of exception: ${ error }`
      )
    }
  }
}

export class LoginPresenter extends AuthPresenter<LoginView>{
  public async login (alias: string, password: string, rememberMe: boolean, originalUrl?: string) {
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