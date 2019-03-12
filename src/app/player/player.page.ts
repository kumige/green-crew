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
  ownPost = false;
  picUrl = "http://media.mw.metropolia.fi/wbma/uploads/";
  user;
  thumbnail: string;
  commentArray = [];
  commentForm: FormGroup;
  commentStatus = true;
  videoContent = false;
  audioContent = false;
  imageContent = false;
  favourited: Boolean = false;

  constructor(
    public singleMediaService: SingleMediaService,
    public mediaProvider: MediaProviderPage,
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.commentForm = new FormGroup({
      comment: new FormControl("", [
        Validators.required,
        Validators.minLength(3)
      ])
    });
  }

  //Load content
  ionViewWillEnter() {
    this.getPost();
    //this.getProfilePic();
    this.getComments();
    this.isFavourited();

    this.mediaProvider.getProfileData().subscribe(res => {
      this.user = res;
      if (this.postData.user_id === res.user_id) {
        this.ownPost = true;
      }
    });
  }

  //Clear data from memory
  ionViewWillLeave() {
    this.commentArray.length = 0;
    this.videoContent = false;
    this.audioContent = false;
    this.imageContent = false;
    this.ownPost = false;
  }

  getPost() {
    try {
      this.postData = this.singleMediaService.getPost();
      this.description = this.singleMediaService.getDescription();
    } catch (error) {
      this.navCtrl.navigateBack("");
    }

    switch (this.postData.media_type) {
      case "video":
        this.videoContent = true;
        break;

      case "audio":
        this.audioContent = true;

        break;
      case "image":
        this.imageContent = true;

        break;

      default:
        this.imageContent = true;

        break;
    }
  }

  deletePost() {
    this.deletePostAlert("Are you sure you want to delete this post?");
  }

  async deletePostAlert(alertMsg: string) {
    const alert = await this.alertCtrl.create({
      message: alertMsg,
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary"
        },
        {
          text: "Delete",
          handler: () => {
            this.mediaProvider
              .deletePost(this.postData.file_id)
              .subscribe(res => {
                this.navCtrl.navigateBack("");
              });
          }
        }
      ]
    });

    await alert.present();
  }

  getComments() {
    return new Promise((resolve, reject) => {
      this.mediaProvider.getComments(this.postData.file_id).subscribe(res => {
        this.mediaProvider
          .getProfilePic("profile")
          .subscribe((profileTagPosts: any) => {
            res.forEach(async (element: any) => {
              const singleComment = {
                comment_id: element.comment_id,
                comment: element.comment,
                username: await this.getCommentUsername(element.user_id),
                time_added: element.time_added,
                ownComment: false,
                profilePicUrl: "http://media.mw.metropolia.fi/wbma/uploads/"
              };
              if (element.user_id === this.user.user_id) {
                singleComment.ownComment = true;
              }
              for (let i = profileTagPosts.length - 1; i >= 0; i--) {
                if (profileTagPosts[i].user_id === element.user_id) {
                  this.thumbnail = profileTagPosts[i].filename.split(".");
                  this.thumbnail = this.thumbnail[0] + "-tn160.png";
                  singleComment.profilePicUrl =
                    "http://media.mw.metropolia.fi/wbma/uploads/";
                  singleComment.profilePicUrl += this.thumbnail;
                  break;
                } else {
                  singleComment.profilePicUrl = "../../assets/Gc-Pfp.png";
                }
              }
              console.log(singleComment.profilePicUrl);
              this.commentArray.push(singleComment);

              // Sorts by the newest comment
              this.commentArray.sort((a, b) => {
                return b.comment_id - a.comment_id;
              });
            });
            resolve(this.commentArray);
          });
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
    if (
      this.commentForm.get("comment").valid &&
      this.commentForm.get("comment").value.length >= 3
    ) {
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

  // Creates the alert pop-up for deleting recipes
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

  // Checks if the comment is over 3 characters long and if not, shows a error message
  commentStatusCheck() {
    if (
      this.commentForm.get("comment").value.length < 3 &&
      this.commentForm.get("comment").value.length > 0
    ) {
      this.commentStatus = false;
    } else {
      this.commentStatus = true;
    }
  }

  // Favourites a post
  favouritePost() {
    if (this.mediaProvider.loggedIn) {
      const file = {
        file_id: this.postData.file_id
      };
      this.favourited = true;
      this.mediaProvider.favouriteMedia(file).subscribe(res => {
        console.log(res);
      });
    }
  }

  // Unfavourites a post
  unFavouritePost() {
    if (this.mediaProvider.loggedIn) {
      this.favourited = false;
      this.mediaProvider
        .deleteFavourite(this.postData.file_id)
        .subscribe(res => {
          console.log(res);
        });
    }
  }

  // Checks if the post is favourited and changes the icon
  isFavourited() {
    if (this.postData.favourited) {
      this.favourited = true;
    } else {
      this.favourited = false;
    }
  }
}
