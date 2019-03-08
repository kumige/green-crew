import { Component, OnInit } from "@angular/core";
import { MediaProviderPage } from "../media-provider/media-provider.page";
import { Profile } from "../interfaces/user";
import { NavController } from "@ionic/angular";
import { SingleMediaService } from "../services/single-media.service";

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
  backgroundImage: string;
  mediaUrl = "http://media.mw.metropolia.fi/wbma/uploads/";

  ionViewWillEnter() {
    this.getProfileBackground();
    this.getUserData();
    if (this.profileArray == undefined) {
      this.navCtrl.navigateBack("");
    }
  }

  ngOnInit() {}

  getUserData() {
    this.profileArray = this.singleMediaService.getProfileData();
  }

  getProfileBackground() {
    this.backgroundImage = this.singleMediaService.getProfileBackground();
    console.log(this.backgroundImage);
    document.getElementById("backgroundImage").setAttribute("src", "");
    document
      .getElementById("backgroundImage")
      .setAttribute("src", this.backgroundImage);
  }

  navBack() {
    this.navCtrl.navigateBack("");
  }
}
