import { LogoutPresenter, LogoutView } from "../../../../src/presenter/authPresenters/LogoutPresenter";
import { anything, capture, instance, mock, spy, verify, when } from "@typestrong/ts-mockito";
import { AuthToken } from "tweeter-shared";
import { UserService } from "../../../../src/model.service/UserService";

describe("LogoutPresenter", () => {
  let mockView: LogoutView
  let presenter: LogoutPresenter
  let mockService: UserService

  const authToken = new AuthToken('0000-1111-2222', Date.now())
  beforeEach(() => {
    mockView = mock<LogoutView>()
    const mockViewInstance = instance(mockView)
    when(mockView.displayInfoMessage(anything(), 0)).thenReturn("messageID123")

    const presenterSpy = spy(new LogoutPresenter(mockViewInstance))
    presenter = instance(presenterSpy)
    mockService = mock<UserService>()
    when(presenterSpy.userService).thenReturn(instance(mockService))
  })

  it("tells the view to display a logging out message", async () => {
    await presenter.logout(authToken)
    verify(mockView.displayInfoMessage("Logging Out...", 0)).once()
  })

  it("calls logout on the user service with the correct auth token", async () => {
    await presenter.logout(authToken)
    verify(mockService.logout(authToken)).once()
  })

  it("tells the view to clear the info message that was displayed previously, clear the user info, and navigate to the login page", async () => {
    await presenter.logout(authToken)

    verify(mockView.deleteMessage("messageID123")).once()
    verify(mockView.clearUserInfo()).once()
    verify(mockView.navigateToLogin()).once()

    verify(mockView.displayErrorMessage(anything())).never()
  })

  it("tells the view to display an error message and does not tell it to clear the info message, clear the user info or navigate to the login page", async () => {
    const error = new Error("An error occurred.")
    when(mockService.logout(anything())).thenThrow(error)

    await presenter.logout(authToken)

    verify(mockView.displayErrorMessage(`Failed to log user out because of exception: Error: An error occurred.`)).once()

    verify(mockView.deleteMessage(anything())).never()
    verify(mockView.clearUserInfo()).never()
    verify(mockView.navigateToLogin()).never()
  })
})