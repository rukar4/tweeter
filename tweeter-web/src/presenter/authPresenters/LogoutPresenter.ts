import { AuthToken } from "tweeter-shared";
import { AuthPresenter, AuthView } from "./AuthPresenter";

export interface LogoutView extends AuthView {
  deleteMessage: (messageId: string) => void,
  clearUserInfo: () => void,
  navigateToLogin: () => void
}

export class LogoutPresenter extends AuthPresenter<LogoutView> {
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