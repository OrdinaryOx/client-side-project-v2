import { Injectable, NotFoundException } from '@nestjs/common';
import { IUser, UserRole } from '@client-side-project/shared/api';

import { BehaviorSubject } from 'rxjs';
import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User as UserModel, UserDocument } from './schema/user.schema';

@Injectable()
export class UserService {
    TAG = 'UserService';
   
    constructor(
        @InjectModel(UserModel.name) private userModel: Model<UserDocument> // @InjectModel(Meal.name) private meetupModel: Model<MealDocument>
    ) {}

    // private Users$ = new BehaviorSubject<IUser[]>([
    //     {
    //         _id: '0',
    //         name: 'John Smith',
    //         email: 'j.smith@mail.com',
    //         password: 'Secret123'
    //     },
    //     {
    //         _id: '1',
    //         name: 'Katie Smith',
    //         email: 'k.smith@mail.com',
    //         password: 'Secret123'
    //     },
    //     {
    //         _id: '2',
    //         name: 'Michael Johnson',
    //         email: 'm.johnson@mail.com',
    //         password: 'Secret123'
    //     },
    //     {
    //         _id: '3',
    //         name: 'Emily Davis',
    //         email: 'e.davis@mail.com',
    //         password: 'Secret123'
    //     },
    //     {
    //         _id: '4',
    //         name: 'Daniel Wilson',
    //         email: 'd.wilson@mail.com',
    //         password: 'Secret123'
    //     },
    //     {
    //         _id: '5',
    //         name: 'Sophia Thompson',
    //         email: 's.thompson@mail.com',
    //         password: 'Secret123'
    //     }
    // ]);

    // //non database
    // getAll(): IUser[] {
    //     Logger.log('getAll', this.TAG);
    //     return this.Users$.value;
    // }
    
    //database
    async findAll(): Promise<IUser[]> {
        const items = await this.userModel.find().sort({ name: 1 });
        return items;
    }

    //non database
    // getOne(id: string): IUser {
    //     Logger.log(`getOne(${id})`, this.TAG);
    //     const User = this.Users$.value.find((td) => td.id === id);
    //     if (!User) {
    //         throw new NotFoundException(`User could not be found!`);
    //     }
    //     return User;
    // }

    //database
    // async getOne(id: string): Promise<IUser> {
    //     // this.logger.log(`Finding one item with id: ${id}`);
    //     const item = await this.userModel.findOne({ _id });
    //     if (!item) {
    //         throw new NotFoundException(`Item with id: ${id} not found`);
    //     }
    //     return item;
    // }

    async getOne(_id: string): Promise<IUser> {
        Logger.log(`getOne(${_id})`, this.TAG);
        const user = await this.userModel.findOne({ _id }).exec();
        if (!user) {
            throw new NotFoundException(`User not found!`);
        }
        return user;
    }

    /**
     * Update the arg signature to match the DTO, but keep the
     * return signature - we still want to respond with the complete
     * object
     */
    async create(user: Pick<IUser, 'name' | 'email' | 'password'>): Promise<IUser> {
        Logger.log('create', this.TAG);
        var id = new mongoose.Types.ObjectId();
        console.log();
        
        const newUser: IUser = {
            ...user,
            _id: id.toString(), 
            hasGallery: false,
            role: UserRole.User,
            friends: [],
        };

        Logger.log(newUser, "newUser")
        
        const createdUser = await this.userModel.create(newUser);
        return createdUser;
    }
    


    //todo: double check if this is correct
    async delete(id: string): Promise<void> {
        Logger.log(`delete(${id})`, this.TAG);
        const gallery = await this.userModel.findOne({ _id: id }).exec();
        if (!gallery) {
            throw new NotFoundException(`Gallery could not be found!`);
        }
        await this.userModel.deleteOne({ _id: id }).exec();
    }

    

    

      
     //todo: double check if this is correct
    async update(id: string, user: Partial<IUser>): Promise<IUser> {
        Logger.log(`update(${id})`, this.TAG);
        const updatedUser = await this.userModel.findOneAndUpdate({ _id: id }, user, { new: true }).exec();
        if (!updatedUser) {
            throw new NotFoundException(`User could not be found!`);
        }
        return updatedUser;
    }

    
}
