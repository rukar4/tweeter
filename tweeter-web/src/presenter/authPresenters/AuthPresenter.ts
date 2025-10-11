import { AuthService } from "../../model.service/AuthService";

export interface AuthView {
  displayInfoMessage: (
    message: string,
    duration: number,
    bootstrapClasses?: string,
  ) => string,
  displayErrorMessage: (
    message: string,
    bootstrapClasses?: string,
  ) => string,
}

export abstract class AuthPresenter<T extends AuthView> {
  protected readonly _view: T
  protected authService: AuthService

  constructor(view: T) {
    this._view = view
    this.authService = new AuthService()
  }
}
