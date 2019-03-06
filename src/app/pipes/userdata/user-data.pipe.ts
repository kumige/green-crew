import { MediaProviderPage } from "./../../media-provider/media-provider.page";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "userData"
})
export class UserDataPipe implements PipeTransform {
  constructor(public mediaProvider: MediaProviderPage) {}

  transform(id: number, args?: any): any {
    return new Promise((resolve, reject) => {
      this.mediaProvider.getUserData(id).subscribe(res => {
        resolve(res.username);
      });
    });
  }
}
