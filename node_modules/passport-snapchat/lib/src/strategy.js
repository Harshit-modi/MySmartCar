"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var passport_oauth2_1 = __importStar(require("passport-oauth2"));
var profile_1 = require("./profile");
var url_1 = __importDefault(require("url"));
var config_1 = __importDefault(require("./config"));
var SnapchatAPIError_1 = __importDefault(require("./errors/SnapchatAPIError"));
var SnapchatProfileParseError_1 = __importDefault(require("./errors/SnapchatProfileParseError"));
var Strategy = (function (_super) {
    __extends(Strategy, _super);
    function Strategy(options, verify) {
        var _this = _super.call(this, normalizeOptions(options), verify) || this;
        _this.name = 'snapchat';
        var _a = normalizeOptions(options), clientSecret = _a.clientSecret, profileURL = _a.profileURL, profileFields = _a.profileFields, scope = _a.scope;
        _this._clientSecret = clientSecret;
        _this._scope = scope;
        _this.profileURL = profileURL;
        _this.profileFields = profileFields;
        _this._oauth2._useAuthorizationHeaderForGET = true;
        return _this;
    }
    Strategy.prototype.userProfile = function (accessToken, done) {
        var parsedUri = url_1.default.parse(this.profileURL);
        var query = "query=" + encodeURIComponent("{me{" + this.profileFields.join(' ') + "}}");
        parsedUri.search = parsedUri.search
            ? parsedUri.search + "&" + query
            : query;
        var url = url_1.default.format(parsedUri);
        this._oauth2.get(url, accessToken, function (err, body, _res) {
            var json;
            if (err) {
                if (err.data) {
                    try {
                        json = JSON.parse(err.data);
                    }
                    catch (_) { }
                }
                if (json && json.error && json.error_description) {
                    return done(new SnapchatAPIError_1.default(json.error_description, json.error));
                }
                else if (err.data && err.statusCode) {
                    return done(new SnapchatAPIError_1.default(err.data, err.statusCode));
                }
                return done(new passport_oauth2_1.InternalOAuthError('Failed to fetch user profile', err));
            }
            try {
                json = JSON.parse(body);
            }
            catch (e) {
                return done(new SnapchatProfileParseError_1.default("Failed to parse user profile with error: " + e.message, e));
            }
            var _a = json.data, _b = (_a === void 0 ? {} : _a).me, profileJson = _b === void 0 ? {} : _b;
            var profile = profile_1.parse(profileJson);
            profile._raw = body;
            profile._json = json;
            done(null, profile);
        });
    };
    return Strategy;
}(passport_oauth2_1.default));
exports.default = Strategy;
var fieldsToGraphField = {
    bitmoji: 'bitmoji{avatar id}',
    displayName: 'displayName',
    id: 'externalId',
};
function getGraphFieldForNormalizedFieldName(field) {
    return fieldsToGraphField[field] || field;
}
function normalizeScope(scope) {
    return scope.startsWith('https:')
        ? scope
        : config_1.default.OAUTH_SCOPE_URL_PREFIX + scope;
}
function normalizeOptions(options) {
    if (options === void 0) { options = {}; }
    var scopeSeparator = options.scopeSeparator || ' ';
    var scopesStringOrArray = options.scope || [];
    var scopes = typeof scopesStringOrArray === 'string'
        ? scopesStringOrArray.split(scopeSeparator)
        : scopesStringOrArray;
    var profileFields = options.profileFields || [];
    return __assign({}, options, { authorizationURL: options.authorizationURL || config_1.default.SNAP_ACCOUNTS_AUTH_URL, profileFields: profileFields
            .map(getGraphFieldForNormalizedFieldName)
            .filter(Boolean), profileURL: options.profileURL || config_1.default.SNAP_KIT_API_URL + "/me", scope: scopes.map(normalizeScope).filter(Boolean), scopeSeparator: scopeSeparator, tokenURL: options.tokenURL || config_1.default.SNAP_ACCOUNTS_TOKEN_URL });
}
//# sourceMappingURL=strategy.js.map