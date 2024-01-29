import * as bcrypt from "bcrypt";
import {
  getModelForClass,
  index, modelOptions,
  pre,
  prop,
} from '@typegoose/typegoose';


@index({ email: 1 })
@pre<User>("save", async function (next) {
  // Hash password if the password is new or was updated
  if (!this.isModified('password')) return;
  // Hash password with costFactor of 12
  this.password = await bcrypt.hash(this.password, 12);

})

@modelOptions
  ({ schemaOptions: { timestamps: true } })

export class User {
  @prop({ required: true })
  name!: string;

  @prop({ unique: true, required: true })
  email!: string;

  @prop({ required: true, minlength: 8, maxLength: 32, select: false })
  password!: string;

  @prop({ required: true, default: "https://api-private.atlassian.com/users/8b3597e8a7d1d8f2ed7f58bcab1946b8/avatar" })
  pic!: string;

  @prop({ required: true, default: false })
  isAdmin!: boolean;

  @prop({ required: true })
  refreshToken!: string[]

  async comparePasswords(hashPassword: string) {
    return await bcrypt.compare(hashPassword, this.password);
  };
}





const userModel = getModelForClass(User)
export default userModel
