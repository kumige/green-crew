import { Chooser } from "@ionic-native/chooser/ngx";
import { MediaProviderPage } from "./../media-provider/media-provider.page";
import { Component, OnInit } from "@angular/core";
import { NavController, LoadingController } from "@ionic/angular";
import { DomSanitizer } from "@angular/platform-browser";
import {
  Validators,
  FormGroup,
  FormControl,
  FormArray,
  FormBuilder
} from "@angular/forms";

@Component({
  selector: "app-upload",
  templateUrl: "./upload.page.html",
  styleUrls: ["./upload.page.scss"]
})
export class UploadPage implements OnInit {
  uploadForm: FormGroup;
  ingredient: FormArray;
  ingredientList = new Array();
  ingredientCount = 1;
  allIngredients: string;
  fileTitle: string;
  fileDesc: string;
  fileData: string;
  file: File;
  fileBlob: Blob;
  brightness = 100;
  contrast = 100;
  saturation = 100;
  sepia = 0;

  /* ingredient row template
  `
    <ion-item>
      <ion-row>
        <ion-col size="9">
          <ion-input class="ingredient" type="text"></ion-input>
        </ion-col>
        <ion-col size="3">
          <ion-input class="amount" type="text"></ion-input>
        </ion-col>
      </ion-row>
    </ion-item>
  `
  */

  constructor(
    public navCtrl: NavController,
    public mediaProvider: MediaProviderPage,
    public loadingCtrl: LoadingController,
    public chooser: Chooser,
    public domSanitizer: DomSanitizer,
    public formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.uploadForm = this.formBuilder.group({
      name: ["", Validators.required],
      ingredient: this.formBuilder.array([this.createIngredient()])
    });
  }

  createIngredient() {
    return this.formBuilder.group({
      name: [""],
      amount: [""]
    });
  }

  addIngredientField() {
    console.log(this.uploadForm.valid);
    this.ingredient = this.uploadForm.get("ingredient") as FormArray;
    this.ingredient.push(this.createIngredient());
  }

  removeIngredientField() {
    this.ingredient = this.uploadForm.get("ingredient") as FormArray;
    this.ingredient.removeAt(this.ingredient.length - 1);
  }

  getDescription(ing) {
    console.log(ing);
  }

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
