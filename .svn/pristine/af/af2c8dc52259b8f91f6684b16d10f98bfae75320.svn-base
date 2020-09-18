import {Injectable} from '@angular/core';
import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute} from "@angular/router";
import {UserService} from "../_service/user.service";
import {DataService} from "../_service/data.service";


@Injectable()
export class LoggedInGuard implements CanActivate {


    constructor(private router: Router,
                private activatedRoute: ActivatedRoute,
                private userService: UserService,
                private dataService: DataService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.userService.isLoggedin() ||
            this.dataService.isAnonymousMode) {
            return true;
        }


        const objectParams = route.queryParams;
        const queryParams = {};
        for (const key in objectParams) {
            if (key !== "returnUrl") {
                queryParams[key] = objectParams[key];
            }
        }

        queryParams["returnUrl"] = route.routeConfig.path;

        this.router.navigate(["kk", 'login'], {queryParams: queryParams});
        return false;

    }
}
