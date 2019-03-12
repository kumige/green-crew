import { Component, OnInit } from "@angular/core";
import { MediaProviderPage } from "../media-provider/media-provider.page";
import { Profile, ProfileEdit, EditResponse } from "../interfaces/user";
import { NavController, AlertController } from "@ionic/angular";
import { SingleMediaService } from "../services/single-media.service";
import { Validators, FormGroup, FormControl } from "@angular/forms";
import { Chooser } from "@ionic-native/chooser/ngx";

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
    public alertController: AlertController,
    public chooser: Chooser
  ) {}

  profileArray: Profile = { username: null };
  //backgroundImage: string;
  mediaUrl = "http://media.mw.metropolia.fi/wbma/uploads/";
  profileEdit: ProfileEdit = {};
  profileUpdated: Boolean = false;
  samePassword: Boolean = true;
  re_password: string;
  fileBlob: Blob;
  pfpChanged: Boolean = false;
  fileData: string;
  profilePicUrl: string;

  ngOnInit() {}

  // on enter gets the data and if data is undefined it navigates back
  ionViewWillEnter() {
    // this.getProfileBackground();
    this.usernameCheck();
    this.getUserData();
    if (this.profileArray == undefined) {
      this.navCtrl.navigateBack("tabs/tab3");
    }
  }

  ionViewWillLeave() {
    this.formReset();
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

  // Gets the user data (profilepicture, username etc)
  getUserData() {
    this.profilePicUrl = this.singleMediaService.getProfilePictureUrl();
    this.profileArray = this.singleMediaService.getProfileData();
  }

  // Navigates back to profile page and resets the form
  navBack() {
    this.navCtrl.navigateBack("tabs/tab3");
    this.formReset();
    document.getElementById("editUserNameError").innerHTML = null;
  }

  formReset() {
    this.pfpChanged = false;
    this.fileBlob = null;
    this.profileEdit.username = undefined;
    this.profileEdit.email = undefined;
    this.profileEdit.password = undefined;
    this.re_password = undefined;
  }

  // edits the users info and if new password has been inserted, checks if the passwords match
  editInfo() {
    this.notEmptyField();
    if (
      this.editForm.controls.username.status === "VALID" &&
      this.editForm.controls.email.status === "VALID" &&
      this.editForm.controls.password.status === "VALID"
    ) {
      if (this.samePassword === true) {
        if (this.pfpChanged === false) {
          console.log(this.profileEdit);
          this.mediaProvider.editProfile(this.profileEdit).subscribe(
            (res: EditResponse) => {
              console.log(res);
              this.profileUpdated = true;
              this.singleMediaService.setProfileUpdated(this.profileUpdated);
              this.formReset();
              this.navCtrl.navigateBack("tabs/tab3");
            },
            error => {
              console.log(error);
            }
          );
        }
        if (this.pfpChanged === true) {
          this.mediaProvider.editProfile(this.profileEdit).subscribe(
            (res: EditResponse) => {
              console.log(res);
            },
            error => {
              console.log(error);
            }
          );
          this.changePfp();
          this.profileUpdated = true;
          this.singleMediaService.setProfileUpdated(this.profileUpdated);
          setTimeout(() => {
            this.formReset();
            this.navCtrl.navigateBack("tabs/tab3");
          }, 1000);
        }
      } else {
        this.presentAlert("Passwords do not match");
      }
    }
  }

  notEmptyField() {
    if (this.profileEdit.username === "") {
      this.profileEdit.username = undefined;
    }
    if (this.profileEdit.email === "") {
      this.profileEdit.email = undefined;
    }
    if (this.profileEdit.password === "") {
      this.profileEdit.password = undefined;
    }
    if (this.re_password === "") {
      this.re_password = undefined;
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
    if (this.profileEdit.password === "") {
      this.profileEdit.password = undefined;
    }
    if (this.re_password === "") {
      this.re_password = undefined;
    }
    if (this.profileEdit.password === this.re_password) {
      return (this.samePassword = true);
    } else {
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

  // Adds "profile" tag for the new profilepicture
  addFilterTag(fileId) {
    const tag = {
      file_id: fileId,
      tag: "profile"
    };
    this.mediaProvider.addTag(tag).subscribe(res => {
      console.log("tagChange");
      console.log(res);
    });
  }

  // Chooses a file for new profilepicture
  chooseFile() {
    this.chooser
      .getFile("image/*,video/mp4")
      .then(file => {
        if (file) {
          console.log(file);
          this.fileBlob = new Blob([file.data], { type: file.mediaType });
          this.pfpChanged = true;
          this.showPreview();
        }
      })
      .catch((error: any) => console.error(error));
  }

  // Changes the profilepicture
  changePfp() {
    const fd = new FormData();
    fd.append("file", this.fileBlob);
    fd.append("title", "pfp");
    this.mediaProvider.upload(fd).subscribe((res: any) => {
      console.log("upload res");
      console.log(res);
      this.addFilterTag(res.file_id);
    });
  }

  // Show preview of the new profile picture
  showPreview() {
    const reader = new FileReader();
    reader.onloadend = evt => {
      this.fileData = reader.result.toString();
    };
    reader.readAsDataURL(this.fileBlob);
  }
}
