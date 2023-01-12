// auth/guards/wallet-auth.guard.ts

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class WalletAuthGuard extends AuthGuard('wallet') {}
