"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
var typegoose_1 = require("@typegoose/typegoose");
var user_model_1 = require("./user.model");
var Message = /** @class */ (function () {
    function Message() {
    }
    __decorate([
        (0, typegoose_1.prop)({ ref: function () { return user_model_1.User; } })
    ], Message.prototype, "sender", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: true })
    ], Message.prototype, "content", void 0);
    __decorate([
        (0, typegoose_1.prop)({ ref: function () { return user_model_1.User; } })
    ], Message.prototype, "chat", void 0);
    __decorate([
        (0, typegoose_1.prop)({ ref: function () { return Message; } })
    ], Message.prototype, "replyingTo", void 0);
    __decorate([
        (0, typegoose_1.prop)({ ref: function () { return user_model_1.User; } })
    ], Message.prototype, "readBy", void 0);
    Message = __decorate([
        (0, typegoose_1.modelOptions)({ schemaOptions: { timestamps: true } })
    ], Message);
    return Message;
}());
exports.Message = Message;
var messageModel = (0, typegoose_1.getModelForClass)(Message);
exports.default = messageModel;
//# sourceMappingURL=msg.model.js.map