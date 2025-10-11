import { AuthService } from "../../model.service/AuthService";
import { MessageView, Presenter } from "../Presenter";
import { AuthToken, User } from "tweeter-shared";

export interface AuthView extends MessageView {
  setIsLoading: (isLoading: boolean) => void
  updateUserInfo: (currentUser: User, displayedUser: any, authToken: AuthToken, remember: boolean) => void
  navigateToOriginal: (url: string) => void
  navigateToFeed: (alias: string) => void
}

export abstract class AuthPresenter<T extends AuthView> extends Presenter<T> {
  private _authService: AuthService = new AuthService()

  protected async authenticate(
    operation: () => Promise<[User, AuthToken]>,
    rememberMe: boolean,
    operationDesc: string,
    originalUrl?: string
  ) {
    await this.executeOperation(async () => {
      this.view.setIsLoading(true)

      const [user, authToken] = await operation();

      this.view.updateUserInfo(user, user, authToken, rememberMe);

      if (originalUrl) {
        this.view.navigateToOriginal(originalUrl)
      } else {
        this.view.navigateToFeed(user.alias)
      }
    }, operationDesc, () => this.view.setIsLoading(false))
  }

  protected get authService(): AuthService {
    return this._authService;
  }
}
