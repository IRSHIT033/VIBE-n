import { Ref } from '@typegoose/typegoose';
import { Chat } from './chat.model';
import { User } from './user.model';
export declare class Notification {
    sender: Ref<Chat>;
    receiver: Ref<User>;
    notificationMessage?: string;
    read?: boolean;
}
declare const notificationModel: import("@typegoose/typegoose").ReturnModelType<typeof Notification, import("@typegoose/typegoose/lib/types").BeAnObject>;
export default notificationModel;
