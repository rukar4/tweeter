import { ServerFacade } from "../../../src/network/ServerFacade";
import { AuthToken, PagedItemRequest, RegisterRequest, User, UserDto, UserRequest } from "tweeter-shared";
import "isomorphic-fetch"

describe("ServerFacade", () => {
  const serverFacade = new ServerFacade()

  it("registers a new user", async () => {
    const req: RegisterRequest = {
      alias: "@allen",
      password: "password",
      firstName: "Allen",
      lastName: "Anderson",
      imageStringBase64: "01234",
      imageFileExtension: ".txt",
    }
    const [user, authToken] = await serverFacade.login(req, "register")

    expect(user).toBeInstanceOf(User)
    expect(user.name).toEqual("Allen Anderson")

    expect(authToken).toBeInstanceOf(AuthToken)
    expect(authToken.token).toBeDefined()
    expect(authToken.timestamp).toBeDefined()
  })

  it("gets a list of followers", async () => {
    const req: PagedItemRequest<UserDto> = {
      token: "1234",
      userAlias: "Allen",
      pageSize: 10,
      lastItem: null
    }

    const [items, hasMore] = await serverFacade.getDtoList(req, 'followers', User)

    expect(items.length).toBeLessThanOrEqual(10)
    if (items.length > 0) expect(items[0]).toBeInstanceOf(User)
    expect(hasMore).not.toBeNull()
  })

  it("gets the count of followers", async () => {
    const req: UserRequest = {
      token: "1234",
      user: {
        firstName: "Allen",
        lastName: "Anderson",
        alias: "@allen",
        imageUrl: ""
      }
    }

    const count = await serverFacade.getCount(req, 'followers')

    expect(count).not.toBeNaN()
  })
})