import { User } from "tweeter-shared";
import { PagedItemPresenter } from "../PagedItemPresenter";
import { FollowService } from "../../model.service/FollowService";
import { ServerFacade } from "../../network/ServerFacade";

export abstract class UserItemPresenter extends PagedItemPresenter<User, FollowService> {
  protected serviceFactory(): FollowService {
    return new FollowService();
  }
}
