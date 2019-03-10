import { Component, OnInit } from "@angular/core";
import { MediaProviderPage } from "../media-provider/media-provider.page";
import { Profile, ProfileEdit, EditResponse } from "../interfaces/user";
import { NavController, AlertController } from "@ionic/angular";
import { SingleMediaService } from "../services/single-media.service";
import { Validators, FormGroup, FormControl } from "@angular/forms";

@Component({
  selector: "app-profile-edit",
  templateUrl: "./profile-edit.page.html",
  styleUrls: ["./profile-edit.page.scss"]
})
export class ProfileEditPage implements OnInit {
  constructor(
    public mediaProvider: MediaProviderPage,
    public navCtrl: NavController,
    public singleMediaService: SingleMediaService,
    public alertController: AlertController
  ) {}
  profileArray: Profile = { username: null };
  //backgroundImage: string;
  mediaUrl = "http://media.mw.metropolia.fi/wbma/uploads/";
  profileEdit: ProfileEdit = {};
  profileUpdated: Boolean = false;
  samePassword: Boolean = true;
  re_password: string;

  // on enter gets the data and if data is undefined it navigates back
  ionViewWillEnter() {
    // this.getProfileBackground();
    this.getUserData();
    if (this.profileArray == undefined) {
      this.navCtrl.navigateBack("tabs/tab3");
    }
  }

  // Create the formgroup
  editForm = new FormGroup({
    username: new FormControl(
      "",
      Validators.compose([Validators.minLength(3)])
    ),
    email: new FormControl("", Validators.compose([Validators.email])),
    password: new FormControl(
      "",
      Validators.compose([Validators.minLength(5)])
    ),
    re_password: new FormControl("")
  });

  ngOnInit() {}

  // Gets the user data (profilepicture, username etc)
  getUserData() {
    this.profileArray = this.singleMediaService.getProfileData();
  }

  /*getProfileBackground() {
    this.backgroundImage = this.singleMediaService.getProfileBackground();
    console.log(this.backgroundImage);
    document.getElementById("backgroundImage").setAttribute("src", "");
    document
      .getElementById("backgroundImage")
      .setAttribute("src", this.backgroundImage);
  }*/

  // Navigates back to profile page and resets the form
  navBack() {
    this.navCtrl.navigateBack("tabs/tab3");
    this.editForm.reset();
    document.getElementById("editUserNameError").innerHTML = null;
  }

  // edits the users info and if new password has been inserted, checks if the passwords match
  editInfo() {
    if (
      this.editForm.controls.username.status === "VALID" &&
      this.editForm.controls.email.status === "VALID" &&
      this.editForm.controls.password.status === "VALID"
    ) {
      if (this.samePassword === true) {
        this.mediaProvider.editProfile(this.profileEdit).subscribe(
          (res: EditResponse) => {
            console.log(res);
            this.profileUpdated = true;
            this.singleMediaService.setProfileUpdated(this.profileUpdated);
            this.editForm.reset();
            this.navCtrl.navigateBack("tabs/tab3");
          },
          error => {
            console.log(error);
          }
        );
      } else {
        this.presentAlert("Passwords do not match");
      }
    }
  }

  // Checks if the username is already in use
  usernameCheck() {
    const username = document.getElementById("editUserNameError");
    if (this.profileEdit.username === "") {
      this.profileEdit.username = undefined;
    }

    this.mediaProvider.userCheck(this.profileEdit.username).subscribe(res => {
      if (
        !res.available &&
        this.editForm.controls.username.status !== "INVALID" &&
        this.profileArray.username !== this.profileEdit.username
      ) {
        username.innerHTML = "Username already taken";
      } else {
        username.innerHTML = null;
      }
    });
  }

  // Checks if the passwords match
  passwordCheck() {
    //console.log(this.profileEdit.password);
    //console.log(this.re_password);
    if (this.profileEdit.password === "") {
      this.profileEdit.password = undefined;
    }
    if (this.re_password === "") {
      this.re_password = undefined;
    }
    if (this.profileEdit.password === this.re_password) {
      console.log("same");
      return (this.samePassword = true);
    } else {
      console.log("not same");
      return (this.samePassword = false);
    }
  }

  // Presents alert
  async presentAlert(alertMsg: string) {
    const alert = await this.alertController.create({
      message: alertMsg,
      buttons: ["OK"]
    });

    await alert.present();
  }
}
