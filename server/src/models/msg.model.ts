import {Ref, getModelForClass, modelOptions, prop} from '@typegoose/typegoose';
import {User} from './user.model';
import {Chat} from './chat.model';

@modelOptions({schemaOptions: {timestamps: true}})
export class Message {
  @prop({ref: 'User'})
  sender?: Ref<User>;

  @prop({required: true})
  content!: string;

  @prop({ref: 'Chat'})
  chat?: Ref<Chat>;

  @prop({ref: 'Message'})
  replyingTo?: Ref<Message>;

  @prop({ref: 'User'})
  readBy?: Ref<User>;
}

const messageModel = getModelForClass(Message);
export default messageModel;
