import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DbDaoInterface } from "./DaoInterfaces";
import { Command } from "@smithy/smithy-client";

export abstract class DynamoDbDao<DTO, KEY> implements DbDaoInterface<DTO, KEY> {
  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient())

  protected constructor(readonly tableName: string) {
  }

  private async executeQuery(command: Command<any, any, any>) {
    try {
      return await this.client.send(command)
    } catch (e) {
      throw new Error('internal-server-error: ' + e)
    }
  }

  async createItem(item: DTO) {
    const key = this.getKey(item)
    const dbItem: DTO | undefined = await this.retrieveItem(key)
    if (dbItem) {
      throw new Error(`bad-request: ${ JSON.stringify(key) } already exists`)
    }

    const params = {
      TableName: this.tableName,
      Item: this.getRowData(item)
    }

    await this.executeQuery(new PutCommand(params))
  }

  async retrieveItem(key: KEY): Promise<DTO | undefined> {
    const params = {
      TableName: this.tableName,
      Key: key
    }
    const output = await this.executeQuery(new GetCommand(params))

    return !output || !output.Item
      ? undefined
      : this.convertToDto(output.Item)
  }

  async updateItem(item: DTO): Promise<void> {
    const key = this.getKey(item);
    const existing = await this.retrieveItem(key);

    if (!existing) {
      throw new Error(`bad-request: ${ JSON.stringify(key) } not found`);
    }

    await this.executeQuery(new PutCommand({
      TableName: this.tableName,
      Item: this.getRowData(item),
    }));
  }

  async deleteItem(key: KEY) {
    const params = {
      TableName: this.tableName,
      Key: key
    }
    await this.executeQuery(new DeleteCommand(params))
  }

  protected abstract convertToDto(itemRecord: Record<string, any>): DTO

  protected abstract getRowData(dto: DTO): Record<string, any>

  protected abstract getKey(dto: DTO): KEY
}