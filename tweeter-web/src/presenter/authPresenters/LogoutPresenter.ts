import { AuthToken } from "tweeter-shared";
import { MessageView, Presenter } from "../Presenter";
import { UserService } from "../../model.service/UserService";

export interface LogoutView extends MessageView {
  clearUserInfo: () => void,
  navigateToLogin: () => void,
}

export class LogoutPresenter extends Presenter<LogoutView> {
  private _userService = new UserService()

  public async logout(authToken: AuthToken) {
    const loggingOutToastId = this.view.displayInfoMessage("Logging Out...", 0)

    await this.executeOperation(async () => {
      await this.userService.logout(authToken)

      this.view.deleteMessage(loggingOutToastId)
      this.view.clearUserInfo()
      this.view.navigateToLogin()
    }, 'log user out')
  }


  get userService(): UserService {
    return this._userService;
  }
}