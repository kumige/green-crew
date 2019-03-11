import { Component } from "@angular/core";
import { MediaProviderPage } from "../media-provider/media-provider.page";
import {
  NavController,
  PopoverController,
  AlertController
} from "@ionic/angular";
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
    public singleMediaService: SingleMediaService,
    public alertController: AlertController
  ) {}

  profileArray: Profile = { username: null };
  mediaUrl = "http://media.mw.metropolia.fi/wbma/uploads/";
  uploadsArray: Observable<IPic[]>;
  allFiles: any = [];
  randomPicture: string;
  favouritesTab: boolean = false;
  buttonColor: string;
  buttonColor2: string = "#E9E9E9";
  profileUpdated: Boolean = false;
  allFavouritedPosts: any = [];
  arrayOfFavourites: any = [];
  arrayOfMedia: Observable<IPic[]>;

  // Background images
  images = [
    "../../../assets/Gc-Background1.jpg",
    //"../../../assets/Gc-Background2.jpg",
    "../../../assets/Gc-Background3.jpg",
    "../../../assets/Gc-Background4.jpg",
    //"../../../assets/Gc-Background5.jpg",
    "../../../assets/Gc-Background6.jpg"
  ];

  ionViewWillEnter() {
    this.buttonColor = "#f4f4f4";
    this.buttonColor2 = "#E9E9E9";
    this.favouritesTab = false;
    this.getUserData();
    this.randomImage();
    this.allFiles = [];
    this.profileUpdatedAlert();
  }

  reset() {
    this.allFiles = [];
    this.allFavouritedPosts = [];
    this.arrayOfFavourites = [];
    this.uploadsArray = null;
    this.profileArray = { username: null };
  }

  // Gets the users data (profile picture, username etc.) and the users uploaded posts
  getUserData() {
    this.reset();

    //Gets the profile picture and username
    this.mediaProvider.getProfileData().subscribe(res => {
      this.profileArray = res;

      this.mediaProvider.getProfilePic("profile").subscribe((res2: any[]) => {
        res2.forEach(picture => {
          if (picture.user_id === this.profileArray.user_id) {
            let newUrl = this.mediaUrl + picture.filename;
            this.profileArray.filename = newUrl;
          }
        });
      });
      // sets the profileArray in the single media service
      this.singleMediaService.setProfileData(this.profileArray);
      this.singleMediaService.setProfileBackground(this.randomPicture);

      // Gets the users uploaded posts ( with forEach we get the information we need )
      this.uploadsArray = this.mediaProvider.getFilesByTag("gc");

      this.uploadsArray.forEach(element => {
        element.forEach(media => {
          if (media.user_id === this.profileArray.user_id) {
            //console.log(element2);
            this.allFiles.push(media);

            // Sorts the file by the file_id (gets the newest picture on top)
            this.allFiles.sort(function(a, b) {
              return b.file_id - a.file_id;
            });

            // Changes the icon for all the posts that are favourited
            this.mediaProvider.getFavourites().subscribe(res => {
              this.allFavouritedPosts = res;
              //console.log(this.allFavouritedPosts);
              this.allFavouritedPosts.forEach(favourited => {
                if (favourited.file_id === media.file_id) {
                  media.favourited = true;
                }
              });
            });
            //console.log(this.allFiles);
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
    this.randomPicture = this.images[
      Math.floor(this.images.length * Math.random())
    ];
    console.log(this.randomPicture);
    document
      .getElementById("backgroundImage")
      .setAttribute("src", this.randomPicture);
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
    if (this.favouritesTab) {
      this.buttonColor = "#f4f4f4";
      this.buttonColor2 = "#E9E9E9";
      this.getUserData();
      this.favouritesTab = false;
    }
  }
  profilesFavourites() {
    if (!this.favouritesTab) {
      this.buttonColor = "#E9E9E9";
      this.buttonColor2 = "#f4f4f4";
      this.getFavoritedMedia();
      this.favouritesTab = true;
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

  // Alerts the user if the profile info was updated successfully
  profileUpdatedAlert() {
    if (this.singleMediaService.getProfileUpdated()) {
      this.presentAlert("Profile was edited successfully");
      this.singleMediaService.setProfileUpdated(this.profileUpdated);
    }
  }

  // Favourites a post
  favouritePost(item) {
    const file = {
      file_id: item.file_id
    };
    item.favourited = true;
    this.mediaProvider.favouriteMedia(file).subscribe(res => {
      console.log(res);
    });
  }

  // Unfavourites a post
  unFavouritePost(item) {
    item.favourited = false;
    this.mediaProvider.deleteFavourite(item.file_id).subscribe(res => {
      console.log(res);
    });
  }

  // Gets all the posts that the user has favourited
  getFavoritedMedia() {
    let favorites: any = [];

    // Gets all the media ( with forEach we get the information we need )
    this.arrayOfMedia = this.mediaProvider.getFilesByTag("gc");
    this.arrayOfMedia.forEach(media => {
      media.forEach(mediaDetails => {
        // Gets the posts that are favourited
        this.mediaProvider.getFavourites().subscribe(res => {
          favorites = res;

          // Changed the icon for all the posts that are favourited
          favorites.forEach(favourited => {
            if (favourited.file_id === mediaDetails.file_id) {
              // console.log(favourited);
              mediaDetails.favourited = true;
              // console.log(mediaDetails);
              this.arrayOfFavourites.push(mediaDetails);
              this.arrayOfFavourites.sort(function(a, b) {
                return b.file_id - a.file_id;
              });
            }
          });
        });
      });
    });
  }
}
