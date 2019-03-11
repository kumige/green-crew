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
import { SingleMediaService } from "../services/single-media.service";

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

  constructor(
    public navCtrl: NavController,
    public mediaProvider: MediaProviderPage,
    public loadingCtrl: LoadingController,
    public chooser: Chooser,
    public domSanitizer: DomSanitizer,
    public formBuilder: FormBuilder,
    public singleMediaService: SingleMediaService
  ) {}

  ngOnInit() {
    this.uploadForm = this.formBuilder.group({
      name: ["", Validators.required],
      ingredient: this.formBuilder.array(
        [this.createIngredient()],
        Validators.required
      ),
      instructions: ["", Validators.required]
    });
  }

  createIngredient() {
    return this.formBuilder.group({
      name: ["", Validators.required],
      amount: ["", Validators.required]
    });
  }

  addIngredientField() {
    this.ingredient = this.uploadForm.get("ingredient") as FormArray;
    this.ingredient.push(this.createIngredient());
  }

  removeIngredientField() {
    this.ingredient = this.uploadForm.get("ingredient") as FormArray;
    this.ingredient.removeAt(this.ingredient.length - 1);
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

  resetForm() {
    this.fileTitle = "";
    this.fileDesc = "";
    this.fileData = null;
    this.fileBlob = null;
    this.file = null;
    this.uploadForm.reset();
  }

  upload() {
    const fd = new FormData();
    fd.append("file", this.fileBlob);
    fd.append("title", this.fileTitle);
    fd.append("description", JSON.stringify(this.uploadForm.value));
    this.mediaProvider.upload(fd).subscribe((res: any) => {
      this.addFilterTag(res.file_id);
      this.createSpinner();
      setTimeout(() => {
        this.navCtrl.navigateBack("");
      }, 2000);
    });
  }

  async createSpinner() {
    const loadingElement = await this.loadingCtrl.create({
      message: "Please wait...",
      spinner: "crescent",
      duration: 2000
    });
    return await loadingElement.present();
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
    this.navCtrl.navigateBack(this.singleMediaService.getPreviousUrl());
  }
}
