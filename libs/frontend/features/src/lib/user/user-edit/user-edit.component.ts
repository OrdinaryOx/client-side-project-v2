import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IUser, UserRole } from '@client-side-project/shared/api';
import { UserService } from '../user.service';
import { AuthService } from '@client-side-project/backend/auth';
import { Types } from 'mongoose';

import { IUserCredentials } from '@client-side-project/shared/api';

@Component({
  selector: 'client-side-project-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
})
export class UserEditComponent implements OnInit {
  name = '';
  email = '';
  password = '';
  profilePicture = '';
  isEditing = false; // Add a flag to track if editing or creating
  isLogin = false;

  loginFailed = false;


  constructor(
    private route: ActivatedRoute,

    private userService: UserService,
    private router: Router
  ) {}

  private user!: IUser;

  ngOnInit() {
    const userId = this.route.snapshot.paramMap.get('id');
    const login = window.location.href.includes('login');

    if (login) {
      this.isLogin = true;
    }

    if (userId) {
      this.isEditing = true;
      this.userService.read(userId).subscribe((user: IUser) => {
        this.user = user;
        this.name = user.name;
        this.email = user.email;
        this.password = user.password;
        this.profilePicture = user.profilePicture ?? '';
      });
    }
  }

  saveUser() {
    console.log('Save user clicked', 'tag');
    if (this.isEditing) {
      this.updateUser();
    } else if (this.isLogin) {
      this.login();
    } else {
      this.createUser();
    }
  }

  updateUser() {
    console.log('updating user clicked in user-edit.component.ts', 'TAG');

    const updatedUser: IUser = {
      _id: this.user._id,
      name: this.name,
      email: this.email,
      password: this.user.password,
      profilePicture: this.profilePicture,
      hasGallery: this.user.hasGallery,
      role: this.user.role,
      friends: this.user.friends,
    };
    this.userService.updateUser(updatedUser).subscribe(() => {
      this.router.navigate(['/user/' + this.user._id]);
    });
  }

  login() {
    console.log('logging in user clicked in user-edit.component.ts', 'TAG');
    const loginCred: IUserCredentials = {
      emailAddress: this.email,
      password: this.password,
    };

    localStorage.removeItem('user');

    this.userService.login(loginCred).subscribe(
      (user: IUser | null) => {
        if (user) {
          console.log(user, 'USER');
          //todo: this
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('token', user.token!);
          // this.router.navigate(['/user']);
          window.location.href = '/';
        } else {
          this.loginFailed = true;
          console.log('Login failed');
        }
      },
      (error) => {
        console.log('Unauthorized');
      }
    );
  }

  createUser() {
    console.log('creating user clicked in user-edit.component.ts', 'TAG');
    const newUser: IUser = {
      name: this.name,
      email: this.email,
      password: this.password,
      profilePicture: this.profilePicture,
      _id: new Types.ObjectId().toString(),
      hasGallery: false,
      role: UserRole.User,
      friends: []
    };
    this.userService.register(newUser).subscribe(() => {
      this.router.navigate(['/home']);
    });
  }
}
//     const userId = this.route.snapshot.paramMap.get('id');
//     console.log(userId, "ID");
//     this.userService.read(userId).subscribe((user: IUser) => {
//       this.name = user.name;
//       this.email = user.email;
//     });
//   }

//   updateUser() {
//     const userId = this.route.snapshot.paramMap.get('id');
//     console.log(userId, "ID");
//     this.userService.read(userId).subscribe((user: IUser) => {
//       const updatedUser: IUser = {
//         id: user.id,
//         name: this.name,
//         email: this.email,
//         password: user.password
//       };
//       this.userService.updateUser(updatedUser);

// console.log("Finished Update", "TAG");
//       this.router.navigate(['/user']);
//       console.log("Navigated", "TAG");
//     });
//   }
//}
