"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var asyncHandler = require("express-async-handler");
var user_model_js_1 = require("../models/user.model.js");
var handleLogin = asyncHandler(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var cookies, _a, email, password, foundUser, match, accessToken, newRefreshToken, newRefreshTokenArray, loggedInUser;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                cookies = req.cookies;
                _a = req.body, email = _a.email, password = _a.password;
                if (!email || !password)
                    res.status(400).json({ message: 'email and password are required.' });
                return [4 /*yield*/, user_model_js_1.default.findOne({ email: email }).exec()];
            case 1:
                foundUser = _b.sent();
                if (!!foundUser) return [3 /*break*/, 2];
                res.sendStatus(401); //Unauthorized
                return [3 /*break*/, 6];
            case 2: return [4 /*yield*/, bcrypt.compare(password, foundUser.password)];
            case 3:
                match = _b.sent();
                if (!match) return [3 /*break*/, 5];
                accessToken = jwt.sign({
                    UserInfo: {
                        email: foundUser.email,
                    },
                }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY_TIME });
                newRefreshToken = jwt.sign({ email: foundUser.email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY_TIME });
                newRefreshTokenArray = !(cookies === null || cookies === void 0 ? void 0 : cookies.jwt)
                    ? foundUser.refreshToken
                    : foundUser.refreshToken.filter(function (rt) { return rt !== cookies.jwt; });
                if (cookies === null || cookies === void 0 ? void 0 : cookies.jwt) {
                    res.clearCookie('jwt', {
                        httpOnly: true,
                        sameSite: 'none',
                        secure: true,
                    });
                }
                foundUser.refreshToken = __spreadArray(__spreadArray([], newRefreshTokenArray, true), [newRefreshToken], false);
                return [4 /*yield*/, foundUser.save()];
            case 4:
                loggedInUser = _b.sent();
                // Creates Secure Cookie with refresh token
                res.cookie('jwt', newRefreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                    maxAge: 24 * 60 * 60 * 1000,
                });
                // Send access token to user
                res.json({
                    accessToken: accessToken,
                    _id: foundUser._id,
                    name: foundUser.name,
                    email: foundUser.email,
                    pic: foundUser.pic,
                });
                return [3 /*break*/, 6];
            case 5:
                res.sendStatus(401);
                _b.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}); });
exports.default = handleLogin;
//# sourceMappingURL=authController.js.map