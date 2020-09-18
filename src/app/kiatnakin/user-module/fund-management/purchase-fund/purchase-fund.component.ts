import { Injectable, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, DatePipe } from '@angular/common';
import { Http } from '@angular/http';
import { InvestmentService } from '../../../_service/api/investment.service';
import { DataService } from '../../../_service/data.service';
import { MutualfundAcountService } from '../../../_service/api/mutualfund-account.service';
import { UserService } from "../../../_service/user.service";
import { Modal } from '../../../_share/modal-dialog/modal-dialog.component';
import { Utils, Environment } from "../../../../share/utils";
import { tap } from 'rxjs/operators';

@Component({
  selector: 'purchase-fund',
  templateUrl: './purchase-fund.component.html',
  styleUrls: ['./purchase-fund.component.sass'],
  providers: [MutualfundAcountService]
})
export class PurchaseFundComponent implements OnInit {
  headers: any = [];
  constructor(
    public http: Http,
    private router: Router,
    private location: Location,
    private investmentService: InvestmentService,
    private activatedRoute: ActivatedRoute,
    public dataService: DataService,
    private mutualfundAcountService: MutualfundAcountService,
    private userService: UserService,
  ) { }
  imgPart: string = './assets/kiatnakin/image/';
  rootUrl = '/GET_HREF_LINK_PDF';
  unitHolderId: any = [];
  unitHolderName: any = [];
  unitHolderData: any = [];
  fundListSelect: any = [];
  outStandingLists: any = [];
  fundLists: any = [];
  fundListAll: any = [];
  srcfilePDFLink: any = [];
  dataFundCondition: any = [];
  outStandingID: any = [];
  // fundCode = 'PHATRA ACT EQ';
  maginTopClass = ''
  showMsg = false;
  checkFromPDFLink = false;
  checkFromConditionFund = false;
  checkFromFundList = true;
  checkInquiryOutstanding = true;
  checkFundFact = true;
  disableBtn: boolean = true;
  top: number;
  offSetHeight: number;
  scrollHeight: number;

  ngOnInit() {
    this.unitHolderId = this.dataService.selectedMutualfundAccount.unitHolderId;
    this.unitHolderName = this.dataService.selectedMutualfundAccount.unitHolderName;
    this.getInquiryOutstanding(this.unitHolderId)
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
    $('#frame').sly(options);
    $('#frameOut').sly(options);
  }

  // GET DATA INQUIRY OUT STANDING LIST
  getInquiryOutstanding(unitHolderId) {
    this.investmentService.getInquiryOutstanding(unitHolderId).subscribe(response => {
      if (response.data === null || response.data.length === 0) {
        this.checkInquiryOutstanding = false;
        this.maginTopClass = 'speechbuyfund'
      } else {
        this.maginTopClass = 'speech'
        this.checkInquiryOutstanding = true;
        this.outStandingLists = response.data.dataList.filter(d => d.fundAllowance.some(a => a.isAllow === "BU"))
      }
      this.getFundList();
    }, error => {
      Modal.showAlert(error.responseStatus.responseMessage);
    }, () => {
      Modal.hide();
      setTimeout(() => {
        $('#frameOut').sly('reload');
      }, 100);
    })
  }

  // GET DATA FUND LIST
  getFundList() {
    this.investmentService.getInquiryFundList('BU').subscribe(response => {
      this.fundListAll = response.data.fundData;
      if (this.checkInquiryOutstanding) {
        this.outStandingID = this.outStandingLists.map(out => out.fundId)
        this.fundLists = response.data.fundData.filter(fund => !this.outStandingID.includes(fund.fundId))
      } else {
        this.fundLists = response.data.fundData.map(fund => { return fund; });
      }
    }, error => {
      Modal.showAlert(error.responseStatus.responseMessage);
    }, () => {
      Modal.hide();
      setTimeout(() => {
        $('#frame').sly('reload');
      }, 100);
    })
  }

  // OPEN DESCRIPTION FUND AND GET HREF URL PDF DESCRIPTION FUND
  openFund(param) {
    Utils.animate("#containerPDF", "slideInUp");
    const url = this.rootUrl + "/public/idisc/FundDownload/";

    //get fund detail by fundcode
    this.fundListSelect = this.fundListAll.filter(data => {
      return data.fundCode === param.fundCode
    });
    
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
        this.checkInquiryOutstanding = false;
      }, error => {
        this.srcfilePDFLink = 'ไม่พบ Fund Fact Sheet'
        this.checkFundFact = false
        this.checkFromPDFLink = true;
        this.checkFromFundList = false;
        this.checkInquiryOutstanding = false;
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
    this.checkInquiryOutstanding = false;
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
    this.investmentService.getFundCondition(this.fundListSelect, 'BU').subscribe(response => {
      if (response.header.success) {
        this.dataFundCondition = response.data.fundConditionMessage;
        this.checkFromConditionFund = true;
        this.checkFromPDFLink = false;
        this.checkFromFundList = false;
        this.checkInquiryOutstanding = false;
      }
    }, error => {
      this.dataFundCondition = error.responseStatus.responseMessage;
    });
  }

  // GET DESCRIPTION CONDITION FUND
  orderBuyFund() {
    this.investmentService.selectFund = this.fundListSelect;
    this.investmentService.unitHolderId = this.unitHolderData;
    this.router.navigate(["kk", "fund-management", "transfer-fund"]);
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
      this.checkInquiryOutstanding = true;
    } else if (this.checkFromConditionFund) {
      this.checkFromConditionFund = false;
      this.checkFromFundList = true;
      this.checkInquiryOutstanding = true;
    } else {
      this.location.back();
    }
  }
}