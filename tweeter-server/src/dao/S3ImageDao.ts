import { ImageDaoInterface } from "./DaoInterfaces";

import {
  S3Client,
  PutObjectCommand, ObjectCannedACL
} from "@aws-sdk/client-s3";

interface ImageDto {
  readonly imageStringBase64: string
  readonly imageKey: string
}

export class S3ImageDao implements ImageDaoInterface {
  private s3 = new S3Client()
  private readonly bucketName = 'cs-340-tweeter-profile-images-bucket'
  private readonly region = 'us-west-2'

  async createImage(imageStringBase64: string, fileName: string) {
    const buff = Buffer.from(imageStringBase64, 'base64')

    const s3Params = {
      Bucket: this.bucketName,
      Key: `image/${fileName}`,
      Body: buff,
      ContentType: 'image/png'
    }

    try {
      await this.s3.send(new PutObjectCommand(s3Params))
    } catch (e) {
      throw Error('internal-server-error: failed to create s3 image with: ' + e)
    }
  }

  getImageUrl(fileName: string): string {
    return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/image/${fileName}`
  }
}