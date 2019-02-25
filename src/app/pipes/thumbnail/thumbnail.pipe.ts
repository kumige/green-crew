import { IPic } from "./../../interfaces/file";
import { MediaProviderPage } from "./../../media-provider/media-provider.page";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "thumbnail"
})
export class ThumbnailPipe implements PipeTransform {
  private cachedId;
  private thumbnail;
  constructor(public mediaProvider: MediaProviderPage) {}

  transform(id: number, ...args) {
    return new Promise((resolve, reject) => {
      this.mediaProvider.getSingleMedia(id).subscribe((response: IPic) => {
        switch (args[0]) {
          case "large":
            resolve(response.thumbnails.w640);
            break;
          case "medium":
            resolve(response.thumbnails.w320);
            break;
          case "screenshot":
            resolve(response.screenshot);
            break;
          default:
            resolve(response.thumbnails.w160);
        }
      });
    });
  }
}
