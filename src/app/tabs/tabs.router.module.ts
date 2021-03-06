import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TabsPage } from "./tabs.page";

const routes: Routes = [
  {
    path: "tabs",
    component: TabsPage,
    children: [
      {
        path: "tab1",
        children: [
          {
            path: "",
            loadChildren: "../home/tab1.module#Tab1PageModule"
          }
        ]
      },
      {
        path: "tab2",
        children: [
          {
            path: "",
            loadChildren: "../search/tab2.module#Tab2PageModule"
          }
        ]
      },
      {
        path: "tab3",
        children: [
          {
            path: "",
            loadChildren: "../profile/tab3.module#Tab3PageModule"
          }
        ]
      },
      {
        path: "tab4",
        children: [
          {
            path: "",
            loadChildren: "../login/login.module#LoginPageModule"
          }
        ]
      },
      {
        path: "player",
        children: [
          {
            path: "",
            loadChildren: "../player/player.module#PlayerPageModule"
          }
        ]
      },
      {
        path: "upload",
        children: [
          {
            path: "",
            loadChildren: "../upload/upload.module#UploadPageModule"
          }
        ]
      },
      {
        path: "profile-edit",
        children: [
          {
            path: "",
            loadChildren:
              "../profile-edit/profile-edit.module#ProfileEditPageModule"
          }
        ]
      },
      {
        path: "",
        redirectTo: "/tabs/tab1",
        pathMatch: "full"
      }
    ]
  },
  {
    path: "",
    redirectTo: "/tabs/tab1",
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
