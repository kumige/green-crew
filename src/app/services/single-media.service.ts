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
  updatedProfile: Boolean = false;
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

  // Sets all the profile data
  setProfileData(profileArray) {
    this.profileArray = profileArray;
  }

  // Sets the profiles background image
  setProfileBackground(image) {
    this.profileImage = image;
  }

  // Gets all the profile data (username, full name etc)
  getProfileData() {
    return this.profileArray;
  }

  // Gets the profiles background image
  getProfileBackground() {
    return this.profileImage;
  }

  // Sets the status wheter profile is updated or not
  setProfileUpdated(updated) {
    this.updatedProfile = updated;
  }

  // Returns the status wheter profile was updated or not
  getProfileUpdated() {
    return this.updatedProfile;
  }
}
