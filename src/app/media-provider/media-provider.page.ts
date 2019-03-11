import {
  User,
  LoginResponse,
  RegisterResponse,
  UserCheck
} from "./../interfaces/user";
import { IPic, IComment } from "./../interfaces/file";
import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Component({
  selector: "app-media-provider",
  templateUrl: "./media-provider.page.html",
  styleUrls: ["./media-provider.page.scss"]
})
export class MediaProviderPage implements OnInit {
  constructor(public http: HttpClient) {
    this.checkStorage();
  }

  loggedIn: Boolean;

  ngOnInit() {}

  // Checks if the user is logged in or not from the storage
  checkStorage() {
    if (localStorage.getItem("token") !== null) {
      this.loggedIn = true;
      console.log(true);
      return true;
    } else {
      console.log(false);
      this.loggedIn = false;
      return false;
    }
  }

  getFiles() {
    return this.http.get<IPic[]>("http://media.mw.metropolia.fi/wbma/media");
  }

  getFilesByTag(tag) {
    return this.http.get<[any]>(
      "http://media.mw.metropolia.fi/wbma/tags/" + tag
    );
  }

  getComments(id) {
    return this.http.get<IComment[]>(
      "http://media.mw.metropolia.fi/wbma/comments/file/" + id
    );
  }

  postComment(data) {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token")
      })
    };
    return this.http.post(
      "http://media.mw.metropolia.fi/wbma/comments/",
      data,
      httpOptions
    );
  }

  deleteComment(id) {
    const httpOptions = {
      headers: new HttpHeaders({
        "x-access-token": localStorage.getItem("token")
      })
    };
    return this.http.delete(
      "http://media.mw.metropolia.fi/wbma/comments/" + id,
      httpOptions
    );
  }

  getUserMedia() {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token")
      })
    };
    return this.http.get<IPic[]>(
      "http://media.mw.metropolia.fi/wbma/media/user",
      httpOptions
    );
  }

  getSingleMedia(id) {
    return this.http.get<IPic>(
      "http://media.mw.metropolia.fi/wbma/media/" + id
    );
  }

  getProfilePic(tag: string) {
    return this.http.get("http://media.mw.metropolia.fi/wbma/tags/" + tag);
  }

  getProfileData() {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token")
      })
    };
    return this.http.get<User>(
      "http://media.mw.metropolia.fi/wbma/users/user",
      httpOptions
    );
  }

  getUserData(id) {
    const httpOptions = {
      headers: new HttpHeaders({
        "x-access-token": localStorage.getItem("token")
      })
    };
    return this.http.get<User>(
      "http://media.mw.metropolia.fi/wbma/users/" + id,
      httpOptions
    );
  }

  updateFile(fileID, data) {
    const httpOptions = {
      headers: new HttpHeaders({
        "x-access-token": localStorage.getItem("token")
      })
    };
    return this.http.put(
      "http://media.mw.metropolia.fi/wbma/media/" + fileID,
      data,
      httpOptions
    );
  }

  deleteFile(fileID) {
    const httpOptions = {
      headers: new HttpHeaders({
        "x-access-token": localStorage.getItem("token")
      })
    };
    return this.http.delete(
      "http://media.mw.metropolia.fi/wbma/media/" + fileID,
      httpOptions
    );
  }

  login(user: User) {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };
    return this.http.post<LoginResponse>(
      "http://media.mw.metropolia.fi/wbma/login",
      user,
      httpOptions
    );
  }

  register(user: User) {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };
    return this.http.post<RegisterResponse>(
      "http://media.mw.metropolia.fi/wbma/users",
      user,
      httpOptions
    );
  }

  userCheck(username) {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };
    return this.http.get<UserCheck>(
      "http://media.mw.metropolia.fi/wbma/users/username/" + username,
      httpOptions
    );
  }

  upload(data: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        "x-access-token": localStorage.getItem("token")
      })
    };
    return this.http.post(
      "http://media.mw.metropolia.fi/wbma/media",
      data,
      httpOptions
    );
  }

  addTag(data: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        "x-access-token": localStorage.getItem("token")
      })
    };
    return this.http.post(
      "http://media.mw.metropolia.fi/wbma/tags",
      data,
      httpOptions
    );
  }

  getTags(id) {
    const httpOptions = {
      headers: new HttpHeaders({
        "x-access-token": localStorage.getItem("token")
      })
    };
    return this.http.post(
      "http://media.mw.metropolia.fi/wbma/tags/file/" + id,
      httpOptions
    );
  }

  editProfile(data: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        "x-access-token": localStorage.getItem("token")
      })
    };
    return this.http.put(
      "http://media.mw.metropolia.fi/wbma/users",
      data,
      httpOptions
    );
  }

  getFavourites() {
    const httpOptions = {
      headers: new HttpHeaders({
        "x-access-token": localStorage.getItem("token")
      })
    };
    return this.http.get(
      "http://media.mw.metropolia.fi/wbma/favourites",
      httpOptions
    );
  }

  favouriteMedia(file_id) {
    const httpOptions = {
      headers: new HttpHeaders({
        "x-access-token": localStorage.getItem("token")
      })
    };
    return this.http.post(
      "http://media.mw.metropolia.fi/wbma/favourites",
      file_id,
      httpOptions
    );
  }

  deleteFavourite(file_id) {
    const httpOptions = {
      headers: new HttpHeaders({
        "x-access-token": localStorage.getItem("token")
      })
    };
    return this.http.delete(
      "http://media.mw.metropolia.fi/wbma/favourites/file/" + file_id,
      httpOptions
    );
  }
}
