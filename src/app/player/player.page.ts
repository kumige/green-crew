import { Profile } from "./../interfaces/user";
import { MediaProviderPage } from "./../media-provider/media-provider.page";
import { SingleMediaService } from "./../services/single-media.service";
import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
import { IDesc } from "../interfaces/file";

@Component({
  selector: "app-player",
  templateUrl: "./player.page.html",
  styleUrls: ["./player.page.scss"]
})
export class PlayerPage implements OnInit {
  postData;
  description: IDesc;
  picUrl = "http://media.mw.metropolia.fi/wbma/uploads/";
  user: Profile;
  thumbnail: string;
  videoContent = false;
  audioContent = false;
  imageContent = false;

  constructor(
    public singleMediaService: SingleMediaService,
    public mediaProvider: MediaProviderPage,
    public navCtrl: NavController
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.getPost();
    this.getProfilePic();
  }

  getPost() {
    this.postData = this.singleMediaService.getPost();
    this.description = this.singleMediaService.getDescription();
    //console.log(this.description);
  }

  getFilters() {
    return null;
  }

  navBack() {
    this.navCtrl.navigateBack("");
  }

  getImg() {
    return this.picUrl;
  }

  getProfilePic() {
    this.mediaProvider.getProfilePic("profile").subscribe((res: any[]) => {
      res.forEach(element => {
        if (element.user_id === this.postData.user_id) {
          this.thumbnail = element.filename.split(".");
          this.thumbnail = this.thumbnail[0] + "-tn160.png";
          this.picUrl = "http://media.mw.metropolia.fi/wbma/uploads/";
          this.picUrl += this.thumbnail;
        }
      });
    });
  }
}
