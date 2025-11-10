import { AuthToken, User } from "tweeter-shared";
import { Service } from "./Service";
import { Buffer } from "buffer";

export class UserService extends Service {
  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    return this.serverFacade.getUser({
      token: authToken.token,
      alias
    })
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    return this.serverFacade.login(
      {
        alias,
        password
      },
      'login'
    )
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
    // Not needed now, but will be needed when you make the request to the server in milestone 3
    const imageStringBase64: string =
      Buffer.from(userImageBytes).toString("base64");

    return this.serverFacade.login(
      {
        firstName,
        lastName,
        alias,
        password,
        imageStringBase64,
        imageFileExtension
      },
      'register'
    )
  };

  public async logout(authToken: AuthToken): Promise<void> {
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    await this.serverFacade.logout({ token: authToken.token })
  }
}
