import Login from "../../../../../src/components/authentication/login/Login";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { UserEvent, userEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom"
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { instance, mock, verify } from "@typestrong/ts-mockito";
import { LoginPresenter } from "../../../../../src/presenter/authPresenters/LoginPresenter";

library.add(fab)

describe("Login Component", () => {
  const alias = "@cosmo"
  const password = "cougar123"
  const originalUrl = "https://tweeter.com/test"

  const user = userEvent.setup()

  it("starts with sign-in button disabled", () => {
    renderLogin()
    const { signInButton } = getElements()
    expect(signInButton).toBeDisabled()
  })

  it("enables the sign-in button if both alias and password fields have text", async () => {
    renderLogin()
    await fillFields(alias, password, user)
  })

  it("disables the sign-in button if either field is empty", async () => {
    renderLogin()
    await fillFields(alias, password, user)
    const { signInButton, aliasField, passwordField } = getElements()

    await user.clear(aliasField)
    expect(signInButton).toBeDisabled()

    await user.type(aliasField, alias)
    expect(signInButton).toBeEnabled()

    await user.clear(passwordField)
    expect(signInButton).toBeDisabled()
  })

  it("calls presenter login method with correct parameters when sign-in is clicked", async () => {
    const mockPresenter = mock<LoginPresenter>()
    const mockPresenterInstance = instance(mockPresenter)

    renderLogin(originalUrl, mockPresenterInstance)
    await fillFields(alias, password, user)

    const { signInButton } = getElements()
    await user.click(signInButton)

    verify(mockPresenter.login(alias, password, false, originalUrl)).once()
  })
})

async function fillFields(alias: string, password: string, user: UserEvent) {
  const { signInButton, aliasField, passwordField } = getElements()
  await user.type(aliasField, alias)
  await user.type(passwordField, password)

  expect(signInButton).toBeEnabled()
}

function renderLogin(originalUrl?: string, presenter?: LoginPresenter) {
  return render(
    <MemoryRouter>
      <Login originalUrl={ originalUrl } presenter={ presenter }/>
    </MemoryRouter>
  )
}

function getElements() {
  const signInButton = screen.getByRole("button", { name: /Sign in/i })
  const aliasField = screen.getByLabelText("alias")
  const passwordField = screen.getByLabelText("password")

  return { signInButton, aliasField, passwordField }
}