import {Ref, getModelForClass, modelOptions, prop} from '@typegoose/typegoose';
import {Chat} from './chat.model';
import {User} from './user.model';

@modelOptions({schemaOptions: {timestamps: true}})
export class Notification {
  @prop({ref: 'Chat'})
  sender!: Ref<Chat>;

  @prop({ref: 'User'})
  receiver!: Ref<User>;

  @prop({})
  notificationMessage?: string;

  @prop({default: false})
  read?: boolean;
}

const notificationModel = getModelForClass(Notification);
export default notificationModel;
