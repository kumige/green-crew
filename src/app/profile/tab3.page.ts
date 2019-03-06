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
  allFiles: any = [];

  ngOnInit() {
    this.getUserData();
    // this.getMediaFiles();
  }

  // Gets the users data (profile picture, username etc.) and the users uploaded posts
  getUserData() {
    //Gets the profile picture and username
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

      // Gets the users uploaded posts
      this.uploadsArray = this.mediaProvider.getFilesByTag("gc");

      this.uploadsArray.forEach(element => {
        element.forEach(element2 => {
          if (element2.user_id !== this.profileArray.user_id) {
            element.splice(0, 1);
            console.log(element);

            // Sorts the file by the file_id (gets the newest picture on top)
            element.sort(function(a, b) {
              return b.file_id - a.file_id;
            });

            this.allFiles = element;
          }
        });
      });
    });
  }

  // Logs out and clears the storage
  logout() {
    localStorage.removeItem("token");
    this.mediaProvider.loggedIn = false;
    this.navCtrl.navigateBack("");
  }
}
