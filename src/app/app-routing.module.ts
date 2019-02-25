import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  { path: "", loadChildren: "./tabs/tabs.module#TabsPageModule" },
  { path: "login", loadChildren: "./login/login.module#LoginPageModule" },
  { path: "", loadChildren: "./tabs/tabs.module#TabsPageModule" },
  {
    path: "media-provider",
    loadChildren:
      "./media-provider/media-provider.module#MediaProviderPageModule"
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
