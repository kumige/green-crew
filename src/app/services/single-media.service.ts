import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class SingleMediaService {
  singlePost: {};
  constructor() {}

  setPost(postData) {
    console.log("setPost called");
    this.singlePost = postData;
  }

  getPost() {
    console.log("getPost called", this.singlePost);
    return this.singlePost;
  }
}
