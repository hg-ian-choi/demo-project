// editions/editions.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/product.entity';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { Edition } from './edition.entity';

@Injectable()
export class EditionsService {
  constructor(
    @InjectRepository(Edition)
    private readonly editionRepository: Repository<Edition>,
  ) {}

  public async create(owner_: User, product_: Product) {
    const _edition = this.editionRepository.create({
      owner: { id: owner_.id },
      product: { id: product_.id },
    });
    return _edition;
  }
}
