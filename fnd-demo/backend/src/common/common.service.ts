import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import * as fs from 'fs';

@Injectable()
export class CommonService {
  constructor(private readonly configService: ConfigService) {}

  /*******************************************************************************************
   ** ------------------------------------ File Upload ------------------------------------ **
   *******************************************************************************************/
  /**
   * @description upload local file to aws s3
   * @param src_
   * @param path_
   * @param mime_
   */
  async awsUploadLocal(src_: string, path_: string, mime_: string) {
    try {
      const file = fs.readFileSync(src_);
      await new AWS.S3()
        .putObject({
          Key: path_,
          Body: file,
          Bucket: this.configService.get('awsBucket'),
          ContentType: mime_,
        })
        .promise();
    } catch (error_: any) {
      throw new ForbiddenException(error_);
    }
  }
}
