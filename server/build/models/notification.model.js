"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
var typegoose_1 = require("@typegoose/typegoose");
var chat_model_1 = require("./chat.model");
var user_model_1 = require("./user.model");
var Notification = /** @class */ (function () {
    function Notification() {
    }
    __decorate([
        (0, typegoose_1.prop)({ ref: function () { return chat_model_1.Chat; } })
    ], Notification.prototype, "sender", void 0);
    __decorate([
        (0, typegoose_1.prop)({ ref: function () { return user_model_1.User; } })
    ], Notification.prototype, "receiver", void 0);
    __decorate([
        (0, typegoose_1.prop)({})
    ], Notification.prototype, "notificationMessage", void 0);
    __decorate([
        (0, typegoose_1.prop)({ default: false })
    ], Notification.prototype, "read", void 0);
    Notification = __decorate([
        (0, typegoose_1.modelOptions)({ schemaOptions: { timestamps: true } })
    ], Notification);
    return Notification;
}());
exports.Notification = Notification;
var notificationModel = (0, typegoose_1.getModelForClass)(Notification);
exports.default = notificationModel;
//# sourceMappingURL=notification.model.js.map