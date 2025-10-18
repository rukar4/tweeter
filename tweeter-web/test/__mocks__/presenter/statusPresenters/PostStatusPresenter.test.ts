import { PostStatusPresenter, PostStatusView } from "../../../../src/presenter/statusPresenters/PostStatusPresenter";
import { StatusService } from "../../../../src/model.service/StatusService";
import { anything, capture, instance, mock, spy, verify, when } from "@typestrong/ts-mockito";
import { AuthToken, User } from "tweeter-shared";

describe("PostStatusPresenter", () => {
  let mockView: PostStatusView
  let mockService: StatusService
  let presenter: PostStatusPresenter

  const post = 'Test post'
  const authToken = new AuthToken('0000-1111-2222', Date.now())
  const currentUser = new User('Cosmo', 'Cougar', '@cosmo', 'tweeter/pfp.jpg')
  const messageId = "messageID123"

  beforeEach(() => {
    mockView = mock<PostStatusView>()
    const mockViewInstance = instance(mockView)
    when(mockView.displayInfoMessage(anything(), 0)).thenReturn(messageId)

    const presenterSpy = spy(new PostStatusPresenter(mockViewInstance))
    presenter = instance(presenterSpy)
    mockService = mock<StatusService>()
    when(presenterSpy.statusService).thenReturn(instance(mockService))
  })

  it("tells the view to display a posting status message", async () => {
    await presenter.submitPost(post, currentUser, authToken)

    verify(mockView.displayInfoMessage("Posting status...", 0)).once()
  })

  it("calls postStatus on the post status service with the correct status string and auth token", async () => {
    await presenter.submitPost(post, currentUser, authToken)

    let [capturedToken, capturedPost] = capture(mockService.postStatus).last()

    expect(capturedToken).toEqual(authToken)
    expect(capturedPost.post).toEqual(post)
  })

  it("the presenter tells the view to clear the info message that was displayed previously, clear the post, and display a status posted message", async () => {
    await presenter.submitPost(post, currentUser, authToken)

    verify(mockView.deleteMessage(messageId)).once()
    verify(mockView.clearPost()).once()
    verify(mockView.displayInfoMessage("Status posted!", 2000)).once()
  })

  it("tells the view to clear the info message and display an error message but does not tell it to clear the post or display a status posted message", async () => {
    const error = new Error('An error occurred.')
    when(mockService.postStatus(anything(), anything())).thenThrow(error)

    await presenter.submitPost(post, currentUser, authToken)

    verify(mockView.deleteMessage(messageId)).once()
    verify(mockView.displayErrorMessage(`Failed to post the status because of exception: Error: An error occurred.`)).once()

    verify(mockView.clearPost()).never()
    verify(mockView.displayInfoMessage("Status posted!", 2000)).never()
  })
})