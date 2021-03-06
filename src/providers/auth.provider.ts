import { Injectable } from '@nestjs/common';

import { IEmailPassword } from '../interfaces/emailpassword';
import { IEncrypt } from '../interfaces/encrypt';
import { IAuthProvider, IUserProvider } from '../interfaces/provider';

@Injectable()
export class AuthUserProvider<T extends IEmailPassword> implements IAuthProvider<T> {
    constructor(
        private readonly providerName: string,
        private readonly userProvider: IUserProvider<T>,
        private readonly encryptor: IEncrypt
    ) {}

    getName(): string {
        return this.providerName;
    }

    async loadUser(data: { password: string; [key: string]: any }): Promise<T | undefined> {
        const query: any = { ...data };
        delete query.password;
        const entity = await this.userProvider.findOne(query);
        if (entity === undefined) {
            return;
        }
        if (typeof data.password === 'string') {
            const encrypted = this.encryptor.encrypt(data.password);
            if (encrypted !== entity.passwordEncrypted) {
                return;
            }
        }
        return entity;
    }
}
