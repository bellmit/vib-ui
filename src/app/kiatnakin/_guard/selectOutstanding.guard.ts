import {Injectable} from '@angular/core';
import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute} from "@angular/router";
import {DataService} from "../_service/data.service";
import { UserService } from '../_service/user.service';



@Injectable()
export class SelectOutstandingGuard implements CanActivate {

    constructor(private router: Router,
                private activatedRoute: ActivatedRoute,
                private userService: UserService,
                private dataService: DataService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        if (this.dataService.selectedOutstanding
          // && this.userService.getUser().suitScore
        ) {
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

        this.router.navigate(["kk", 'transactionMutualfund'], {queryParams: queryParams});
        return false;

    }
}
