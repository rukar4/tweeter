import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand, QueryCommandInput,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DataPage } from "../entity/DataPage";
import FollowItem, { FollowItemKey } from "../entity/FollowItem";
import { FollowDaoInterface } from "./DaoInterfaces";

export default class FollowDao implements FollowDaoInterface {
  readonly tableName = 'follow'
  readonly indexName = 'follow_index'
  readonly followerAliasAttr = 'follower_alias'
  readonly followeeAliasAttr = 'followee_alias'
  readonly followerNameAttr = 'follower_name'
  readonly followeeNameAttr = 'followee_name'

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient())

  async createItem(item: FollowItem) {
    const dbRelation: FollowItem | undefined = await this.retrieveItem(item.key)
    if (dbRelation) return

    const params = {
      TableName: this.tableName,
      Item: {
        ...item.key,
        [this.followerNameAttr]: item.follower_name,
        [this.followeeNameAttr]: item.followee_name
      }
    }
    await this.client.send(new PutCommand(params))
  }

  async retrieveItem(key: FollowItemKey): Promise<FollowItem> | undefined {
    const params = {
      TableName: this.tableName,
      Key: key
    }
    const output = await this.client.send(new GetCommand(params))
    return !output || !output.Item
      ? undefined
      : new FollowItem(
        output.Item[this.followerAliasAttr],
        output.Item[this.followeeAliasAttr],
        output.Item[this.followerNameAttr],
        output.Item[this.followeeNameAttr]
      )
  }

  async updateItem(relation: FollowItem) {
    const dbRelation: FollowItem | undefined = await this.retrieveItem(relation)
    if (!dbRelation) throw new Error('Relation not found')

    const params = {
      TableName: this.tableName,
      Key: dbRelation.key,
      ExpressionAttributeValues: {
        ':followerName': relation.follower_name,
        ':followeeName': relation.followee_name
      },
      UpdateExpression: `
        SET ${ this.followerNameAttr } = :followerName,
            ${ this.followeeNameAttr } = :followeeName
        `,
    }
    await this.client.send(new UpdateCommand(params))
  }

  async deleteItem(key: FollowItemKey) {
    const params = {
      TableName: this.tableName,
      Key: key
    }
    await this.client.send(new DeleteCommand(params))
  }

  async getPageFollowees(followerAlias: string, pageSize: number, lastFolloweeAlias: string | undefined): Promise<DataPage<FollowItem>> {
    const params = {
      KeyConditionExpression: this.followerAliasAttr + " = :follower",
      ExpressionAttributeValues: {
        ":follower": followerAlias,
      },
      TableName: this.tableName,
      Limit: pageSize,
      ExclusiveStartKey:
        lastFolloweeAlias === undefined
          ? undefined
          : {
            [this.followerAliasAttr]: followerAlias,
            [this.followeeAliasAttr]: lastFolloweeAlias,
          },
    }

    return this.getPage(params)
  }

  async getPageFollowers(followeeAlias: string, pageSize: number, lastFollowerAlias: string | undefined): Promise<DataPage<FollowItem>> {
    const params = {
      KeyConditionExpression: this.followeeAliasAttr + " = :followee",
      ExpressionAttributeValues: {
        ":followee": followeeAlias,
      },
      TableName: this.tableName,
      IndexName: this.indexName,
      Limit: pageSize,
      ExclusiveStartKey:
        lastFollowerAlias === undefined
          ? undefined
          : {
            [this.followerAliasAttr]: lastFollowerAlias,
            [this.followeeAliasAttr]: followeeAlias,
          },
    };

    return this.getPage(params)
  }

  private async getPage(params: QueryCommandInput) {
    const items: FollowItem[] = [];
    const data = await this.client.send(new QueryCommand(params));
    const hasMorePages = data.LastEvaluatedKey !== undefined;
    data.Items?.forEach((item) =>
      items.push(
        new FollowItem(
          item[this.followerAliasAttr],
          item[this.followeeAliasAttr],
          item[this.followerNameAttr],
          item[this.followeeNameAttr]
        )
      )
    );

    return new DataPage<FollowItem>(items, hasMorePages);
  }
}