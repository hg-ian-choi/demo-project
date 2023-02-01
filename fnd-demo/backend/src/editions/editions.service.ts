// editions/editions.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Edition } from './edition.entity';

@Injectable()
export class EditionsService {
  constructor(
    @InjectRepository(Edition)
    private readonly editionRepository: Repository<Edition>,
  ) {}

  /**
   * @description create Edition object
   * @param user_
   * @returns Edition
   */
  public createEdition(edition_: Edition): Edition {
    return this._create(edition_);
  }

  /**
   * @description create Edition object
   * @param edition_
   * @returns Edition
   */
  private _create(edition_: Edition): Edition {
    return this.editionRepository.create(edition_);
  }
}
