import { IPic } from "./../interfaces/file";
import { MediaProviderPage } from "./../media-provider/media-provider.page";
import { Component } from "@angular/core";
import { Observable } from "rxjs";
import { NavController } from "@ionic/angular";
import { SingleMediaService } from "../services/single-media.service";
import { isDeepStrictEqual } from "util";
import { Router } from "@angular/router";

@Component({
  selector: "app-tab2",
  templateUrl: "tab2.page.html",
  styleUrls: ["tab2.page.scss"]
})
export class Tab2Page {
  searchTerm = "";
  postArray: any = [];
  start = 0;
  thumbnail: string;
  picUrl = "";

  constructor(
    public mediaProvider: MediaProviderPage,
    public navCtrl: NavController,
    public singleMediaService: SingleMediaService,
    public router: Router
  ) {}

  search() {
    //clear previous search results
    this.postArray.forEach(element => {
      this.postArray.pop();
    });
    if (this.searchTerm != null) {
      return new Promise((resolve, reject) => {
        this.mediaProvider.getFilesByTag("gc", this.start).subscribe(res => {
          for (let i = 0; i < res.length; i++) {
            const description = JSON.parse(res[i].description);
            description.ingredient.forEach(ingredient => {
              if (
                ingredient.name === this.searchTerm ||
                description.name === this.searchTerm ||
                ingredient.name.toLowerCase() === this.searchTerm ||
                description.name.toLowerCase() === this.searchTerm
              ) {
                if (!this.postExists(res[i])) {
                  console.log(res[i]);
                  this.mediaProvider
                    .getProfilePic("profile")
                    .subscribe((res2: any[]) => {
                      res2.forEach(element => {
                        if (element.user_id === res[i].user_id) {
                          this.thumbnail = element.filename.split(".");
                          this.thumbnail = this.thumbnail[0] + "-tn160.png";
                          this.picUrl =
                            "http://media.mw.metropolia.fi/wbma/uploads/";
                          this.picUrl += this.thumbnail;
                        }
                      });
                    });
                  this.postArray.push(res[i]);
                }
              }
            });
          }
          resolve(this.postArray);
        });
      });
    }
  }

  //Check for duplicate posts in postArray
  postExists(post) {
    let exists = false;
    this.postArray.forEach(element => {
      if (element.file_id === post.file_id) {
        exists = true;
      }
    });
    return exists;
  }

  showSinglePost(item) {
    this.singleMediaService.setPost(item);
    this.singleMediaService.setPreviousUrl(this.router.url);
    this.navCtrl.navigateForward("/tabs/player");
  }

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
