import {
  Ref,
  getModelForClass,
  modelOptions,
  prop,
} from '@typegoose/typegoose';
import { User } from "./user.model";
import { Message } from './msg.model';


@modelOptions
  ({ schemaOptions: { timestamps: true } })

export class Chat {
  @prop({ trim: true })
  chatName?: string;

  @prop({ default: false })
  isGroupChat?: boolean;

  @prop({ ref: () => User })
  users?: Ref<User>[]

  @prop({ ref: () => Message })
  latestMessage?: Ref<Message>

  @prop({ ref: () => User })
  groupAdmin?: Ref<User>
}
const chatModel = getModelForClass(Chat)
export default chatModel;
