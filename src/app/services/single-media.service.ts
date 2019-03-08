import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class SingleMediaService {
  singlePost: {};

  profileArray: { username: null };
  profileImage;
  constructor() {}

  setPost(postData) {
    console.log("setPost called");
    this.singlePost = postData;
  }

  getPost() {
    console.log("getPost called", this.singlePost);
    return this.singlePost;
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
