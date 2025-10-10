import { StatusService } from "../../model.service/StatusService";
import { AuthToken, Status, User } from "tweeter-shared";

export interface PostStatusView {
  setIsLoading: (isLoading: boolean) => void
  displayInfoMessage: (
    message: string,
    duration: number,
    bootstrapClasses?: string,
  ) => string,
  displayErrorMessage: (
    message: string,
    bootstrapClasses?: string,
  ) => string,
  deleteMessage: (messageId: string) => void,
  clearPost: () => void
}

export class PostStatusPresenter {
  private readonly _view: PostStatusView
  private statusService: StatusService

  public constructor(view: PostStatusView) {
    this._view = view
    this.statusService = new StatusService()
  }

  public async submitPost (post: string, currentUser: User, authToken: AuthToken) {
    let postingStatusToastId = "";

    try {
      this._view.setIsLoading(true);
      postingStatusToastId = this._view.displayInfoMessage(
        "Posting status...",
        0
      );

      const status = new Status(post, currentUser, Date.now());

      await this.statusService.postStatus(authToken, status);

      this._view.clearPost();
      this._view.displayInfoMessage("Status posted!", 2000);
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to post the status because of exception: ${ error }`
      );
    } finally {
      this._view.deleteMessage(postingStatusToastId);
      this._view.setIsLoading(false);
    }
  };
}