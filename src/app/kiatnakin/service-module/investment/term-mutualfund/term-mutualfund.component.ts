import { Component, OnInit, AfterViewInit, OnChanges, AfterContentInit, OnDestroy } from '@angular/core';
import { Directive, HostListener, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../../_service/data.service';
import { Utils } from '../../../../share/utils';
import { InvestmentService } from '../../../_service/api/investment.service';
import { Modal } from '../../../_share/modal-dialog/modal-dialog.component';
import { UserService } from 'app/kiatnakin/_service/user.service';
import * as moment from 'moment';
import { isNullOrUndefined } from 'util';
import { Location } from '@angular/common';

@Component({
  selector: 'term-mutualfund',
  templateUrl: './term-mutualfund.component.html',
  styleUrls: ['./term-mutualfund.component.sass']
})
export class TermMutualfundComponent
  implements OnInit, AfterViewInit, OnChanges, AfterContentInit, OnDestroy {
  disableBtn: boolean = true;
  checkFromCondition: boolean = false;
  checkFromVIBConsent: boolean = false;
  top: number;
  offSetHeight: number;
  scrollHeight: number;
  termAndCond;
  dataFundConditionVertion: string;
  VIBConsentData: any = [];
  dataFundCondition: any = [];

  constructor(
    private location: Location,
    private router: Router,
    private dataService: DataService,
    private userService: UserService,
    private investmentService: InvestmentService,
    private eleRef: ElementRef
  ) { }

  onScroll(event) {
    this.top = event.target.scrollTop;
    this.offSetHeight = event.target.offsetHeight;
    this.scrollHeight = event.target.scrollHeight;
    if (this.top >= this.scrollHeight - this.offSetHeight) {
      this.disableBtn = false;
    }

  }

  ngOnInit() {
    // CHECK UN CONSENT BY ID CARD
    this.investmentService.checkUnConsentByIDCard().subscribe(response => {
      if (response.header.success) {
        // CHECK IS ACCEPTED TERM MUTUAL FUND && INQUIRY CURRENT CUST SUITSCORE
        if (this.dataService.isAcceptedTermMutualFund) {
          $('#container').hide();
          this.checkVIBConsentByCif('');
          // this.router.navigate(['kk', 'suitability']);
        } else {
          this.investmentService.getInquiryCurrentCustSuitScore().subscribe(() => {
            if (this.userService.getUser().suitScore) {
              this.checkVIBConsentByCif('');
              // this.getTermMutualfund();
              Utils.animate('#container', 'slideInUp');
            } else {
              this.router.navigate(['kk', 'suitability']);
            }
          }, error => {
            console.log('ERROR', error.responseStatus.responseMessage)
          });
        }
      }
    }, error => {
      Modal.showAlertWithOk(error.responseStatus.responseMessage, () => {
        this.router.navigate(['kk', 'transactiontype']);
      });
    });


  }

  ngOnChanges() {
    // this.checkScrollBarInvisible()

  }
  ngAfterContentInit() {
    // this.checkScrollBarInvisible()

  }
  ngAfterViewInit() {
    // this.checkScrollBarInvisible()

  }

  ngOnDestroy() {
    // this.dataService.isAcceptedTermMutualFund = false;

  }

  public onClickBack() {
    if(this.checkFromVIBConsent || this.dataService.isGetFundCondition === 'Y') {
      Utils.animate('#containerCondition', 'slideOutDown').then(() => {
        this.router.navigate(['kk', 'transactiontype']);
      });
    }
    Utils.animate('#container', 'slideOutDown').then(() => {
      this.ngOnInit()
    });
  }

  // GET TERM AND CON
  getTermMutualfund() {
    Modal.showProgress();
    this.investmentService.getTermMutualfund().subscribe(
      res => {
        this.checkFromCondition = true;
        this.termAndCond = res.data ? res.data.utilityConfig : null;
        setTimeout(() => {
          this.checkScrollBarInvisible()
        }, 0);

      },
      error => {
        Modal.showAlert(error.responseStatus.responseMessage);
      },
      () => {
        Modal.hide();
      }
    );
  }

  // GET CHECK VIB CONSENT BY CIF
  checkVIBConsentByCif(isAccepType) {
    // Modal.showProgress();

    // let res = isAccepType === '' ? 'N' : isAccepType
    
    this.investmentService.checkVIBConsentByCif(isAccepType, this.dataFundConditionVertion).subscribe(res => {
      if (res.header.success) {
        if (res.data.isAccept === 'Y') {

          // if (res === 'Y') {

          this.checkFromVIBConsent = false;
          this.dataService.isGetFundCondition = 'Y';
          if (this.dataService.isAcceptedTermMutualFund) {
            this.router.navigate(['kk', 'suitability']);
          } else {
            this.getTermMutualfund();
          }
        } else {
          this.dataService.isGetFundCondition = 'N';
          if (isAccepType === '') {
            this.getFundCondition()
          } else {
            this.checkFromVIBConsent = false;
            if (this.dataService.isAcceptedTermMutualFund) {
              this.router.navigate(['kk', 'suitability']);
            } else {
              this.getTermMutualfund();
            }
          }
        }
      }

    }, error => {
      Modal.showAlert(error.responseStatus.responseMessage);
    },
      () => {
        Modal.hide();
      }
    );
  }

  getFundCondition() {
    Utils.animate("#containerCondition", "slideInUp");
    this.investmentService.getFundCondition('', 'CON').subscribe(response => {
      if (response.header.success) {
        this.dataFundCondition = response.data.fundConditionMessage;
        this.dataFundConditionVertion = response.data.version;
        this.checkFromVIBConsent = true;
        this.checkFromCondition = false;
      }
    }, error => {
      this.dataFundCondition = error.responseStatus.responseMessage;
    });
  }

  checkScrollBarInvisible() {
    console.log("$('#scroll')[0].scrollHeight ->", $('#scroll')[0].scrollHeight)
    console.log("$('#scroll')[0].clientHeight ->", $('#scroll')[0].clientHeight)
    if ($('#scroll')[0].scrollHeight === $('#scroll')[0].clientHeight) { //in case term-and-cond is too short => no scrollbar
      console.log("no scroll bar")
      return this.disableBtn = false;
    }
  }

  onClickAcceptTerm() {
    this.dataService.isAcceptedTermMutualFund = true;
    this.onGotoSuitability();
  }

  onGotoInvestmentPage() {
    Utils.animate('#container', 'slideOutDown').then(() => {
      this.router.navigate(['kk', 'investment']);
    });
  }

  onGotoSuitability() {
    Utils.animate('#container', 'slideOutDown').then(() => {
      this.router.navigate(['kk', 'suitability']);
    });
  }
}
