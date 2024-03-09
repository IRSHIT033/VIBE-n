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
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFromGroup = exports.addToGroup = exports.renameGroup = exports.creatGroupChat = exports.getChats = exports.accessChat = void 0;
var asyncHandler = require("express-async-handler");
var chat_model_js_1 = require("../models/chat.model.js");
var user_model_js_1 = require("../models/user.model.js");
exports.accessChat = asyncHandler(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, chat_exist, chat_data, createChat, Allchat, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = req.body.userId;
                if (!userId) {
                    res.sendStatus(400);
                }
                return [4 /*yield*/, chat_model_js_1.default.find({
                        isGroupChat: false,
                        $and: [
                            { users: { $elemMatch: { $eq: req.user._id } } },
                            { users: { $elemMatch: { $eq: userId } } },
                        ],
                    })
                        .populate('users', '-password')
                        .populate('latestMessage')
                        .populate('latestMessage.sender', 'name pic email')
                        .exec()];
            case 1:
                chat_exist = _a.sent();
                if (!(chat_exist.length > 0)) return [3 /*break*/, 2];
                res.send(chat_exist[0]);
                return [3 /*break*/, 7];
            case 2:
                chat_data = {
                    chatName: 'sender',
                    isGroupChat: false,
                    users: [req.user._id, userId],
                };
                _a.label = 3;
            case 3:
                _a.trys.push([3, 6, , 7]);
                return [4 /*yield*/, chat_model_js_1.default.create(chat_data)];
            case 4:
                createChat = _a.sent();
                return [4 /*yield*/, chat_model_js_1.default.findOne({ _id: createChat._id }).populate('users', '-password')];
            case 5:
                Allchat = _a.sent();
                res.status(200).send(Allchat);
                return [3 /*break*/, 7];
            case 6:
                err_1 = _a.sent();
                res.status(400);
                throw new Error(err_1.message);
            case 7: return [2 /*return*/];
        }
    });
}); });
exports.getChats = asyncHandler(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var chat, results, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, chat_model_js_1.default.find({
                        users: { $elemMatch: { $eq: req.user._id } },
                    })
                        .populate('users', '-password')
                        .populate('groupAdmin', '-password')
                        .populate('latestMessage')
                        .sort({ updatedAt: -1 })
                        .exec()];
            case 1:
                chat = _a.sent();
                return [4 /*yield*/, user_model_js_1.default.populate(chat, {
                        path: 'latestMessage.sender',
                        select: 'name pic email',
                    })];
            case 2:
                results = _a.sent();
                res.status(200).send(results);
                return [3 /*break*/, 4];
            case 3:
                err_2 = _a.sent();
                res.status(400);
                throw new Error(err_2.message);
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.creatGroupChat = asyncHandler(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var users, groupChat, fullGroupChat, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.body.users || !req.body.name) {
                    res.status(400).send({ message: 'Please Fill all the fields' });
                }
                users = JSON.parse(req.body.users);
                if (users.length < 2) {
                    res.status(400).send('More than 2 users are required to form a group chat');
                }
                users.push(req.user);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, chat_model_js_1.default.create({
                        chatName: req.body.name,
                        users: users,
                        isGroupChat: true,
                        groupAdmin: req.user,
                    })];
            case 2:
                groupChat = _a.sent();
                return [4 /*yield*/, chat_model_js_1.default.findOne({ _id: groupChat._id })
                        .populate('users', '-password')
                        .populate('groupAdmin', '-password')];
            case 3:
                fullGroupChat = _a.sent();
                res.status(200).json(fullGroupChat);
                return [3 /*break*/, 5];
            case 4:
                err_3 = _a.sent();
                res.status(400);
                throw new Error(err_3.message);
            case 5: return [2 /*return*/];
        }
    });
}); });
exports.renameGroup = asyncHandler(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, chatId, chatName, updateChat;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, chatId = _a.chatId, chatName = _a.chatName;
                return [4 /*yield*/, chat_model_js_1.default.findByIdAndUpdate(chatId, {
                        chatName: chatName,
                    }, {
                        new: true,
                    })
                        .populate('users', '-password')
                        .populate('groupAdmin', '-password')];
            case 1:
                updateChat = _b.sent();
                if (!updateChat) {
                    res.send(404);
                    throw new Error('Chat Not Found');
                }
                else {
                    res.json(updateChat);
                }
                return [2 /*return*/];
        }
    });
}); });
exports.addToGroup = asyncHandler(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, chatId, userId, add;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, chatId = _a.chatId, userId = _a.userId;
                return [4 /*yield*/, chat_model_js_1.default.findByIdAndUpdate(chatId, {
                        $push: { users: userId },
                    }, {
                        new: true,
                    })
                        .populate('users', '-password')
                        .populate('groupAdmin', '-password')];
            case 1:
                add = _b.sent();
                if (!add) {
                    res.status(404);
                    throw new Error('Chat Not Found');
                }
                else {
                    res.json(add);
                }
                return [2 /*return*/];
        }
    });
}); });
exports.removeFromGroup = asyncHandler(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, chatId, userId, rem;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, chatId = _a.chatId, userId = _a.userId;
                return [4 /*yield*/, chat_model_js_1.default.findByIdAndUpdate(chatId, {
                        $pull: { users: userId },
                    }, {
                        new: true,
                    })
                        .populate('users', '-password')
                        .populate('groupAdmin', '-password')];
            case 1:
                rem = _b.sent();
                if (!rem) {
                    res.status(404);
                    throw new Error('Chat Not Found');
                }
                else {
                    res.json(rem);
                }
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=chatController.js.map