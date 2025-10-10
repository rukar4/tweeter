import { UserService } from "../../model.service/UserService";
import { AuthToken, User } from "tweeter-shared";

export interface UserInfoView {
  setIsFollower: (isFollower: boolean) => void,
  setFolloweeCount: (followeeCount: number) => void,
  setFollowerCount: (followerCount: number) => void,
  setIsLoading: (isLoading: boolean) => void,
  displayInfoMessage: (message: string, duration: number,) => string,
  displayErrorMessage: (message: string) => void,
  deleteMessage: (message: string) => void
}

export class UserInfoPresenter {
  private readonly _view: UserInfoView
  private userService: UserService

  constructor(view: UserInfoView) {
    this._view = view
    this.userService = new UserService()
  }

  public async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ) {
    try {
      if (currentUser === displayedUser) {
        this._view.setIsFollower(false);
      } else {
        this._view.setIsFollower(
          await this.userService.getIsFollowerStatus(authToken!, currentUser!, displayedUser!)
        );
      }
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to determine follower status because of exception: ${ error }`
      );
    }
  }

  public async setNumbFollowees(
    authToken: AuthToken,
    displayedUser: User
  ) {
    try {
      this._view.setFolloweeCount(await this.userService.getFolloweeCount(authToken, displayedUser));
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to get followees count because of exception: ${ error }`
      );
    }
  };

  public async setNumbFollowers(
    authToken: AuthToken,
    displayedUser: User
  ) {
    try {
      this._view.setFollowerCount(await this.userService.getFollowerCount(authToken, displayedUser));
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to get followers count because of exception: ${ error }`
      );
    }
  }

  public async followUser(
    user: User,
    authToken: AuthToken
  ): Promise<void> {
    let followingUserToast = ""

    try {
      this._view.setIsLoading(true);
      followingUserToast = this._view.displayInfoMessage(
        `Following ${ user.name }...`,
        0
      );

      const [followerCount, followeeCount] = await this.userService.follow(
        authToken,
        user
      );

      this._view.setIsFollower(true);
      this._view.setFollowerCount(followerCount);
      this._view.setFolloweeCount(followeeCount);
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to follow user because of exception: ${ error }`
      );
    } finally {
      this._view.deleteMessage(followingUserToast);
      this._view.setIsLoading(false);
    }
  }

  public async unfollowUser(
    user: User,
    authToken: AuthToken
  ): Promise<void> {
    let unfollowingUserToast = ""

    try {
      this._view.setIsLoading(true)
      unfollowingUserToast = this._view.displayInfoMessage(
        `Unfollowing ${ user!.name }...`,
        0
      )

      const [followerCount, followeeCount] = await this.userService.unfollow(
        authToken,
        user
      )

      this._view.setIsFollower(false)
      this._view.setFollowerCount(followerCount)
      this._view.setFolloweeCount(followeeCount)
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to unfollow user because of exception: ${ error }`
      );
    } finally {
      this._view.deleteMessage(unfollowingUserToast)
      this._view.setIsLoading(false)
    }
  }
}