import { IPic } from "./../interfaces/file";
import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-media-provider",
  templateUrl: "./media-provider.page.html",
  styleUrls: ["./media-provider.page.scss"]
})
export class MediaProviderPage implements OnInit {
  constructor(public http: HttpClient) {}

  ngOnInit() {}

  getFiles() {
    return this.http.get<IPic[]>("http://media.mw.metropolia.fi/wbma/media");
  }

  getSingleMedia(id) {
    return this.http.get<IPic>(
      "http://media.mw.metropolia.fi/wbma/media/" + id
    );
  }
}
