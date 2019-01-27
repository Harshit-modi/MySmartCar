export default class SnapchatAPIError extends Error {
    message: string;
    code: string | number;
    constructor(message: string, code: string | number);
}
