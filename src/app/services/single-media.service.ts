import { IPic, IDesc } from "./../interfaces/file";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class SingleMediaService {
  singlePost: any;

  profileArray: { username: null };
  profileImage;
  constructor() {}

  setPost(postData) {
    this.singlePost = postData;
    console.log(this.singlePost);
  }

  getPost() {
    return this.singlePost;
  }

  getDescription(): IDesc {
    console.log(JSON.parse(this.singlePost.description));
    return JSON.parse(this.singlePost.description);
  }

  setProfileData(profileArray) {
    this.profileArray = profileArray;
  }

  setProfileBackground(image) {
    this.profileImage = image;
  }

  getProfileData() {
    return this.profileArray;
  }

  getProfileBackground() {
    return this.profileImage;
  }
}
