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
  searchTerm: string;
  postArray: any = [];

  constructor(
    public mediaProvider: MediaProviderPage,
    public navCtrl: NavController,
    public singleMediaService: SingleMediaService,
    public router: Router
  ) {}

  search() {
    console.log(this.postArray);
    //clear previous search results
    this.postArray.forEach(element => {
      this.postArray.pop();
    });
    if (this.searchTerm != null) {
      return new Promise((resolve, reject) => {
        this.mediaProvider.getFilesByTag("gc").subscribe(res => {
          for (let i = 0; i < res.length; i++) {
            const description = JSON.parse(res[i].description);
            description.ingredient.forEach(ingredient => {
              if (
                ingredient.name === this.searchTerm ||
                description.name === this.searchTerm
              ) {
                if (!this.postExists(res[i])) {
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
}
