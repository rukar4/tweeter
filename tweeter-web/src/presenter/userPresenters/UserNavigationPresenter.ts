import { UserService } from "../../model.service/UserService"
import { AuthToken, User } from "tweeter-shared"
import { Presenter } from "../Presenter"

export interface UserNavigationView {
  setDisplayedUser: (user: User) => void,
  navigateToFeature: (alias: string, featurePath: string) => void
  displayErrorMessage: (
    message: string,
    bootstrapClasses?: string,
  ) => string,
}

export class UserNavigationPresenter extends Presenter<UserNavigationView> {
  private userService: UserService = new UserService()

  public async useUserNavigation(authToken: AuthToken, url: string, featurePath: string, user: User) {
    await this.executeOperation(async () => {
      const alias = this.extractAlias(url);

      const toUser = await this.userService.getUser(authToken!, alias)

      if (toUser) {
        if (!toUser.equals(user!)) {
          this.view.setDisplayedUser(toUser)
          this.view.navigateToFeature(alias, featurePath)
        }
      }
    }, 'get user')
  }

  private extractAlias(value: string): string {
    const index = value.indexOf("@")
    return value.substring(index)
  };
}