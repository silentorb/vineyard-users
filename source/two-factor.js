"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vineyard_lawn_1 = require("vineyard-lawn");
var speakeasy = require("speakeasy");
function get_2fa_token() {
    return function (request) {
        var secret = speakeasy.generateSecret();
        request.session.two_factor_secret = secret.base32;
        return Promise.resolve({
            secret: secret.base32,
            secret_url: secret.otpauth_url
        });
    };
}
exports.get_2fa_token = get_2fa_token;
function verify_2fa_token(secret, token) {
    return speakeasy.totp.verify({
        secret: secret,
        encoding: 'base32',
        token: token
    });
}
exports.verify_2fa_token = verify_2fa_token;
function verify_2fa_request(request) {
    if (typeof request.data.token !== 'string')
        throw new vineyard_lawn_1.Bad_Request("Missing token argument.");
    var two_factor_secret = request.session.two_factor_secret;
    if (!two_factor_secret)
        throw new vineyard_lawn_1.Bad_Request("2FA secret must be generated before verifying a token.");
    if (speakeasy.totp.verify({
        secret: two_factor_secret,
        encoding: 'base32',
        token: request.data.token
    })) {
        delete request.session.two_factor_secret;
        return two_factor_secret;
    }
    throw new vineyard_lawn_1.Bad_Request("Verification failed.");
}
exports.verify_2fa_request = verify_2fa_request;
function verify_2fa_token_handler() {
    return function (request) {
        verify_2fa_request(request);
        return Promise.resolve({
            message: "Verification succeeded."
        });
    };
}
exports.verify_2fa_token_handler = verify_2fa_token_handler;
function verify_token_and_save(user_model) {
    return function (request) {
        var secret = verify_2fa_request(request);
        return user_model.update(request.session.user, {
            two_factor_enabled: true,
            two_factor_secret: request.session.two_factor_secret
        });
    };
}
exports.verify_token_and_save = verify_token_and_save;
function initialize_2fa(app, preprocessor) {
    vineyard_lawn_1.create_endpoints(app, [
        {
            method: vineyard_lawn_1.Method.get,
            path: "user/2fa",
            action: get_2fa_token()
        },
        {
            method: vineyard_lawn_1.Method.post,
            path: "user/2fa",
            action: verify_2fa_token_handler()
        },
    ], preprocessor);
}
exports.initialize_2fa = initialize_2fa;
//# sourceMappingURL=two-factor.js.map