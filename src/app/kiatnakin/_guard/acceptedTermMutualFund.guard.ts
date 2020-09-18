import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {DataService} from "../_service/data.service";

@Injectable()
export class AcceptedTermMutualFundGuard implements CanActivate {

    constructor(private dataService: DataService,
                private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        if (this.dataService.isAcceptedTermMutualFund) {
            return true;
        }

        const objectParams = route.queryParams;
        const queryParams = {};
        for (const key in objectParams) {
            if (key !== "returnUrl") {
                queryParams[key] = objectParams[key];
            }
        }

        this.router.navigate(["kk", 'termMutualFund'], {queryParams: queryParams});
        return false;

    }
}
