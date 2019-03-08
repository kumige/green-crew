import { NgModule } from "@angular/core";
import { ThumbnailPipe } from "./thumbnail/thumbnail.pipe";
import { UserDataPipe } from "./userdata/user-data.pipe";
import { SafeHtmlPipe } from "./safehtml/safe-html.pipe";

@NgModule({
  declarations: [ThumbnailPipe, UserDataPipe, SafeHtmlPipe],
  imports: [],
  exports: [ThumbnailPipe, UserDataPipe, SafeHtmlPipe]
})
export class PipesModule {}
