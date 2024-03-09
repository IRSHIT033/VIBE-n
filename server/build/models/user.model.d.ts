export declare class User {
    name?: string;
    email: string;
    password: string;
    pic: string;
    isAdmin: boolean;
    refreshToken: string[];
    comparePasswords(hashPassword: string): Promise<boolean>;
}
declare const userModel: import("@typegoose/typegoose").ReturnModelType<typeof User, import("@typegoose/typegoose/lib/types").BeAnObject>;
export default userModel;
