import { MediaProviderPage } from "./../media-provider/media-provider.page";
import { IPic } from "./../interfaces/file";
import { Component } from "@angular/core";
import { Observable } from "rxjs";
import { NavController } from "@ionic/angular";
import { UploadPage } from "../upload/upload.page";

@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"]
})
export class Tab1Page {
  picArray: Observable<IPic[]>;

  constructor(
    public mediaProvider: MediaProviderPage,
    public navCtrl: NavController
  ) {}

  ngOnInit() {
    this.getFiles();
  }

  getFiles() {
    this.picArray = this.mediaProvider.getFilesByTag("gc");
  }

  uploadClick() {
    this.navCtrl.navigateForward("/upload");
  }
}
