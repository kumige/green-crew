import { Component } from "@angular/core";
import { MediaProviderPage } from "../media-provider/media-provider.page";
import { NavController } from "@ionic/angular";
import { Profile } from "../interfaces/user";
import { IPic } from "./../interfaces/file";
import { Observable } from "rxjs";

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
  uploadsArray: Observable<IPic[]>;

  ngOnInit() {
    this.getUserData();
    this.getMediaFiles();
  }

  getUserData() {
    this.mediaProvider.getProfileData().subscribe(res => {
      this.profileArray = res;

      this.mediaProvider.getProfilePic("profile").subscribe((res2: any[]) => {
        res2.forEach(element => {
          if (element.user_id === this.profileArray.user_id) {
            let newUrl = this.mediaUrl + element.filename;
            this.profileArray.filename = newUrl;
          }
        });
      });
    });
  }

  getMediaFiles() {
    this.uploadsArray = this.mediaProvider.getUserMedia();
  }

  logout() {
    localStorage.removeItem("token");
    this.mediaProvider.loggedIn = false;
    this.navCtrl.navigateBack("");
  }
}
