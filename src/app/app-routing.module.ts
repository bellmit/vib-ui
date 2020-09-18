import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {KKRoutes} from "./kiatnakin/routing.module";
import {MainComponent} from "./kiatnakin/main.component";
import { AuthenticationGuard } from './kiatnakin/_guard/authentication.guard';
import { AuthenticationNotFoundComponent } from './kiatnakin/service-module/authentication/authentication_not_found.component';

const routes: Routes = [
    {
        path: "", redirectTo: "/kk", pathMatch: "full"
    },
    {
        path: "kk",
        canActivate: [AuthenticationGuard],
        component: MainComponent,
        children: [
            ...KKRoutes
        ]
    },
    {path: "advertisement", component: AuthenticationNotFoundComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: []
})

export class VIBApplicationRoutingModule {
}
