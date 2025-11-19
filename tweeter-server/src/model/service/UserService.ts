import { AuthTokenDto, FakeData, UserDto } from "tweeter-shared"
import { DbDaoInterface, ImageDaoInterface } from "../../dao/DaoInterfaces";
import bcrypt from "bcryptjs";
import { UserDbItem } from "../../entity/UserDbItem";

export class UserService {
  // TODO: Create DAO factory
  constructor(private userDao: DbDaoInterface<UserDbItem, { alias: string }>, private imageDao: ImageDaoInterface) {
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
    const user = await this.userDao.retrieveItem({ alias })

    if (user === null) {
      throw new Error("unauthorized: Invalid alias or password")
    }

    const { firstName, lastName, imageUrl, passwordHash } = user

    const isValid = await bcrypt.compare(password, passwordHash)

    if (!isValid) {
      throw new Error("unauthorized: Invalid alias or password")
    }

    // TODO: Create auth token
    return [
      { alias, firstName, lastName, imageUrl },
      FakeData.instance.authToken.dto
    ]
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
    const imageUrl = this.imageDao.getImageUrl(fileName)

    const userDto: UserDto = { alias, firstName, lastName, imageUrl }

    await this.userDao.createItem(
      {
        ...userDto,
        passwordHash: await this.hashPassword(password)
      }
    )

    //TODO: Create auth token

    return [userDto, FakeData.instance.authToken.dto]
  }

  public async logout(token: string): Promise<void> {
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    await new Promise((res) => setTimeout(res, 1000))
  }

  private async hashPassword(password: string) {
    const salt = bcrypt.genSaltSync(10)
    return bcrypt.hashSync(password, salt)
  }
}
