import { Component } from "@angular/core";
import { MediaProviderPage } from "../media-provider/media-provider.page";

@Component({
  selector: "app-tabs",
  templateUrl: "tabs.page.html",
  styleUrls: ["tabs.page.scss"]
})
export class TabsPage {
  constructor(public mediaProvider: MediaProviderPage) {}
}
