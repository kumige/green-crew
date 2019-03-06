import { Chooser } from "@ionic-native/chooser/ngx";
import { MediaProviderPage } from "./../media-provider/media-provider.page";
import { Component, OnInit } from "@angular/core";
import { NavController, LoadingController } from "@ionic/angular";

@Component({
  selector: "app-upload",
  templateUrl: "./upload.page.html",
  styleUrls: ["./upload.page.scss"]
})
export class UploadPage implements OnInit {
  fileTitle: string;
  fileDesc: string;
  fileData: string;
  file: File;
  fileBlob: Blob;
  brightness = 100;
  contrast = 100;
  saturation = 100;
  sepia = 0;

  ngOnInit() {}

  constructor(
    public navCtrl: NavController,
    public mediaProvider: MediaProviderPage,
    public loadingCtrl: LoadingController,
    public chooser: Chooser
  ) {}

  chooseFile() {
    this.chooser
      .getFile("image/*,video/mp4")
      .then(file => {
        if (file) {
          this.fileBlob = new Blob([file.data], { type: file.mediaType });
          this.showPreview();
        }
      })
      .catch((error: any) => console.error(error));
  }

  showPreview() {
    const reader = new FileReader();
    reader.onloadend = evt => {
      this.fileData = reader.result.toString();
    };

    reader.readAsDataURL(this.fileBlob);
  }

  getFilters() {
    let filters = {
      filter: `brightness(${this.brightness * 0.01}) contrast(${this.contrast *
        0.01}) saturate(${this.saturation * 0.01}) sepia(${this.sepia * 0.01})`
    };

    return filters;
  }

  resetForm() {
    this.fileTitle = "";
    this.fileDesc = "";
    this.fileData = null;
    this.fileBlob = null;
    this.file = null;
  }

  upload() {
    //const spinner = this.loadingCtrl.create();
    //spinner.present();
    const fd = new FormData();
    fd.append("file", this.fileBlob);
    fd.append("title", this.fileTitle);
    fd.append("description", this.fileDesc);
    this.mediaProvider.upload(fd).subscribe((res: any) => {
      this.addFilterTag(res.file_id);
      setTimeout(() => {
        this.navCtrl.navigateBack("");
        //spinner.dismiss();
      }, 2000);
    });
  }

  addFilterTag(fileId) {
    const tag = {
      file_id: fileId,
      tag: "gc"
    };
    this.mediaProvider.addTag(tag).subscribe(res => {
      console.log(res);
    });
  }

  navBack() {
    this.navCtrl.navigateBack("");
  }
}
