import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChildren,
  QueryList,
  Input
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, DatePipe } from '@angular/common';
import { DataService } from '../../_service/data.service';
import { UserService } from '../../_service/user.service';
import { Utils } from '../../../share/utils';
import { TransactionService } from '../../_service/api/transaction.service';
import { Modal } from '../../_share/modal-dialog/modal-dialog.component';
import { MutualfundAcountService } from '../../_service/api/mutualfund-account.service';
import * as moment from 'moment';
import { resolve, reject } from '../../../../../node_modules/@types/q';
import { TransactionPassbook } from '../../_model/transactionPassbook';
import { isNullOrUndefined } from 'util';
import { PassBook } from '../../_model/passbook';
import { AppConstant } from '../../../share/app.constant';
import { PassbookTD } from 'app/kiatnakin/_model/passbookTD';
import { TransactionPassbookTD } from 'app/kiatnakin/_model/transactionPassbookTD';

@Component({
  selector: 'nav-detail',
  templateUrl: './nav-detail.component.html',
  styleUrls: ['./nav-detail.component.sass'],
  providers: [MutualfundAcountService, AppConstant]
})
export class NavDetailComponent implements OnInit {
  imgPart: string = './assets/kiatnakin/image/';
  navDetail;
  suitScore;
  score;
  selectedOutstanding;
  selectedMutualfundAccount;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private transactionService: TransactionService,
    public dataService: DataService,
    public userService: UserService,
    public mutualfundAcountService: MutualfundAcountService
  ) { }

  ngOnInit() {
    this.suitScore = this.userService.getUser().suitScore;
    switch (this.suitScore.riskProfile) {
      case '1':
        this.score = '1'
        break;
      case '2':
        this.score = '4'
        break;
      case '3':
        this.score = '5'
        break;
      case '4':
        this.score = '7'
        break;
      case '5':
        this.score = '8'
        break;
      default:
        break;
    }
    this.selectedOutstanding = this.dataService.selectedOutstanding;
    console.log('OUT', this.selectedOutstanding)
    this.selectedMutualfundAccount = this.dataService.selectedMutualfundAccount;
    Utils.animate('#container', 'slideInUp');
  }

  onClickBack() {
    Utils.animate('#container', 'slideOutDown').then(() =>
      this.router.navigate(['kk', 'transactionMutualfund'])
    );
    // this.location.back();
  }

  onClickMainMenu() {
    Utils.animate('#container', 'slideOutDown').then(() =>
      this.router.navigate(['/kk'])
    );
  }

  onClickRiskTable() {
    Utils.animate('#container', 'slideOutDown').then(() =>
      this.router.navigate(['kk', 'riskTable'])
    );
  }

  goToCancelFund(cancelFund) {
    if (cancelFund) {
      Utils.animate('#container', 'slideOutDown').then(() =>
        this.router.navigate(["kk", "fund-management", "cancelFund"])
      );
    }
  }

}
