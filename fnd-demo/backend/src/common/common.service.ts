import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class CommonService {
  constructor(private readonly configService: ConfigService) {}

  /***************************************************************************************
   ** ------------------------------------ Uploads ------------------------------------ **
   ***************************************************************************************/

  /**
   * @description upload file to aws s3
   * @param path_
   * @param file_
   * @returns
   */
  public async awsUploadFile(
    path_: string,
    file_: Express.Multer.File,
  ): Promise<string> {
    try {
      const _path = `demo/${path_}/${Date.now()}_${file_.originalname}`;
      await new AWS.S3()
        .putObject({
          Key: _path,
          Body: file_.buffer,
          Bucket: this.configService.get('awsBucket'),
        })
        .promise();
      return _path;
    } catch (error_: any) {
      throw new ForbiddenException({
        success: false,
        message: [`File upload Failed`],
      });
    }
  }

  /**
   * @description upload buffer to aws s3
   * @param path_
   * @param buffer_
   * @returns
   */
  public async awsUploadBuffer(
    path_: string,
    buffer_: Buffer,
  ): Promise<string> {
    try {
      const _path = `demo/${path_}/${Date.now()}_metadata.json`;
      await new AWS.S3()
        .putObject({
          Key: _path,
          Body: buffer_,
          Bucket: this.configService.get('awsBucket'),
        })
        .promise();
      return _path;
    } catch (error_: any) {
      throw new ForbiddenException({
        success: false,
        message: [`Buffer upload Failed`],
      });
    }
  }
}
