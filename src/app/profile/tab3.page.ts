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
  allFiles: any = [];
  randomPicture: string;
  favouritesTab: boolean = false;
  buttonColor: string;
  buttonColor2: string = "#E9E9E9";
  profileUpdated: Boolean = false;
  allFavouritedPosts: any = [];
  arrayOfFavourites: any = [];
  arrayOfMedia: Observable<IPic[]>;
  thumbnail: string;
  picUrl;
  usersProfilePicUrl: string;
  showNoUploadsMsg;
  showNoFavoutitesMsg;
  start = 0;
  favouriteArray: any = [];
  favouritedPosts: any = [];

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
    this.getUserData();
    this.getProfilePicture();
    this.showNoUploadsMsg = 0;
    this.showNoFavoutitesMsg = 0;
    this.usersProfilePicUrl = "";
    this.buttonColor = "#f4f4f4";
    this.buttonColor2 = "#E9E9E9";
    this.favouritesTab = false;
    this.randomImage();
    this.profileUpdatedAlert();
    this.mediaProvider.getFavourites().subscribe(res => {
      this.favouriteArray = res;
      console.log(this.favouriteArray);
    });
  }

  // Resets the arrays and variables
  reset() {
    this.allFiles = [];
    this.allFavouritedPosts = [];
    this.arrayOfFavourites = [];
    this.profileArray = { username: null };
  }

  //Gets the profile pictures
  getProfilePicture() {
    // Gets the users profile picture
    this.mediaProvider.getProfileData().subscribe(res => {
      this.profileArray = res;

      this.mediaProvider.getProfilePic("profile").subscribe((res2: any[]) => {
        res2.forEach(picture => {
          if (picture.user_id === this.profileArray.user_id) {
            let newUrl = this.mediaUrl + picture.filename;
            this.usersProfilePicUrl = newUrl;
          }
          this.singleMediaService.setProfilePictureUrl(this.usersProfilePicUrl);

          // If there is no profile picture, sets a default profile pic
          if (this.usersProfilePicUrl === "") {
            this.usersProfilePicUrl = "../../assets/Gc-Pfp.png";
            this.singleMediaService.setProfilePictureUrl(
              this.usersProfilePicUrl
            );
          }
        });
      });
    });
  }

  // Gets the users data (profile picture, username etc.) and the users uploaded posts
  getUserData() {
    this.reset();
    this.getProfilePicture();
    let uploadsArray = [];

    this.mediaProvider.getProfileData().subscribe(res => {
      this.profileArray = res;

      // sets the profileArray in the single media service
      this.singleMediaService.setProfileData(this.profileArray);
      this.singleMediaService.setProfileBackground(this.randomPicture);

      // Gets all the posts with "gc" tag and with foreach we get the info we need to get the posts that are posted by the user
      this.mediaProvider.getFilesByTag("gc", this.start).subscribe(res => {
        uploadsArray = res;
        uploadsArray.forEach(usersMedia => {
          if (usersMedia.user_id === this.profileArray.user_id) {
            this.allFiles.push(usersMedia);
            this.showNoUploadsMsg = this.allFiles.length;

            // Sorts the posts by the file_id (gets the newest picture on top)
            this.allFiles.sort((a, b) => {
              return b.file_id - a.file_id;
            });

            // Changes the icon for all the posts that are favourited
            // Gets all the favourited posts
            this.mediaProvider.getFavourites().subscribe(res => {
              this.allFavouritedPosts = res;

              // Checks which posts are favourited by the user and changes the icon
              this.allFavouritedPosts.forEach(favourited => {
                if (favourited.file_id === usersMedia.file_id) {
                  usersMedia.favourited = true;
                }
              });
            });
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

  // Gets all the posts that the user has favourited and their profilepictures
  getFavoritedMedia() {
    let favouritedPostsArray;

    // Gets all the media
    this.mediaProvider.getFilesByTag("gc", this.start).subscribe(tagPosts => {
      this.mediaProvider
        .getProfilePic("profile")
        .subscribe((profileTagPosts: any) => {
          tagPosts.forEach(singlePost => {
            let profilePicUrl;

            // Gets profile pictures
            for (let i = profileTagPosts.length - 1; i >= 0; i--) {
              if (profileTagPosts[i].user_id === singlePost.user_id) {
                this.thumbnail = profileTagPosts[i].filename.split(".");
                this.thumbnail = this.thumbnail[0] + "-tn160.png";
                profilePicUrl = "http://media.mw.metropolia.fi/wbma/uploads/";
                singlePost.profilePicUrl = profilePicUrl + this.thumbnail;
                break;
              } else {
                singlePost.profilePicUrl = "../../assets/Gc-Pfp.png";
              }
            }

            // Get the media that are favourited
            this.mediaProvider.getFavourites().subscribe(res => {
              favouritedPostsArray = res;

              // Changes the icon for all the posts that are favourited
              favouritedPostsArray.forEach(favourited => {
                if (favourited.file_id === singlePost.file_id) {
                  this.arrayOfFavourites.push(singlePost);
                  singlePost.favourited = true;

                  this.showNoFavoutitesMsg = this.arrayOfFavourites.length;
                }
                this.arrayOfFavourites.sort((a, b) => {
                  return b.file_id - a.file_id;
                });
              });
            });
          });
        });
    });
  }
}
