import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  { path: "", loadChildren: "./tabs/tabs.module#TabsPageModule" },
  { path: "login", loadChildren: "./login/login.module#LoginPageModule" },
  {
    path: "media-provider",
    loadChildren:
      "./media-provider/media-provider.module#MediaProviderPageModule"
  },
  { path: "upload", loadChildren: "./upload/upload.module#UploadPageModule" },
  { path: "player", loadChildren: "./player/player.module#PlayerPageModule" },
  {
    path: "profile-edit",
    loadChildren: "./profile-edit/profile-edit.module#ProfileEditPageModule"
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
