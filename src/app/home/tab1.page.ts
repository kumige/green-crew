import { UserDataPipe } from "./../pipes/userdata/user-data.pipe";
import { MediaProviderPage } from "./../media-provider/media-provider.page";
import { IPic } from "./../interfaces/file";
import { Component } from "@angular/core";
import { Observable } from "rxjs";
import { NavController } from "@ionic/angular";
import { SingleMediaService } from "../services/single-media.service";

@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"]
})
export class Tab1Page {
  picArray: Observable<IPic[]>;
  nameArray: Observable<[]>;

  constructor(
    public mediaProvider: MediaProviderPage,
    public navCtrl: NavController,
    public singleMediaService: SingleMediaService
  ) {}

  ngOnInit() {
    this.getFiles();
  }

  getFiles() {
    this.picArray = this.mediaProvider.getFilesByTag("gc");
  }

  uploadClick() {
    this.navCtrl.navigateForward("/tabs/upload");
  }

  showSinglePost(item) {
    this.singleMediaService.setPost(item);
    this.navCtrl.navigateForward("/tabs/player");
  }
}
