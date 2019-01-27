import OAuth2Strategy from 'passport-oauth2';
import { SnapchatProfile } from './profile';
interface SnapchatStrategyOptions {
    authorizationURL?: string;
    callbackURL: string;
    clientID: string;
    clientSecret: string;
    passReqToCallback?: boolean;
    profileFields?: string[];
    profileURL?: string;
    scope?: string | string[];
    scopeSeparator?: string;
    tokenURL?: string;
}
export default class Strategy extends OAuth2Strategy {
    name: string;
    _clientSecret: string | undefined;
    _scope: string[];
    private profileFields;
    private profileURL;
    constructor(options: SnapchatStrategyOptions, verify: OAuth2Strategy.VerifyFunction);
    userProfile(accessToken: string, done: (err: Error | null, snapchatProfile?: SnapchatProfile) => void): void;
}
export {};
