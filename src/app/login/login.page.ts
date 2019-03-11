import { Component, OnInit } from "@angular/core";
import { MediaProviderPage } from "../media-provider/media-provider.page";
import {
  User,
  UserCheck,
  LoginResponse,
  RegisterResponse
} from "../interfaces/user";
import {
  Validators,
  FormGroup,
  FormControl,
  ValidatorFn,
  ValidationErrors
} from "@angular/forms";
import { AlertController, NavController } from "@ionic/angular";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"]
})
export class LoginPage implements OnInit {
  user: User = { username: null };
  registering: Boolean = false;
  re_password: string;
  samePassword: Boolean;

  constructor(
    public mediaProvider: MediaProviderPage,
    public alertController: AlertController,
    public router: Router,
    public navCtrl: NavController
  ) {}

  ionViewWillEnter() {}

  ngOnInit() {}

  // Resets the forms
  resetForms() {
    this.user.username = null;
    this.user.password = null;
    this.registerForm.reset();
  }

  // Switch the template between registering and logging in
  switchTemplate() {
    this.resetForms();
    this.registering = !this.registering;
  }

  // Checks if the both passwords are the same
  passwordCheck() {
    if (this.user.password === this.re_password) {
      return (this.samePassword = true);
    } else {
      return (this.samePassword = false);
    }
  }

  // Creates register form
  registerForm = new FormGroup({
    username: new FormControl(
      "",
      Validators.compose([Validators.required, Validators.minLength(3)])
    ),
    password: new FormControl(
      "",
      Validators.compose([Validators.required, Validators.minLength(5)])
    ),
    re_password: new FormControl(""),
    full_name: new FormControl(""),
    email: new FormControl(
      "",
      Validators.compose([Validators.required, Validators.email])
    )
  });

  // Logs the user in
  login = () => {
    this.mediaProvider.login(this.user).subscribe(
      (res: LoginResponse) => {
        console.log(res);
        if (!this.mediaProvider.loggedIn) {
          this.mediaProvider.loggedIn = true;
          localStorage.setItem("token", res.token);
          this.registering = false;
          this.registerForm.reset();
          this.navCtrl.navigateForward("");
        } else {
          this.navCtrl.navigateForward("");
        }
      },
      error => {
        console.log(error);
        this.presentAlert("Invalid password or username");
      }
    );
  };

  // Checks if every field is valid before registering the user
  register = () => {
    console.log(this.registerForm.status);
    console.log(this.registerForm);
    if (
      this.registerForm.controls.email.status === "VALID" &&
      this.registerForm.controls.username.status === "VALID"
    ) {
      if (this.user.password === this.re_password) {
        if (this.registering && this.registerForm.status === "VALID") {
          this.mediaProvider.userCheck(this.user).subscribe(
            (res: UserCheck) => {
              console.log("register");
              if (res.available) {
                this.registerPost();
              } else {
                this.presentAlert("Username already taken");
              }
            },
            error => {
              console.log(error);
            }
          );
        }
      } else {
        this.presentAlert("Passwords did not match");
      }
    }
  };

  // Registers the user
  registerPost() {
    this.mediaProvider.register(this.user).subscribe(
      (res: RegisterResponse) => {
        console.log("registered");
        this.login();
      },
      error => {
        console.log(error);
      }
    );
  }

  // Presents alert
  async presentAlert(alertMsg: string) {
    const alert = await this.alertController.create({
      message: alertMsg,
      buttons: ["OK"]
    });

    await alert.present();
  }

  // Checks if the username is already in use
  usernameCheck() {
    const username = document.getElementById("userLabel");
    if (this.user.username === "") {
      this.user.username = undefined;
    }

    if (this.registering) {
      this.mediaProvider.userCheck(this.user.username).subscribe(res => {
        if (
          !res.available &&
          this.registerForm.controls.username.status !== "INVALID"
        ) {
          username.innerHTML = "Username already taken";
        } else {
          username.innerHTML = null;
        }
      });
    }
  }
}
