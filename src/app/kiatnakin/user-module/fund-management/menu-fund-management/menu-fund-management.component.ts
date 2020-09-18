import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router"
import { DataService } from "../../../_service/data.service";

@Component({
  selector: 'menu-fund-management',
  templateUrl: './menu-fund-management.component.html',
  styleUrls: ['./menu-fund-management.component.sass']
})
export class MenuFundManagementComponent implements OnInit, OnDestroy {
  isAllowToInvest: boolean;

  @Output() cancelFund: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private router: Router,
    public activatedRoute: ActivatedRoute,
    public dataService: DataService
  ) {

  }

  ngOnInit() {
    if(this.dataService.isGetFundCondition === 'Y') this.isAllowToInvest = true
  }

  ngOnDestroy() {

  }

  onOrderFund(orderType) {
    const queryParams = { type: orderType };
    switch (orderType) {
      case 'purchase':
        this.router.navigate(["kk", "fund-management", "purchase"], { queryParams: queryParams });
        break;
      case 'redeem':
          this.router.navigate(["kk", "fund-management", "redeem"], { queryParams: queryParams });
        break;
      case 'switch_out':
          this.router.navigate(["kk", "fund-management", "switch_out"], { queryParams: queryParams });
        break;
      case 'cancel':
          this.cancelFund.emit(true)
        break;
      case 'risk':
          this.dataService.fromMenuFundManagement = true;
          this.router.navigate(["kk", "suitability"]);
        break;
    }
  }
}
