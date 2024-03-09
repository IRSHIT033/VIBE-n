import * as bcrypt from 'bcrypt';
import {
  getModelForClass,
  index,
  modelOptions,
  pre,
  prop,
} from '@typegoose/typegoose';

@index({email: 1})
@pre<User>('save', async function (next) {
  try {
    if (this.isModified('password') || this.isNew) {
      const saltRound = +process.env.SALTROUNDS!
      const salt = await bcrypt.genSalt(saltRound);
      this.password = await bcrypt.hash(this.password, salt);
      return next();
    }
  } catch (e) {
    return next();
  }
})
@modelOptions({schemaOptions: {timestamps: true}})
export class User {
  @prop()
  public name?: string;

  @prop({unique: true, required: true})
  public email!: string;

  @prop({required: true, minlength: 8, maxLength: 100})
  public password!: string;

  @prop({
    required: true,
    default:
      'https://api-private.atlassian.com/users/8b3597e8a7d1d8f2ed7f58bcab1946b8/avatar',
  })
  public pic!: string;

  @prop({required: true, default: false})
  public isAdmin!: boolean;

  @prop({required: true, type: () => [String], default: []})
  public refreshToken!: string[];

  async comparePasswords(hashPassword: string) {
    return await bcrypt.compare(hashPassword, this.password);
  }
}

const userModel = getModelForClass(User);
export default userModel;
