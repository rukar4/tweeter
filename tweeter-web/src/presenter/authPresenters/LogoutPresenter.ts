import { AuthToken } from "tweeter-shared";
import { MessageView, Presenter } from "../Presenter";
import { AuthService } from "../../model.service/AuthService";

export interface LogoutView extends MessageView {
  clearUserInfo: () => void,
  navigateToLogin: () => void,
}

export class LogoutPresenter extends Presenter<LogoutView> {
  private authService = new AuthService()

  public async logout(authToken: AuthToken) {
    const loggingOutToastId = this.view.displayInfoMessage("Logging Out...", 0)

    await this.executeOperation(async () => {
      await this.authService.logout(authToken)

      this.view.deleteMessage(loggingOutToastId)
      this.view.clearUserInfo()
      this.view.navigateToLogin()
    }, 'log user out')
  }
}