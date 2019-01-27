export default class SnapchatProfileParseError extends Error {
    message: string;
    parseError: string;
    constructor(message: string, parseError: string);
}
