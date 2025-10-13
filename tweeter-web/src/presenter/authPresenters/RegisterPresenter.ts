import { Buffer } from "buffer";
import { AuthPresenter, AuthView } from "./AuthPresenter";

export interface RegisterView extends AuthView {
  setImageBytes: (bytes: Uint8Array) => void,
  setImageUrl: (url: string) => void,
  setImageFileExtension: (ext: string) => void
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
    await this.authenticate(
      () => this.authService.register(firstName, lastName, alias, password, imageBytes, imageFileExtension),
      rememberMe,
      'register user'
    )
  }

  public handleImageFile(bytes64: string, fileName: string, imageUrl: string) {
    if (!bytes64) {
      this.view.setImageUrl("")
      this.view.setImageBytes(new Uint8Array())
      return
    }

    this.view.setImageUrl(imageUrl)

    // Remove unnecessary file metadata from the start of the string.
    const imageStringBase64BufferContents = bytes64.split("base64,")[1]
    const bytes: Uint8Array = Buffer.from(
      imageStringBase64BufferContents,
      'base64'
    )

    this.view.setImageBytes(bytes)
    this.view.setImageFileExtension(this.getFileExtension(fileName) ?? '')
  };

  private getFileExtension(fileName: string): string | undefined {
    return fileName.split(".").pop();
  };
}