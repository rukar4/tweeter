import FollowItem, { FollowItemKey } from "../entity/FollowItem";
import { DataPage } from "../entity/DataPage";

export interface Dao<ROW, KEY> {
  createItem: (item: ROW) => Promise<void>
  retrieveItem: (key: KEY) => Promise<ROW> | undefined
  updateItem: (item: ROW) => Promise<void>
  deleteItem: (key: KEY) => Promise<void>
}

export interface FollowDaoInterface extends Dao<FollowItem, FollowItemKey>{
  getPageFollowers: (followeeAlias: string, pageSize: number, lastFollowerAlias: string | undefined) => Promise<DataPage<FollowItem>>
  getPageFollowees: (followerAlias: string, pageSize: number, lastFolloweeAlias: string | undefined) => Promise<DataPage<FollowItem>>
}