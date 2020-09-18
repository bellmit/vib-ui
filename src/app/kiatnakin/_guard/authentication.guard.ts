import {Injectable} from '@angular/core';
import { Location } from '@angular/common';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from "@angular/router";
import {DataService, UserService} from "../_service";
import { isNullOrUndefined } from 'util';
import * as moment from 'moment';
import { Utils } from '../../share/utils';

@Injectable()
export class AuthenticationGuard implements CanActivate {

    constructor(private dataService: DataService ,
        private userService: UserService,
        private router: Router,
        private location: Location) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        if ( !isNullOrUndefined( this.dataService.LastDateTellerAuthorized ) ) {

            const lastDateTellerAuthorized = moment(this.dataService.LastDateTellerAuthorized )
            const iscurrentDate = lastDateTellerAuthorized.isSame(moment().toISOString(), "day");
            if ( iscurrentDate ) {
                return true
            }
        }

        this.router.navigate(['advertisement']);
        Utils.runningNumber = 0
        return false
    }
}
