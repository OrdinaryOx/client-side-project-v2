import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
// import { v4 as uuid } from 'uuid';
import isEmail from 'validator/lib/isEmail';
import {
    IUser, UserRole,
} from '@client-side-project/shared/api';
import { IsMongoId } from 'class-validator';

export type UserDocument = User & Document;

@Schema()
export class User implements IUser {
    @IsMongoId()
    _id!: string;

    @Prop({
        required: true,
        type: String
    })
    name!: string;


    
    @Prop({
        required: true,
        select: true, 
        type: String
    })
    password = '';

     
    @Prop({
        required: true,
        type: Boolean,
        default: false
    })
    hasGallery!: boolean;

    @Prop({
        required: true,
        type: String,
        select: true,
        unique: true
        // validate: {
        //     validator: isEmail,
        //     message: 'should be a valid email address'
        // }
    })
    email = '';

    @Prop({
        required: false,
        select: true,
        default: 'https://cdn-icons-png.flaticon.com/512/219/219969.png'
    })
    profilePicture!: string;

    @Prop({
        required: false,
        type: String,
        default: UserRole.User
    })
    role: UserRole = UserRole.User;


    
@Prop({
    required: true,
    type: [ MongooseSchema.Types.ObjectId],
    ref: 'User' 
})
friends!: IUser[];

   
    
    //token?: string | undefined;  
}

export const UserSchema = SchemaFactory.createForClass(User);


