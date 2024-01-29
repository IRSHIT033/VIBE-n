import {
  Ref,
  getModelForClass,
  index, modelOptions,
  pre,
  prop,
} from '@typegoose/typegoose';
import { User } from './user.model';

@modelOptions
  ({ schemaOptions: { timestamps: true } })

export class Message {
  @prop({ ref: () => User })
  sender?: Ref<User>

  @prop({ required: true, })
  content!: string

  @prop({ ref: () => User })
  chat?: Ref<User>

  @prop({ ref: () => Message })
  replyingTo?: Ref<Message>

  @prop({ ref: () => User })
  readBy?: Ref<User>
}

const messageModel = getModelForClass(Message)
export default messageModel;
