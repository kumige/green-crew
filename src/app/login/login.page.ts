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

  ngOnInit() {}

  switchTemplate() {
    this.user.username = null;
    this.user.password = null;
    this.registerForm.reset();
    this.registering = !this.registering;
  }

  passwordCheck() {
    if (this.user.password === this.re_password) {
      return (this.samePassword = true);
    } else {
      return (this.samePassword = false);
    }
  }

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

  login = () => {
    this.mediaProvider.login(this.user).subscribe(
      (res: LoginResponse) => {
        console.log("login res:" + res);
        if (!this.mediaProvider.loggedIn) {
          this.mediaProvider.loggedIn = true;
          localStorage.setItem("token", res.token);
          this.navCtrl.navigateForward("");
        } else {
          this.navCtrl.navigateForward("");
        }
      },
      error => {
        console.log(error);
      }
    );
    this.registerForm.reset();
  };

  register = () => {
    console.log(this.registerForm.status);
    console.log(this.registerForm);
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
  };

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

  async presentAlert(alertMsg: string) {
    const alert = await this.alertController.create({
      message: alertMsg,
      buttons: ["OK"]
    });

    await alert.present();
  }

  blur() {
    const username = document.getElementById("userLabel");

    if (this.registering) {
      this.mediaProvider.userCheck(this.user).subscribe(res => {
        console.log(res);
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
