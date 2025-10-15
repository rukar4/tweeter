import { UserService } from "../../model.service/UserService"
import { AuthToken, User } from "tweeter-shared"
import { MessageView, Presenter } from "../Presenter";

export interface UserInfoView extends MessageView{
  setIsFollower: (isFollower: boolean) => void,
  setFolloweeCount: (followeeCount: number) => void,
  setFollowerCount: (followerCount: number) => void,
  setIsLoading: (isLoading: boolean) => void,
  setDisplayedUser: (displayedUser: User) => void,
  switchToLoggedInUser: (url: string) => void
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
  private userService: UserService = new UserService()

  public async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ) {
    await this.executeOperation(async () => {
      if (currentUser === displayedUser) {
        this.view.setIsFollower(false);
      } else {
        this.view.setIsFollower(
          await this.userService.getIsFollowerStatus(authToken!, currentUser!, displayedUser!)
        );
      }
    }, 'determine follower status')
  }

  public async setNumbFollowees(
    authToken: AuthToken,
    user: User
  ) {
    await this.updateCount(
      'followees',
      () => this.userService.getFolloweeCount(authToken, user),
      (count) => this.view.setFolloweeCount(count)
    )
  }

  public async setNumbFollowers(
    authToken: AuthToken,
    user: User
  ) {
    await this.updateCount(
      'followers',
      () => this.userService.getFollowerCount(authToken, user),
      (count) => this.view.setFollowerCount(count)
    )
  }

  public async updateFollowers(
    user: User,
    authToken: AuthToken,
    isFollower: boolean
  ) {
    let userToast = ""

    await this.executeOperation(
      async () => {
        this.view.setIsLoading(true)
        userToast = this.view.displayInfoMessage(
          `${ isFollower ? 'Following' : 'Unfollowing' } ${ user.name }...`,
          0
        )

        const [followerCount, followeeCount] = isFollower
          ? await this.userService.follow(authToken, user)
          : await this.userService.unfollow(authToken, user)

        this.view.setIsFollower(isFollower)
        this.view.setFollowerCount(followerCount)
        this.view.setFolloweeCount(followeeCount)
      },
      isFollower ? 'follow user' : 'unfollow user',
      () => {
        this.view.deleteMessage(userToast)
        this.view.setIsLoading(false)
      }
    )
  }

  public switchToLoggedInUser(currentUser: User) {
    let url = this.getBaseUrl()
    this.view.setDisplayedUser(currentUser)
    this.view.switchToLoggedInUser(url)
  }

  public getBaseUrl = (): string => {
    const segments = location.pathname.split("/@");
    return segments.length > 1 ? segments[0] : "/";
  };
}