import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Utils } from '../../../../share/utils';
import { DataService } from '../../../_service/data.service';
import { InvestmentService } from '../../../_service/api/investment.service';
import { isNullOrUndefined } from 'util';
import { TemplateFlipBookComponent } from '../../../_template/template-flip-book/template-flip-book.component';
import { Modal } from '../../../_share/modal-dialog/modal-dialog.component';
import { UserService } from 'app/kiatnakin/_service/user.service';

@Component({
  selector: 'suitability',
  templateUrl: './suitability.component.html',
  styleUrls: [
    './suitability.component.sass',
    '../../../_template/template-flip-book/template-flip-book.component.sass'
  ]
})
export class SuitabilityComponent implements OnInit, OnDestroy {
  @ViewChild('flipBook') flipBook: TemplateFlipBookComponent;

  fromMenuFundManagement;
  public imgPart = './assets/kiatnakin/image/investment/patara_purple.png';
  public currentCustomerSuitScore;
  public summarySuitScore = {
    riskTitle: '',
    assetAllocation: {
      bankDeposit: '0', // เงินฝาก,ตราสารหนี้
      governmentInstrument: '0', // ตราสารภาครัฏ
      privateInstrument: '0', // ตราสารภาคเอกชน
      equityInstrument: '0', // ตราสารทุน
      alternativeFund: '0' // การลงทุนทางเลือก
    }
  };
  public suitFound;
  public suitExpired;
  public answer = {};
  public isShowCloseButton: boolean = true;
  public turningSectionName: string = null;
  private savingBook = null;
  private isClosed = false;

  constructor(
    private router: Router,
    private location: Location,
    private dataService: DataService,
    private investmentService: InvestmentService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.fromMenuFundManagement = this.dataService.fromMenuFundManagement;
    this.getInquiryCurrentCustSuitScore();
    Utils.animate('#container', 'slideInUp');
  }

  ngOnDestroy() {
    this.dataService.fromMenuFundManagement = false;
  }

  getInquiryCurrentCustSuitScore() {
    Modal.showProgress();
    this.investmentService.getInquiryCurrentCustSuitScore().subscribe(() => {
      this.suitFound = this.userService.getUser().suitFound;
      this.suitExpired = this.userService.getUser().suitExpired;
      this.currentCustomerSuitScore = this.userService.getUser().suitScore;
      this.getSummarySuit();
    });
  }

  onClickBack() {
    if (this.dataService.isAcceptedTermMutualFund) {
      if (this.fromMenuFundManagement) {
        return Utils.animate('#container', 'slideOutDown').then(() => {
          this.location.back();
        });
      }
      return this.onClickBackToTransactiontype();
    }
    return Utils.animate('#container', 'slideOutDown').then(() => {
      this.router.navigate(['kk', 'transactiontype']);
    });
  }

  onClickBackToTransactiontype() {
    Utils.animate('#container', 'slideOutDown').then(() => {
      this.router.navigate(['kk', 'transactiontype']);
    });
  }

  onClickAccept() {
    Utils.animate('#container', 'slideOutDown').then(() => {
      $('#container')
        .hide()
        .removeClass('slideOutDown');
      this.router.navigate(['kk', 'selectMutualfundAccount']);
    });
  }

  // this function stores suit-question in this.dataService.suitQuestion
  getSuitQuestion() {
    Modal.showProgress();
    this.investmentService.getInquirySuitabiltyQuestion().subscribe(
      () => {
        this.isShowCloseButton = false;
        Utils.animate('#container', 'slideOutDown').then(() => {
          $('#container').hide().removeClass('slideOutDown');
          this.router.navigate(['kk', 'suit-question']);
        });
      },
      error => {
        Modal.showAlert(error.responseStatus.responseMessage);
      }
    );
  }

  getSummarySuit() {
    if (!isNullOrUndefined(this.currentCustomerSuitScore)) {
      const suitLevel = this.currentCustomerSuitScore.riskProfile;
      switch (suitLevel) {
        case '1':
          this.summarySuitScore.riskTitle = 'เสี่ยงต่ำ';

          this.summarySuitScore.assetAllocation.bankDeposit = '> 60%';
          this.summarySuitScore.assetAllocation.governmentInstrument = '> 60%';
          this.summarySuitScore.assetAllocation.privateInstrument = '< 20%';
          this.summarySuitScore.assetAllocation.equityInstrument = '< 10%';
          this.summarySuitScore.assetAllocation.alternativeFund = '< 5%';

          break;
        case '2':
          this.summarySuitScore.riskTitle = 'เสี่ยงปานกลาง<br>ค่อนข้างต่ำ';

          this.summarySuitScore.assetAllocation.bankDeposit = '< 20%';
          this.summarySuitScore.assetAllocation.governmentInstrument = '< 70%';
          this.summarySuitScore.assetAllocation.privateInstrument = '< 70%';
          this.summarySuitScore.assetAllocation.equityInstrument = '< 20%';
          this.summarySuitScore.assetAllocation.alternativeFund = '< 10%';

          break;
        case '3':
          this.summarySuitScore.riskTitle = 'เสี่ยงปานกลาง<br>ค่อนข้างสูง';

          this.summarySuitScore.assetAllocation.bankDeposit = '< 10%';
          this.summarySuitScore.assetAllocation.governmentInstrument = '< 60%';
          this.summarySuitScore.assetAllocation.privateInstrument = '< 60%';
          this.summarySuitScore.assetAllocation.equityInstrument = '< 30%';
          this.summarySuitScore.assetAllocation.alternativeFund = '< 10%';

          break;
        case '4':
          this.summarySuitScore.riskTitle = 'เสี่ยงสูง';

          this.summarySuitScore.assetAllocation.bankDeposit = '< 10%';
          this.summarySuitScore.assetAllocation.governmentInstrument = '< 40%';
          this.summarySuitScore.assetAllocation.privateInstrument = '< 40%';
          this.summarySuitScore.assetAllocation.equityInstrument = '< 40%';
          this.summarySuitScore.assetAllocation.alternativeFund = '< 20%';

          break;
        case '5':
          this.summarySuitScore.riskTitle = 'เสี่ยงมาก';

          this.summarySuitScore.assetAllocation.bankDeposit = '< 5%';
          this.summarySuitScore.assetAllocation.governmentInstrument = '< 30%';
          this.summarySuitScore.assetAllocation.privateInstrument = '< 30%';
          this.summarySuitScore.assetAllocation.equityInstrument = '< 60%';
          this.summarySuitScore.assetAllocation.alternativeFund = '< 30%';

          break;
        default:
          break;
      }
    }
  }
}
