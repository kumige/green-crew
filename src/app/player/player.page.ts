import { MediaProviderPage } from "./../media-provider/media-provider.page";
import { SingleMediaService } from "./../services/single-media.service";
import { Component, OnInit } from "@angular/core";
import { NavController, AlertController } from "@ionic/angular";
import { IDesc } from "../interfaces/file";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";

@Component({
  selector: "app-player",
  templateUrl: "./player.page.html",
  styleUrls: ["./player.page.scss"]
})
export class PlayerPage implements OnInit {
  postData;
  description: IDesc;
  picUrl = "http://media.mw.metropolia.fi/wbma/uploads/";
  user;
  thumbnail: string;
  commentArray = [];
  commentForm: FormGroup;
  commentStatus = true;
  videoContent = false;
  audioContent = false;
  imageContent = false;

  constructor(
    public singleMediaService: SingleMediaService,
    public mediaProvider: MediaProviderPage,
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.commentForm = new FormGroup({
      comment: new FormControl("", Validators.minLength(3))
    });
    this.mediaProvider.getProfileData().subscribe(res => {
      this.user = res;
    });
  }

  //Load content
  ionViewWillEnter() {
    this.getPost();
    this.getProfilePic();
    this.getComments();
  }

  //Clear comments from memory
  ionViewWillLeave() {
    this.commentArray.length = 0;
  }

  getPost() {
    this.postData = this.singleMediaService.getPost();
    this.description = this.singleMediaService.getDescription();
  }

  getComments() {
    return new Promise((resolve, reject) => {
      this.mediaProvider.getComments(this.postData.file_id).subscribe(res => {
        res.forEach(async element => {
          const singleComment = {
            comment_id: element.comment_id,
            comment: element.comment,
            username: await this.getCommentUsername(element.user_id),
            time_added: element.time_added,
            ownComment: false
          };
          if (element.user_id === this.user.user_id) {
            singleComment.ownComment = true;
          }
          this.commentArray.push(singleComment);
        });
        resolve(this.commentArray);
      });
    });
  }

  //Get username with user ID
  async getCommentUsername(id) {
    return new Promise((resolve, reject) => {
      this.mediaProvider.getUserData(id).subscribe(res => {
        resolve(res.username);
      });
    });
  }

  postComment() {
    if (this.commentForm.get("comment").valid) {
      const data = {
        file_id: this.postData.file_id,
        comment: this.commentForm.get("comment").value
      };
      //Post the comment and refresh comments
      this.mediaProvider.postComment(data).subscribe(res => {
        this.commentForm.get("comment").reset();
        this.commentArray.length = 0;
        this.getComments();
      });
    } else {
      this.commentStatus = false;
    }
  }

  deleteComment(comment) {
    this.deleteAlert("Are you sure you want to delete this comment?", comment);
  }

  async deleteAlert(alertMsg: string, comment) {
    const alert = await this.alertCtrl.create({
      message: alertMsg,
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary"
        },
        {
          text: "Yes",
          handler: () => {
            this.mediaProvider
              .deleteComment(comment.comment_id)
              .subscribe(res => {
                this.commentArray.forEach((element, index) => {
                  if (element.comment_id === comment.comment_id) {
                    this.commentArray.splice(index, 1);
                  }
                });
              });
          }
        }
      ]
    });

    await alert.present();
  }

  navBack() {
    this.navCtrl.navigateBack(this.singleMediaService.getPreviousUrl());
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
