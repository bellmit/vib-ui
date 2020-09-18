import {Injectable} from '@angular/core';
import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute} from "@angular/router";
import {DataService} from "../_service/data.service";


@Injectable()
export class SelectMutualfundAccountGuard implements CanActivate {

    constructor(private router: Router,
                private activatedRoute: ActivatedRoute,
                private dataService: DataService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        if (this.dataService.selectedMutualfundAccount) {
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

        this.router.navigate(["kk", 'selectMutualfundAccount'], {queryParams: queryParams});
        return false;

    }
}
