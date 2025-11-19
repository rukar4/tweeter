import FollowItem, { FollowItemKey } from "../entity/FollowItem";
import { DataPage } from "../entity/DataPage";

export interface DbDaoInterface<DTO, KEY> {
  createItem: (item: DTO) => Promise<void>
  retrieveItem: (key: KEY) => Promise<DTO | undefined>
  updateItem: (item: DTO) => Promise<void>
  deleteItem: (key: KEY) => Promise<void>
}

export interface ImageDaoInterface {
  createImage: (imageStringBase64: string, fileName: string) => Promise<void>
  getImageUrl: (fileName: string) => string
}

export interface FollowDaoInterface extends DbDaoInterface<FollowItem, FollowItemKey> {
  getPageFollowers: (followeeAlias: string, pageSize: number, lastFollowerAlias: string | undefined) => Promise<DataPage<FollowItem>>
  getPageFollowees: (followerAlias: string, pageSize: number, lastFolloweeAlias: string | undefined) => Promise<DataPage<FollowItem>>
}
