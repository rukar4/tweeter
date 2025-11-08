import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PostStatusPresenter } from "../../../../src/presenter/statusPresenters/PostStatusPresenter";
import PostStatus from "../../../../src/components/postStatus/PostStatus";
import "@testing-library/jest-dom"
import { userEvent, UserEvent } from "@testing-library/user-event";
import { instance, mock, verify } from "@typestrong/ts-mockito";
import { AuthToken, User } from "tweeter-shared";
import { useUserInfo } from "../../../../src/components/userInfo/UserHooks";

interface PostStatusElements {
  textField: HTMLElement,
  postButton: HTMLElement,
  clearButton: HTMLElement
}

jest.mock("../../../../src/components/userInfo/UserHooks", () => ({
  ...jest.requireActual("../../../../src/components/userInfo/UserHooks"),
  __esModule: true,
  useUserInfo: jest.fn(),
}))

describe("PostStatus Component", () => {
  const user = userEvent.setup()

  const post = "Testing post status"

  const mockUser = mock<User>();
  const mockAuthToken = mock<AuthToken>();

  const mockUserInstance = instance(mockUser)
  const mockAuthTokenInstance  = instance(mockAuthToken)

  beforeAll(() => {
    (useUserInfo as jest.Mock).mockReturnValue({
      currentUser: mockUserInstance,
      authToken: mockAuthTokenInstance,
    });
  })

  it("starts with Post Status and Clear buttons disabled", () => {
    renderPostStatus()
    const elems = getElements()

    expect(elems.postButton).toBeDisabled()
    expect(elems.clearButton).toBeDisabled()
  })

  it("enables Post Status and Clear buttons when text field has text", async () => {
    renderPostStatus()
    await fillTextField(getElements(), post, user)
  })

  it("disables Post Status and Clear buttons when text field is cleared", async () => {
    renderPostStatus()
    const elems = getElements()

    await fillTextField(elems, post, user)

    await user.clear(elems.textField)
    expect(elems.postButton).toBeDisabled()
    expect(elems.clearButton).toBeDisabled()
  })

  it("calls presenter postStatus method with correct parameters when the Post Status button is pressed", async () => {
    const mockPresenter = mock<PostStatusPresenter>()
    const mockPresenterInstance = instance(mockPresenter)

    renderPostStatus(mockPresenterInstance)
    const elems = getElements()
    await fillTextField(elems, post, user)
    await user.click(elems.postButton)

    verify(mockPresenter.submitPost(post, mockUserInstance, mockAuthTokenInstance)).once()
  })
})

function renderPostStatus(presenter?: PostStatusPresenter) {
  return render(
    <MemoryRouter>
      <PostStatus presenter={ presenter }/>
    </MemoryRouter>
  )
}

async function fillTextField(elems: PostStatusElements, status: string, user: UserEvent) {
  await user.type(elems.textField, status)
  expect(elems.postButton).toBeEnabled()
  expect(elems.clearButton).toBeEnabled()
}

function getElements() {
  const postButton = screen.getByLabelText("post-status")
  const clearButton = screen.getByLabelText("clear")
  const textField = screen.getByLabelText("status-field")

  return { postButton, clearButton, textField }
}
