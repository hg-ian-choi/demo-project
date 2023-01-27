import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class CommonService {
  constructor(private readonly configService: ConfigService) {}

  /*******************************************************************************************
   ** ------------------------------------ File Upload ------------------------------------ **
   *******************************************************************************************/
  /*

  /**
   * @description upload buffer file to aws s3
   * @param _path
   * @param _file
   * @returns
   */
  async awsUpload(path_: string, file_: Express.Multer.File): Promise<string> {
    try {
      const path = `demo/${path_}/${Date.now()}_${file_.originalname}`;
      await new AWS.S3()
        .putObject({
          Key: path,
          Body: file_.buffer,
          Bucket: this.configService.get('awsBucket'),
        })
        .promise();
      return path;
    } catch (error_: any) {
      throw new ForbiddenException({
        success: false,
        message: [`File upload Failed`],
      });
    }
  }
}
