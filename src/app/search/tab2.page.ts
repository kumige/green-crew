import { IPic } from "./../interfaces/file";
import { MediaProviderPage } from "./../media-provider/media-provider.page";
import { Component } from "@angular/core";
import { Observable } from "rxjs";
import { NavController } from "@ionic/angular";
import { SingleMediaService } from "../services/single-media.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-tab2",
  templateUrl: "tab2.page.html",
  styleUrls: ["tab2.page.scss"]
})
export class Tab2Page {
  searchTerm = "";
  postArray: any = [];
  favouritedPostsArray: any = [];

  start = 0;
  thumbnail: string;

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
        this.mediaProvider
          .getFilesByTag("gc", this.start)
          .subscribe(tagPosts => {
            this.mediaProvider
              .getProfilePic("profile")
              .subscribe((profileTagPosts: any) => {
                for (let i = 0; i < tagPosts.length; i++) {
                  const description = JSON.parse(tagPosts[i].description);
                  description.ingredient.forEach(ingredient => {
                    // Check for matching ingredients and food names
                    if (
                      ingredient.name === this.searchTerm ||
                      description.name === this.searchTerm ||
                      ingredient.name.toLowerCase() === this.searchTerm ||
                      description.name.toLowerCase() === this.searchTerm
                    ) {
                      if (!this.postExists(tagPosts[i])) {
                        let profilePicUrl;

                        // Get the posts profile picture
                        for (let n = profileTagPosts.length - 1; n >= 0; n--) {
                          console.log(
                            profileTagPosts[n].user_id,
                            tagPosts[i].user_id
                          );

                          if (
                            profileTagPosts[n].user_id === tagPosts[i].user_id
                          ) {
                            this.thumbnail = profileTagPosts[n].filename.split(
                              "."
                            );
                            this.thumbnail = this.thumbnail[0] + "-tn160.png";
                            profilePicUrl =
                              "http://media.mw.metropolia.fi/wbma/uploads/";
                            tagPosts[i].profilePicUrl =
                              profilePicUrl + this.thumbnail;
                            break;
                          } else {
                            tagPosts[i].profilePicUrl =
                              "../../assets/Gc-Pfp.png";
                          }
                        }

                        this.mediaProvider.getFavourites().subscribe(res => {
                          this.favouritedPostsArray = res;

                          // Changes the icon for all the posts that are favourited
                          this.favouritedPostsArray.forEach(favourited => {
                            if (favourited.file_id === tagPosts[i].file_id) {
                              tagPosts[i].favourited = true;
                            }
                          });
                        });

                        // Adds a post to the post array
                        this.postArray.push(tagPosts[i]);
                        this.postArray.sort((a, b) => {
                          return b.file_id - a.file_id;
                        });
                      }
                    }
                  });
                }
              });
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
