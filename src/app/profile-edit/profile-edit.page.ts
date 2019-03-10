import { Component, OnInit } from "@angular/core";
import { MediaProviderPage } from "../media-provider/media-provider.page";
import { Profile, ProfileEdit, EditResponse } from "../interfaces/user";
import { NavController } from "@ionic/angular";
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
    public singleMediaService: SingleMediaService
  ) {}
  profileArray: Profile = { username: null };
  //backgroundImage: string;
  mediaUrl = "http://media.mw.metropolia.fi/wbma/uploads/";
  profileEdit: ProfileEdit = {};

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
    password: new FormControl("", Validators.compose([Validators.minLength(5)]))
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

  navBack() {
    this.navCtrl.navigateBack("tabs/tab3");
    this.editForm.reset();
  }

  // edits the users info
  editInfo() {
    if (
      this.editForm.controls.username.status === "VALID" &&
      this.editForm.controls.email.status === "VALID" &&
      this.editForm.controls.password.status === "VALID"
    ) {
      this.mediaProvider.editProfile(this.profileEdit).subscribe(
        (res: EditResponse) => {
          console.log(res);
          this.editForm.reset();
          this.navCtrl.navigateBack("tabs/tab3");
        },
        error => {
          console.log(error);
        }
      );
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
}
