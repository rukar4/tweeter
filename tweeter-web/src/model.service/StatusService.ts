import { AuthToken, Status, StatusDto, StatusList } from "tweeter-shared"
import { Service } from "./Service"

export class StatusService extends Service {
  public async loadMoreStatusItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null,
    listType: StatusList
  ): Promise<[Status[], boolean]> {
    return this.serverFacade.getDtoList<StatusDto, Status>(
      {
        token: authToken.token,
        userAlias,
        pageSize,
        lastItem: lastItem?.dto ?? null
      },
      listType,
      Status
    )
  }

  public async postStatus (
    authToken: AuthToken,
    newStatus: Status
  ): Promise<void> {
    return this.serverFacade.postStatus({
      token: authToken.token,
      newStatus: newStatus.dto
    })
  }
}
