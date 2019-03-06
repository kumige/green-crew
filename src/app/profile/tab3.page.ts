import { Component } from "@angular/core";
import { MediaProviderPage } from "../media-provider/media-provider.page";
import { NavController } from "@ionic/angular";
import { Profile } from "../interfaces/user";
import { element } from "@angular/core/src/render3";

@Component({
  selector: "app-tab3",
  templateUrl: "tab3.page.html",
  styleUrls: ["tab3.page.scss"]
})
export class Tab3Page {
  constructor(
    public mediaProvider: MediaProviderPage,
    public navCtrl: NavController
  ) {}

  profileArray: Profile = { username: null };
  mediaUrl = "http://media.mw.metropolia.fi/wbma/uploads/";

  ionViewWillEnter() {
    console.log("ionViewWillEnter profile");
    this.getUserData();
  }

  getUserData() {
    this.mediaProvider.getProfileData().subscribe(res => {
      console.log(res);
      this.profileArray = res;

      this.mediaProvider.getProfilePic("profile").subscribe((res2: any[]) => {
        console.log(res2);
        res2.forEach(element => {
          if (element.user_id === this.profileArray.user_id) {
            console.log("element " + element);
            let newUrl = this.mediaUrl + element.filename;
            console.log("newurl " + newUrl);
            this.profileArray.filename = newUrl;
          }
        });
      });
    });
  }

  logout() {
    localStorage.removeItem("token");
    this.mediaProvider.loggedIn = false;
    this.navCtrl.navigateBack("");
  }
}
