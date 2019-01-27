import { Profile } from 'passport';
export interface BitmojiData {
    avatarId?: string;
    avatarUrl?: string;
}
export interface SnapchatProfile extends Profile {
    bitmoji: BitmojiData;
    provider: 'snapchat';
}
export declare function parse(jsonOrString: string | object): SnapchatProfile;
