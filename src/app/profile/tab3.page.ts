import { Component } from "@angular/core";
import { MediaProviderPage } from "../media-provider/media-provider.page";
import { NavController, PopoverController } from "@ionic/angular";
import { Profile } from "../interfaces/user";
import { IPic } from "./../interfaces/file";
import { Observable } from "rxjs";
import { ProfilePopoverComponent } from "../profile-popover/profile-popover.component";
import { SingleMediaService } from "../services/single-media.service";

@Component({
  selector: "app-tab3",
  templateUrl: "tab3.page.html",
  styleUrls: ["tab3.page.scss"]
})
export class Tab3Page {
  constructor(
    public mediaProvider: MediaProviderPage,
    public navCtrl: NavController,
    public popoverController: PopoverController,
    public singleMediaService: SingleMediaService
  ) {}

  profileArray: Profile = { username: null };
  mediaUrl = "http://media.mw.metropolia.fi/wbma/uploads/";
  uploadsArray: Observable<IPic[]>;
  allFiles: any = [];
  favourites: boolean = false;
  buttonColor: string;
  buttonColor2: string = "#E9E9E9";

  // Background images
  images = [
    "../../../assets/Gc-Background1.jpg",
    "../../../assets/Gc-Background2.jpg",
    "../../../assets/Gc-Background3.jpg",
    "../../../assets/Gc-Background4.jpg",
    "../../../assets/Gc-Background5.jpg",
    "../../../assets/Gc-Background6.jpg"
  ];

  ionViewWillEnter() {
    this.allFiles = [];
    this.getUserData();
    this.randomImage();
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
          if (element2.user_id === this.profileArray.user_id) {
            //console.log(element2);
            this.allFiles.push(element2);

            // Sorts the file by the file_id (gets the newest picture on top)
            this.allFiles.sort(function(a, b) {
              return b.file_id - a.file_id;
            });

            console.log(this.allFiles);
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

  // Gets a random image for a background
  randomImage() {
    let randomValue = this.images[
      Math.floor(this.images.length * Math.random())
    ];
    console.log(randomValue);
    document.getElementById("backgroundImage").setAttribute("src", randomValue);
  }

  // Opens a post
  showSinglePost(item) {
    this.singleMediaService.setPost(item);
    this.navCtrl.navigateForward("/tabs/player");
  }

  // Presents popover
  async presentPopover(event) {
    const popover = await this.popoverController.create({
      component: ProfilePopoverComponent,
      event
    });
    return await popover.present();
  }

  // Changes the buttons colors and status (which posts to show)
  profilesUploads() {
    if (this.favourites) {
      this.buttonColor = "#f4f4f4";
      this.buttonColor2 = "#E9E9E9";
      this.favourites = false;
    }
  }

  favouritesUploads() {
    if (!this.favourites) {
      this.buttonColor = "#E9E9E9";
      this.buttonColor2 = "#f4f4f4";
      this.favourites = true;
    }
  }
}
