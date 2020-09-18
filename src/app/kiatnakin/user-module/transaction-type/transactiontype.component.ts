import {
  Component,
  OnInit,
  AfterContentInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Utils } from '../../../share/utils';
import { PaymentType } from '../../_model/transaction';
import { BankAccount } from '../../_model/bankAccount';
import { DataService } from '../../_service/data.service';
import { Modal } from '../../_share';
import { InvestmentService } from '../../_service/api/investment.service';
import { UserService } from '../../_service/user.service';

@Component({
  selector: 'app-transaction-type',
  templateUrl: 'transactiontype.component.html',
  styleUrls: ['transactiontype.component.sass']
})
export class TransactiontypeComponent implements AfterContentInit {
  public bankAccount = new BankAccount();
  public paymentType = PaymentType;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private userService: UserService,
    private investmentService: InvestmentService,
    private dataService: DataService
  ) { }

  ngAfterContentInit() {
    $('#container_form').addClass('animated fadeIn');
  }

  public onSelectType(type: any) {
    this.dataService.isTransferFund = false;
    if (type === 'tr_service') {
      Modal.showProgress();
      this.router.navigate(['kk', 'termMutualFund']);
    } else if (type === 'tr_bookbank') {
      this.router.navigate(['kk', 'selectBankAccount']);
    }
  }

  public onClickBack() {
    // this.location.back();
    this.router.navigate(['kk']);
  }
}
