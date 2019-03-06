import { NgModule } from "@angular/core";
import { ThumbnailPipe } from "./thumbnail/thumbnail.pipe";
import { UserDataPipe } from "./userdata/user-data.pipe";

@NgModule({
  declarations: [ThumbnailPipe, UserDataPipe],
  imports: [],
  exports: [ThumbnailPipe, UserDataPipe]
})
export class PipesModule {}
