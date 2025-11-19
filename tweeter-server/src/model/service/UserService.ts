import { AuthTokenDto, FakeData, UserDto } from "tweeter-shared"
import { DynamoDbDao } from "../../dao/DynamoDbDao";
import { ImageDaoInterface } from "../../dao/DaoInterfaces";

export class UserService {
  // TODO: Create DAO factory
  constructor(private userDao: DynamoDbDao<UserDto, { alias: string }>, private imageDao: ImageDaoInterface) {
  }

  public async getUser(
    token: string,
    alias: string
  ): Promise<UserDto | null> {
    return this.userDao.retrieveItem({ alias })
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[UserDto, AuthTokenDto]> {
    // TODO: Replace with the result of calling the server
    const user = FakeData.instance.firstUser

    if (user === null) {
      throw new Error("unauthorized: Invalid alias or password")
    }

    return [user.dto, FakeData.instance.authToken.dto]
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageStringBase64: string,
    imageFileExtension: string
  ): Promise<[UserDto, AuthTokenDto]> {
    const fileName = `${ alias }.${ imageFileExtension }`
    await this.imageDao.createImage(imageStringBase64, fileName)
    const imageUrl = await this.imageDao.getImageUrl(fileName)

    await this.userDao.createItem({
      alias,
      firstName,
      lastName,
      imageUrl
    })

    const user = await this.userDao.retrieveItem({ alias })

    return [user, FakeData.instance.authToken.dto]
  }

  public async logout(token: string): Promise<void> {
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    await new Promise((res) => setTimeout(res, 1000))
  }
}
