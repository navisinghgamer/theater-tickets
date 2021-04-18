import {
  AuthenticationBindings,
  AuthenticationMetadata,
  AuthenticationStrategy,
} from '@loopback/authentication';
import {Getter, inject} from '@loopback/core';
import {HttpErrors, Request} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';

export interface Credentials {
  token: string;
}

export class StaticAuthenticationStrategy implements AuthenticationStrategy {
  name = 'static';

  constructor(
    @inject.getter(AuthenticationBindings.METADATA)
    readonly getMetaData: Getter<AuthenticationMetadata>,
  ) {}

  async authenticate(request: Request): Promise<UserProfile | undefined> {
    const credentials: Credentials = this.extractCredentials(request);

    if (credentials.token !== process.env.AUTH_SEC_TOKEN) {
      throw new HttpErrors.Unauthorized('Provided access token is invalid.');
    }

    const user = {
      [securityId]: credentials.token,
      email: process.env.PROFILE_EMAIL,
      name: process.env.PROFILE_NAME,
    };

    return user;
  }

  extractCredentials(request: Request): Credentials {
    if (!request.headers.authorization) {
      throw new HttpErrors.Unauthorized(`Authorization header not found.`);
    }

    const authHeaderValue = request.headers.authorization;

    const creds: Credentials = {
      token: authHeaderValue,
    };

    return creds;
  }
}
