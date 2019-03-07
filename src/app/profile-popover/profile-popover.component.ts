import { Component, OnInit } from "@angular/core";
import { PopoverController, NavController } from "@ionic/angular";
import { MediaProviderPage } from "../media-provider/media-provider.page";

@Component({
  selector: "app-profile-popover",
  templateUrl: "./profile-popover.component.html",
  styleUrls: ["./profile-popover.component.scss"]
})
export class ProfilePopoverComponent implements OnInit {
  constructor(
    public popOverController: PopoverController,
    public mediaProvider: MediaProviderPage,
    public navCtrl: NavController
  ) {}

  ngOnInit() {}

  close() {
    this.popOverController.dismiss();
  }

  logout() {
    localStorage.removeItem("token");
    this.mediaProvider.loggedIn = false;
    this.navCtrl.navigateBack("");
    this.close();
  }
}
