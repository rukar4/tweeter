import { StatusService } from "../../../src/model.service/StatusService"
import { AuthToken, Status } from "tweeter-shared"
import "isomorphic-fetch"

describe("StatusService", () => {
  const service = new StatusService()
  const authToken = new AuthToken("1234", 100)
  const userAlias = "Allen"
  const pageSize = 10
  const lastItem = null

  it("retrieves a list of story items", async () => {
    const [items, hasMore] = await service.loadMoreStatusItems(
      authToken, userAlias, pageSize, lastItem, 'story'
    )

    expect(hasMore).not.toBeNull()

    expect(items.length).toBeLessThanOrEqual(pageSize)
    if (items.length > 0) expect(items[0]).toBeInstanceOf(Status)
  })

  it("retrieves a list of feed items", async () => {
    const [items, hasMore] = await service.loadMoreStatusItems(
      authToken, userAlias, pageSize, lastItem, 'feed'
    )

    expect(hasMore).not.toBeNull()

    expect(items.length).toBeLessThanOrEqual(pageSize)
    if (items.length > 0) expect(items[0]).toBeInstanceOf(Status)
  })
})