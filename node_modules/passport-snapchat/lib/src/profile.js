"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function parse(jsonOrString) {
    var jsonProfile = jsonOrString;
    if (typeof jsonOrString === 'string') {
        jsonProfile = JSON.parse(jsonOrString);
    }
    var _a = jsonProfile.bitmoji, bitmoji = _a === void 0 ? {} : _a, displayName = jsonProfile.displayName, externalId = jsonProfile.externalId;
    return {
        provider: 'snapchat',
        displayName: displayName,
        id: externalId,
        bitmoji: {
            avatarId: bitmoji.id,
            avatarUrl: bitmoji.avatar,
        },
    };
}
exports.parse = parse;
//# sourceMappingURL=profile.js.map