import { UserDataPipe } from "./../pipes/userdata/user-data.pipe";
import { MediaProviderPage } from "./../media-provider/media-provider.page";
import { IPic } from "./../interfaces/file";
import { Component } from "@angular/core";
import { Observable } from "rxjs";
import { NavController } from "@ionic/angular";
import { SingleMediaService } from "../services/single-media.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"]
})
export class Tab1Page {
  picArray: Observable<IPic[]>;
  nameArray: Observable<[]>;
  mediaFilesArray: any[];
  favouritedPostsArray: any = [];
<<<<<<< HEAD
  thumbnail: string;
  picUrl = "http://media.mw.metropolia.fi/wbma/uploads/";
=======
  start = 0;
>>>>>>> 57e9fb865696cc05a4017be543237c297d36733d

  constructor(
    public mediaProvider: MediaProviderPage,
    public navCtrl: NavController,
    public singleMediaService: SingleMediaService,
    public router: Router
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.getFiles();
  }

  getFiles() {
    // Gets all the media
    this.picArray = this.mediaProvider.getFilesByTag("gc", this.start);
    this.picArray.forEach(media => {
      this.mediaFilesArray = media;

      // Sorts the posts by the file_id
      this.mediaFilesArray.sort((a, b) => {
        return b.file_id - a.file_id;
      });

      // Gets profile picture for each post
      media.forEach(mediaDetails => {
        this.mediaProvider.getProfilePic("profile").subscribe((res: any[]) => {
          res.forEach(element => {
            if (element.user_id === mediaDetails.user_id) {
              this.thumbnail = element.filename.split(".");
              this.thumbnail = this.thumbnail[0] + "-tn160.png";
              this.picUrl = "http://media.mw.metropolia.fi/wbma/uploads/";
              this.picUrl += this.thumbnail;
            }
          });
        });

        // Gets the posts that are favourited
        this.mediaProvider.getFavourites().subscribe(res => {
          this.favouritedPostsArray = res;

          // Changes the icon for all the posts that are favourited
          this.favouritedPostsArray.forEach(favourited => {
            if (favourited.file_id === mediaDetails.file_id) {
              mediaDetails.favourited = true;
            }
          });
        });
      });
    });
  }

  uploadClick() {
    this.singleMediaService.setPreviousUrl(this.router.url);
    this.navCtrl.navigateForward("/tabs/upload");
  }

  showSinglePost(item) {
    this.singleMediaService.setPost(item);
    this.navCtrl.navigateForward("/tabs/player");
  }

  // Favourites a post
  favouritePost(item) {
    if (this.mediaProvider.loggedIn) {
      const file = {
        file_id: item.file_id
      };
      item.favourited = true;
      this.mediaProvider.favouriteMedia(file).subscribe(res => {
        console.log(res);
      });
    }
  }

  // Unfavourites a post
  unFavouritePost(item) {
    if (this.mediaProvider.loggedIn) {
      item.favourited = false;
      this.mediaProvider.deleteFavourite(item.file_id).subscribe(res => {
        console.log(res);
      });
    }
  }
}
