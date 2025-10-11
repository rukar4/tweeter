import { AuthPresenter, AuthView } from "./AuthPresenter";

export class LoginPresenter extends AuthPresenter<AuthView> {
  public async login(alias: string, password: string, rememberMe: boolean, originalUrl?: string) {
    await this.authenticate(
      () => this.authService.login(alias, password),
      rememberMe,
      'log user in',
      originalUrl
    )
  }
}