import { Ref } from '@typegoose/typegoose';
import { User } from './user.model';
import { Message } from './msg.model';
export declare class Chat {
    chatName?: string;
    isGroupChat?: boolean;
    users?: Ref<User>[];
    latestMessage?: Ref<Message>;
    groupAdmin?: Ref<User>;
}
declare const chatModel: import("@typegoose/typegoose").ReturnModelType<typeof Chat, import("@typegoose/typegoose/lib/types").BeAnObject>;
export default chatModel;
