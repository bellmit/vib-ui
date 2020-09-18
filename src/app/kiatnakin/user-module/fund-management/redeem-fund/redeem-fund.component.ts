import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, DatePipe } from '@angular/common';
import { DataService } from '../../../_service/data.service';
import { InvestmentService } from '../../../_service/api/investment.service';
import { Modal } from '../../../_share/modal-dialog/modal-dialog.component';
import { Utils, Environment } from "../../../../share/utils";


@Component({
  selector: 'redeem-fund',
  templateUrl: './redeem-fund.component.html',
  styleUrls: ['./redeem-fund.component.sass']
})
export class RedeemFundComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    public dataService: DataService,
    private investmentService: InvestmentService,
  ) { }
  unitHolderId: any = [];
  unitHolderName: any = [];
  outStandingLists: any = [];
  fundLists: any = [];
  paramType: any = [];
  dataFundCondition: any = [];
  dataFundSelect: any = [];
  fundListFilterOut: any = [];

  checkFromConditionFund = false;
  checkFromFundList = true;

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.paramType = params.type;
    });
    this.unitHolderId = this.dataService.selectedMutualfundAccount.unitHolderId;
    this.unitHolderName = this.dataService.selectedMutualfundAccount.unitHolderName;
    this.getInquiryOutstanding();
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
  getInquiryOutstanding() {
    this.investmentService.getInquiryOutstanding(this.unitHolderId).subscribe(response => {
      if (response.data === null || response.data.length === 0) {
        this.outStandingLists = ''
      } else {
        this.outStandingLists = response.data.dataList.filter(d => d.fundAllowance.some(a => a.isAllow === "SE")).map(out => out.fundId);
      }
      this.getInquiryFundList();
    }, error => {
      Modal.showAlert(error.responseStatus.responseMessage);
    }, () => {
      Modal.hide();
    });
  }

  // GET DATA INQUIRY FUND LIST BY TYPE 'SE'
  getInquiryFundList() {
    const type = 'SE';
    this.investmentService.getInquiryFundList(type).subscribe(response => {
      if (response.header.success) {
        this.fundListFilterOut = response.data.fundData.filter(fund => this.outStandingLists.includes(fund.fundId))
        this.fundLists = this.fundListFilterOut.filter(res => {
          return res.taxType !== 'LTF' && res.taxType !== 'RMF'
        });
      } else {
        Modal.showAlert(response.responseStatus.responseMessage);
      }
    }, error => {
      Modal.showAlert(error.responseStatus.responseMessage);
    }, () => {
      Modal.hide();
      setTimeout(() => {
        $('#frame').sly('reload');
        $('#frameOut').sly('reload');
      }, 100);
    })
  }

  selectFund(fundSelect) {
    this.investmentService.getInquiryOutstanding(this.unitHolderId, fundSelect.fundId).subscribe(response => {
      if (response.header.success) {
        const queryParams = {
          type: 'REDEEM',
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
        // console.log('REDEEM FUND QUERY', queryParams)
        this.router.navigate(["kk", "fund-management", "transfer-fund"], { queryParams: queryParams });
      }
    });
  }

  onClickBack(type = '') {
    if (type === 'REDEEM') {
      this.router.navigate(["kk", "transactiontype"]);
    } else {
      this.location.back();
    }
  }
}
