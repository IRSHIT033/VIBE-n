import { Ref } from '@typegoose/typegoose';
import { User } from './user.model';
export declare class Message {
    sender?: Ref<User>;
    content: string;
    chat?: Ref<User>;
    replyingTo?: Ref<Message>;
    readBy?: Ref<User>;
}
declare const messageModel: import("@typegoose/typegoose").ReturnModelType<typeof Message, import("@typegoose/typegoose/lib/types").BeAnObject>;
export default messageModel;
