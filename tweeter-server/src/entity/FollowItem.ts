export interface FollowItemKey {
  follower_alias: string,
  followee_alias: string,
}

export default class FollowItem implements FollowItemKey {
  constructor(
    public follower_alias: string,
    public followee_alias: string,
    public follower_name: string,
    public followee_name: string
  ) {
  }

  public get key(): FollowItemKey {
    return {
      follower_alias: this.follower_alias,
      followee_alias: this.followee_alias
    }
  }
}