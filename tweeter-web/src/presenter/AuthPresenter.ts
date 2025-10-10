import { AuthService } from "../model.service/AuthService";
import { AuthToken, User } from "tweeter-shared";
import { Buffer } from "buffer";

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

export interface LoginView extends AuthView {
  setIsLoading: (isLoading: boolean) => void
  updateUserInfo: (currentUser: User, displayedUser: any, authToken: AuthToken, remember: boolean) => void
  navigateToOriginal: (url: string) => void
  navigateToFeed: (alias: string) => void
}

export interface RegisterView extends LoginView {
  setImageBytes: (bytes: Uint8Array) => void,
  setImageUrl: (url: string) => void,
  setImageFileExtension: (ext: string) => void
}

export interface LogoutView extends AuthView {
  deleteMessage: (messageId: string) => void,
  clearUserInfo: () => void,
  navigateToLogin: () => void
}

export abstract class AuthPresenter<T extends AuthView> {
  protected readonly _view: T
  protected authService: AuthService

  constructor(view: T) {
    this._view = view
    this.authService = new AuthService()
  }
}

export class LoginPresenter extends AuthPresenter<LoginView> {
  public async login(alias: string, password: string, rememberMe: boolean, originalUrl?: string) {
    try {
      this._view.setIsLoading(true);

      const [user, authToken] = await this.authService.login(alias, password);

      this._view.updateUserInfo(user, user, authToken, rememberMe);

      if (originalUrl) {
        this._view.navigateToOriginal(originalUrl)
      } else {
        this._view.navigateToFeed(user.alias)
      }
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to log user in because of exception: ${ error }`
      );
    } finally {
      this._view.setIsLoading(false);
    }
  };
}

export class RegisterPresenter extends AuthPresenter<RegisterView> {
  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageBytes: Uint8Array,
    imageFileExtension: string,
    rememberMe: boolean
  ) {
    try {
      this._view.setIsLoading(true);

      const [user, authToken] = await this.authService.register(
        firstName,
        lastName,
        alias,
        password,
        imageBytes,
        imageFileExtension
      );

      this._view.updateUserInfo(user, user, authToken, rememberMe);
      this._view.navigateToFeed(alias)
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to register user because of exception: ${ error }`
      );
    } finally {
      this._view.setIsLoading(false);
    }
  }

  public handleImageFile(file: File | undefined) {
    if (file) {
      this._view.setImageUrl(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;

        // Remove unnecessary file metadata from the start of the string.
        const imageStringBase64BufferContents =
          imageStringBase64.split("base64,")[1];

        const bytes: Uint8Array = Buffer.from(
          imageStringBase64BufferContents,
          "base64"
        );

        this._view.setImageBytes(bytes);
      };
      reader.readAsDataURL(file);

      // Set image file extension (and move to a separate method)
      const fileExtension = this.getFileExtension(file);
      if (fileExtension) {
        this._view.setImageFileExtension(fileExtension);
      }
    } else {
      this._view.setImageUrl("");
      this._view.setImageBytes(new Uint8Array());
    }
  };

  public getFileExtension(file: File): string | undefined {
    return file.name.split(".").pop();
  };
}

export class LogoutPresenter extends AuthPresenter<LogoutView> {
  public async logout(authToken: AuthToken) {
    const loggingOutToastId = this._view.displayInfoMessage("Logging Out...", 0)

    try {
      await this.authService.logout(authToken)

      this._view.deleteMessage(loggingOutToastId)
      this._view.clearUserInfo()
      this._view.navigateToLogin()
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to log user out because of exception: ${ error }`
      )
    }
  }
}