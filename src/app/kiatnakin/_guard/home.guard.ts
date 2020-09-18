import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { DataService } from "../_service/data.service";
import { UserService } from "../_service/user.service";
import { InvestmentService } from '../_service/api/investment.service';

@Injectable()
export class HomeGuard implements CanActivate {

    constructor(private userService: UserService, private investmentService: InvestmentService, private dataService: DataService) {

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        this.dataService.resetData();
        this.investmentService.selectFund = [];
        console.log('this.dataService.resetData() runs')
        return true;

    }
}
