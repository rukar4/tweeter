import { StatusService } from "../../model.service/StatusService";
import { AuthToken, Status, User } from "tweeter-shared";
import { MessageView, Presenter } from "../Presenter";

export interface PostStatusView extends MessageView {
  setIsLoading: (isLoading: boolean) => void
  clearPost: () => void
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
  private statusService: StatusService = new StatusService()

  public async submitPost (post: string, currentUser: User, authToken: AuthToken) {
    let postingStatusToastId = "";

    try {
      this.view.setIsLoading(true);
      postingStatusToastId = this.view.displayInfoMessage(
        "Posting status...",
        0
      );

      const status = new Status(post, currentUser, Date.now());

      await this.statusService.postStatus(authToken, status);

      this.view.clearPost();
      this.view.displayInfoMessage("Status posted!", 2000);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to post the status because of exception: ${ error }`
      );
    } finally {
      this.view.deleteMessage(postingStatusToastId);
      this.view.setIsLoading(false);
    }
  };
}