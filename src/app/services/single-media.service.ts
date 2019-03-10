import { IPic, IDesc } from "./../interfaces/file";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class SingleMediaService {
  singlePost: any;
  previousUrl: string;

  profileArray: { username: null };
  profileImage;
  constructor() {}

  setPost(postData) {
    this.singlePost = postData;
  }

  setPreviousUrl(url) {
    this.previousUrl = url;
  }

  getPreviousUrl() {
    return this.previousUrl;
  }

  getPost() {
    return this.singlePost;
  }

  getDescription(): IDesc {
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
