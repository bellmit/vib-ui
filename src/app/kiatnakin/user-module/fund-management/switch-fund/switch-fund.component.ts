import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, DatePipe } from '@angular/common';
import { Http } from '@angular/http';
import { DataService } from '../../../_service/data.service';
import { InvestmentService } from '../../../_service/api/investment.service';
import { Modal } from '../../../_share/modal-dialog/modal-dialog.component';
import { Utils, Environment } from "../../../../share/utils";

@Component({
  selector: 'switch-fund',
  templateUrl: './switch-fund.component.html',
  styleUrls: ['./switch-fund.component.sass']
})
export class SwitchFundComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    public http: Http,
    private router: Router,
    private location: Location,
    public dataService: DataService,
    private investmentService: InvestmentService,
  ) { }
  unitHolderId: any = [];
  unitHolderName: any = [];
  outStandingLists: any = [];
  fundLists: any = [];
  fundLtfRmfs: any = [];
  paramType: any = [];


  imgPart: string = './assets/kiatnakin/image/';
  rootUrl = '/GET_HREF_LINK_PDF';
  unitHolderData: any = [];
  fundListSelect: any = [];
  srcfilePDFLink: any = [];
  dataFundCondition: any = [];
  outStandingID: any = [];
  fundListFilterOut: any = [];
  fundCode = '';
  maginTopClass = '';
  maginTopClassOut = '';
  showMsg = false;
  checkFromPDFLink = false;
  checkFromConditionFund = false;
  checkFromFundList = true;
  checkSwichFund = true;
  checkFundFact = true;
  disableBtn: boolean = true;
  top: number;
  offSetHeight: number;
  scrollHeight: number;

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.paramType = params;
    });
    this.unitHolderId = this.dataService.selectedMutualfundAccount.unitHolderId;
    this.unitHolderName = this.dataService.selectedMutualfundAccount.unitHolderName;
    if (this.paramType.type === 'switch_out') {
      this.getInquiryOutstanding()
    } else {
      this.getInquiryFundList()
    }
    this.initObject();
  }

  initObject() {
    const options = {
      horizontal: true,
      //Item base navigation
      itemNav: 'centered',
      smart: true,
      activateOn: 'click',
      activateMiddle: true,

      //Scrolling
      scrollBy: 0,
      speed: 1200,
      easing: 'easeOutExpo',

      //Dragging
      mouseDragging: true,
      touchDragging: true,
      releaseSwing: true,
      elasticBounds: false,
      dragHandle: true,
      dynamicHandle: true
    };
    $('#frameIn').sly(options);
    $('#frame').sly(options);
    $('#frameOutRL').sly(options);
    $('#frameOut').sly(options);
  }

  // GET DATA INQUIRY OUT STANDING LIST
  getInquiryOutstanding() {
    this.investmentService.getInquiryOutstanding(this.unitHolderId).subscribe(response => {
      if (response.data === null || response.data.length === 0) {
        this.outStandingLists = ''
      } else {
        this.outStandingLists = response.data.dataList.filter(d => d.fundAllowance.some(a => a.isAllow === "SW")).map(out => out.fundId);
      }
      this.getInquiryFundList();
    }, error => {
      Modal.showAlert(error.responseStatus.responseMessage);
    }, () => {
      Modal.hide();
    });
  }

  // GET DATA INQUIRY OUT STANDING LIST
  getInquiryFundList() {
    this.checkSwichFund = true;
    const type = this.paramType.type === 'switch_out' ? 'SO' : 'SI';
    const swich_out_fundId = this.paramType.type === 'switch_out' ? '' : this.paramType.swich_out_fundId;
    this.investmentService.getInquiryFundList(type, swich_out_fundId).subscribe(response => {
      if (response.header.success) {
        this.fundListFilterOut = this.paramType.type === 'switch_out' ? response.data.fundData.filter(fund => this.outStandingLists.includes(fund.fundId)) : response.data.fundData;
        this.fundLtfRmfs = this.fundListFilterOut.filter(res => {
          return res.taxType === 'LTF' || res.taxType === 'RMF'
        });
        this.fundLists = this.fundListFilterOut.filter(res => {
          return res.taxType !== 'LTF' && res.taxType !== 'RMF'
        });
        if (this.fundLtfRmfs.length === 0) {
          this.maginTopClassOut = 'speechHiden'
          this.maginTopClass = 'speech1'
        } else if (this.fundLists.length === 0) {
          this.maginTopClassOut = 'speech1'
          this.maginTopClass = 'speechHiden'
        } else {
          this.maginTopClassOut = 'speech1'
          this.maginTopClass = 'speech'
        }
      } else {
        Modal.showAlert(response.responseStatus.responseMessage);
      }
    }, error => {
      Modal.showAlert(error.responseStatus.responseMessage);
    }, () => {
      Modal.hide();
      setTimeout(() => {
        $('#frameIn').sly('reload');
        $('#frame').sly('reload');
        $('#frameOutRL').sly('reload');
        $('#frameOut').sly('reload');
      }, 100);
    })
  }

  selectFund(fundSelect) {
    this.investmentService.selectFundSwich_In = {}
    if(this.dataService.transaction) this.dataService.transaction.to.bank.bg_color = ''
    this.investmentService.getInquiryOutstanding(this.unitHolderId, fundSelect.fundId).subscribe(response => {
      if (response.header.success) {
        const queryParams = {
          type: 'SWITCH_OUT',
        }
        const fundSwich_out = {
          type: 'SWITCH_OUT',
          accountNo: response.data.dataList[0].accountNo,
          amcCode: response.data.dataList[0].amcCode,
          amount: response.data.dataList[0].amount,
          availableAmount: response.data.dataList[0].availableAmount,
          availableBalanceAmountForSell: response.data.dataList[0].availableBalanceAmountForSell,
          availableBalanceUnitForSell: response.data.dataList[0].availableBalanceUnitForSell,
          availableUnitBal: response.data.dataList[0].availableUnitBal,
          avarageCost: response.data.dataList[0].avarageCost,
          dataDate: response.data.dataList[0].dataDate,
          fundCode: response.data.dataList[0].fundCode,
          fundId: response.data.dataList[0].fundId,
          fundNameEn: response.data.dataList[0].fundNameEn,
          fundNameTh: response.data.dataList[0].fundNameTh,
          fundRisk: response.data.dataList[0].fundRisk,
          navDate: response.data.dataList[0].navDate,
          navValue: response.data.dataList[0].navValue,
          pendingAmount: response.data.dataList[0].pendingAmount,
          pendingUnit: response.data.dataList[0].pendingUnit,
          pledgeUnit: response.data.dataList[0].pledgeUnit,
          unitBalance: response.data.dataList[0].unitBalance,
          unitholderId: response.data.dataList[0].unitholderId,

          derivativeFlag: fundSelect.derivativeFlag,
          ltfFlag: fundSelect.taxType === null ? null : fundSelect.taxType,
          rmfFlag: fundSelect.taxType === null ? null : fundSelect.taxType,
          fifFlag: fundSelect.fifFlag,
          fxRiskFlag: fundSelect.fxRiskFlag
        };
        this.investmentService.selectFundSwich_Out = fundSwich_out
        this.router.navigate(["kk", "fund-management", "transfer-fund"], { queryParams: queryParams });
      }
    }, error => {
      Modal.showAlert(error.responseStatus.responseMessage);
    });
  }


  // OPEN DESCRIPTION FUND AND GET HREF URL PDF DESCRIPTION FUND
  openFund(param) {
    Utils.animate("#containerPDF", "slideInUp");
    const url = this.rootUrl + "/public/idisc/FundDownload/";
    this.fundListSelect = param;

    //check fundClass
    let fundParm = param.fundClass === null || param.fundClass === '' ? param.fundCode : param.fundClass

    if (Environment.isFundFactSheet) {
      this.investmentService.downloadFundFactSheet(url, fundParm).subscribe(response => {
        const file = new Blob([response._body], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        this.srcfilePDFLink = fileURL;
        this.checkFromPDFLink = true;
        this.checkFundFact = true
        this.checkFromFundList = false;
        this.checkSwichFund = false;
      }, error => {
        this.srcfilePDFLink = 'ไม่พบ Fund Fact Sheet'
        this.checkFundFact = false
        this.checkFromPDFLink = true;
        this.checkFromFundList = false;
        this.checkSwichFund = false;
      });
    } else {
      this.openFanfectSheetOffline(fundParm)
    }
  }

  // GET AND DISPLAY PDF IN DIRECTORY LOCAL
  openFanfectSheetOffline(param) {
    this.showMsg = false
    Utils.animate("#containerPDF", "slideInUp");
    const fundClassGetPDF = param.replace('%#', ' ')
    const SRC_PDF = './assets/kiatnakin/fundfactsheet/' + fundClassGetPDF + '.pdf'
    this.srcfilePDFLink = SRC_PDF;
    this.checkFromPDFLink = true;
    this.checkFundFact = true
    this.checkFromFundList = false;
    this.checkSwichFund = false;
    this.http.get(SRC_PDF)
      .subscribe(
        //file found
        () => { this.showMsg = false },
        //file not found
        () => { this.showMsg = true }
      );
  }

  // GET DESCRIPTION CONDITION FUND
  getFundCondition() {
    Utils.animate("#containerCondition", "slideInUp");
    this.investmentService.getFundCondition(this.fundListSelect, 'SI').subscribe(response => {
      if (response.header.success) {
        this.dataFundCondition = response.data.fundConditionMessage;
        this.checkFromConditionFund = true;
        this.checkFromPDFLink = false;
        this.checkFromFundList = false;
        this.checkSwichFund = false;
      }
    }, error => {
      this.dataFundCondition = error.responseStatus.responseMessage;
    });
  }

  // GET DESCRIPTION CONDITION FUND
  orderBuyFund() {
    const queryParams = {
      type: 'SWITCH_IN',
    }
    const fundSwich_in = {
      type: 'SWITCH_IN',
      accountNo: this.fundListSelect.accountNo,
      amcCode: this.fundListSelect.amcCode,
      amount: this.fundListSelect.amount,
      availableAmount: this.fundListSelect.availableAmount,
      availableBalanceAmountForSell: this.fundListSelect.availableBalanceAmountForSell,
      availableBalanceUnitForSell: this.fundListSelect.availableBalanceUnitForSell,
      availableUnitBal: this.fundListSelect.availableUnitBal,
      avarageCost: this.fundListSelect.avarageCost,
      dataDate: this.fundListSelect.dataDate,
      fundCode: this.fundListSelect.fundCode,
      fundId: this.fundListSelect.fundId,
      fundNameEn: this.fundListSelect.fundNameEn,
      fundNameTh: this.fundListSelect.fundNameTh,
      fundRisk: this.fundListSelect.fundRisk,
      navDate: this.fundListSelect.navDate,
      navValue: this.fundListSelect.navValue,
      pendingAmount: this.fundListSelect.pendingAmount,
      pendingUnit: this.fundListSelect.pendingUnit,
      pledgeUnit: this.fundListSelect.pledgeUnit,
      unitBalance: this.fundListSelect.unitBalance,
      unitholderId: this.fundListSelect.unitholderId,

      derivativeFlag: this.fundListSelect.derivativeFlag,
      ltfFlag: this.fundListSelect.taxType === null ? null : this.fundListSelect.taxType,
      rmfFlag: this.fundListSelect.taxType === null ? null : this.fundListSelect.taxType,
      fifFlag: this.fundListSelect.fifFlag,
      fxRiskFlag: this.fundListSelect.fxRiskFlag
    };

    this.investmentService.selectFundSwich_In = fundSwich_in
    this.router.navigate(["kk", "fund-management", "transfer-fund"], { queryParams: queryParams });
  }

  // SCROLL BAR CHECK BUTTON CONDITION FUND
  onScroll(event) {
    this.top = event.target.scrollTop;
    this.offSetHeight = event.target.offsetHeight;
    this.scrollHeight = event.target.scrollHeight;
    if (this.top >= this.scrollHeight - this.offSetHeight) {
      this.disableBtn = false;
    }
  }

  // BACK TO PAGE BEFORE
  onClickBack() {
    if (this.checkFromPDFLink) {
      this.checkFromPDFLink = false;
      this.checkFromFundList = true;
      this.checkSwichFund = true;
    } else if (this.checkFromConditionFund) {
      this.checkFromConditionFund = false;
      this.checkFromFundList = true;
      this.checkSwichFund = true;
    } else {
      this.location.back();
    }
  }

  // onClickBack() {
  //   this.location.back();
  // }
}