import {Injectable} from '@angular/core';
import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {DataService} from "../_service/data.service";
import {isNullOrUndefined} from "util";


@Injectable()
export class SelectServiceGuard implements CanActivate {


    constructor(private router: Router,
                private dataService: DataService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        if (this.dataService.selectedService) {
            return true;
        }

        this.router.navigate(["kk", 'service']);
        return false;

    }
}
