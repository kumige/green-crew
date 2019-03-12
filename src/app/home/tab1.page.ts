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
  start = 0;

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
      this.mediaFilesArray.sort(function(a, b) {
        return b.file_id - a.file_id;
      });

      media.forEach(mediaDetails => {
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
