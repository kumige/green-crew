import { Component } from "@angular/core";
import { MediaProviderPage } from "../media-provider/media-provider.page";

@Component({
  selector: "app-tab3",
  templateUrl: "tab3.page.html",
  styleUrls: ["tab3.page.scss"]
})
export class Tab3Page {
  constructor(public mediaProvider: MediaProviderPage) {}

  logout() {
    localStorage.removeItem("token");
    this.mediaProvider.loggedIn = false;
    //this.navCtrl.push(HomePage);
  }
}
