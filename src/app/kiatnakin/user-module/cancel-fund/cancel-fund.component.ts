import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Location, DatePipe } from '@angular/common';

import { DataService } from '../../_service/data.service';
import { UserService } from '../../_service/user.service';

import { Utils } from '../../../share/utils';
import { Modal } from '../../_share/modal-dialog/modal-dialog.component';
import { MutualfundAcountService } from '../../_service/api/mutualfund-account.service';
import * as moment from 'moment';

@Component({
  selector: 'cancel-fund',
  templateUrl: './cancel-fund.component.html',
  styleUrls: ['./cancel-fund.component.sass'],
  providers: [MutualfundAcountService]
})
export class CancelFundComponent implements OnInit, OnDestroy {

  fundData;
  transactionHistoryList: any = [];
  unitHolderId;
  unitHolderName;
  netAssetValue = 0;
  netProfit = 0;
  netAssetValueStr = '';
  netProfitStr = '';
  checkBTN = false;
  imgPart: string = './assets/kiatnakin/image/';

  constructor(
    private router: Router,
    public dataService: DataService,
    private location: Location,
    public userService: UserService,
    public mutualfundAcountService: MutualfundAcountService
  ) { }

  ngOnInit() {
    this.unitHolderId = this.dataService.selectedMutualfundAccount.unitHolderId;
    this.unitHolderName = this.dataService.selectedMutualfundAccount.unitHolderName;
    this.netProfit = this.dataService.netProfit;
    this.netAssetValueStr = this.dataService.netAssetValueStr;
    this.netProfitStr = this.dataService.netProfitStr;
    this.getInquiryTransactionHistory();
    Utils.animate('#speech', 'fadeIn');
    Utils.animate('#container', 'slideInUp');
  }

  ngOnDestroy() { }

  onClickBack() {
    Utils.animate('#speech', 'fadeOut');
    Utils.animate('#container', 'slideOutDown').then(() =>
      this.location.back()
    );
  }

  onClickMainMenu() {
    Utils.animate('#speech', 'fadeOut');
    Utils.animate('#container', 'slideOutDown').then(() =>
      this.router.navigate(['/kk'])
    );
  }

  getInquiryTransactionHistory() {
    Modal.showProgress();
    this.mutualfundAcountService.inquiryTransactionHistory(this.unitHolderId).subscribe(
      res => {
        // console.log('getInquiryTransactionHistory --- bass res ->', res);

        // res.data.transactionHistoryList = [
        //   {
        //     "amcCode": "PTAM",
        //     "amcName": "บลจ. ภัทร",
        //     "fundCode": "PHATRA MP",
        //     "fundName": "กองทุนเปิดภัทร มันนี่ โพสิทีฟ",
        //     "toFundCode": null,
        //     "toFundName": null,
        //     "transStatus": "Confirmed",
        //     "transDate": "24/09/2019",
        //     "transType": "Purchase",
        //     "transSubStatus": null,
        //     "amount": "1000",
        //     "unit": "0",
        //     "confirmedDate": null,
        //     "confirmedUnit": "0",
        //     "confirmedAmount": "0",
        //     "effectiveDate": "24/09/2019",
        //     "mutualFundRef": "176190924172249016",
        //     "referenceNo": "20190924172346147",
        //     "orderDate": "24/09/2019 17:22:49",
        //     "confirmedNav": "0",
        //     "channelCode": null,
        //     "channelName": "RIB Mobile."
        //   },
        //   {
        //     "amcCode": "PTAM",
        //     "amcName": "บลจ. ภัทร",
        //     "fundCode": "PHATRA ACT EQ",
        //     "fundName": "กองทุนเปิดภัทร แอ็กทิฟ อิควิตี้",
        //     "toFundCode": null,
        //     "toFundName": null,
        //     "transStatus": "Failed Pay",
        //     "transDate": "24/09/2019",
        //     "transType": "Purchase",
        //     "transSubStatus": null,
        //     "amount": "1000",
        //     "unit": "0",
        //     "confirmedDate": null,
        //     "confirmedUnit": "0",
        //     "confirmedAmount": "0",
        //     "effectiveDate": "24/09/2019",
        //     "mutualFundRef": "176190924153655106",
        //     "referenceNo": "20190924153751757",
        //     "orderDate": "24/09/2019 15:36:55",
        //     "confirmedNav": "0",
        //     "channelCode": null,
        //     "channelName": "RIB Mobile."
        //   },
        //   {
        //     "amcCode": "PTAM",
        //     "amcName": "บลจ. ภัทร",
        //     "fundCode": "PHATRA ACT EQ",
        //     "fundName": "กองทุนเปิดภัทร แอ็กทิฟ อิควิตี้",
        //     "toFundCode": null,
        //     "toFundName": null,
        //     "transStatus": "Waiting",
        //     "transDate": "24/09/2019",
        //     "transType": "Purchase",
        //     "transSubStatus": null,
        //     "amount": "1000",
        //     "unit": "0",
        //     "confirmedDate": null,
        //     "confirmedUnit": "0",
        //     "confirmedAmount": "0",
        //     "effectiveDate": "24/09/2019",
        //     "mutualFundRef": "176190924152241330",
        //     "referenceNo": "20190924152337896",
        //     "orderDate": "24/09/2019 15:22:41",
        //     "confirmedNav": "0",
        //     "channelCode": null,
        //     "channelName": "RIB Mobile."
        //   },
        //   {
        //     "amcCode": "PTAM",
        //     "amcName": "บลจ. ภัทร",
        //     "fundCode": "PHATRA ACT EQ",
        //     "fundName": "กองทุนเปิดภัทร แอ็กทิฟ อิควิตี้",
        //     "toFundCode": null,
        //     "toFundName": null,
        //     "transStatus": "Failed Aprrove",
        //     "transDate": "24/09/2019",
        //     "transType": "Purchase",
        //     "transSubStatus": null,
        //     "amount": "1000",
        //     "unit": "0",
        //     "confirmedDate": null,
        //     "confirmedUnit": "0",
        //     "confirmedAmount": "0",
        //     "effectiveDate": "24/09/2019",
        //     "mutualFundRef": "176190924140640152",
        //     "referenceNo": "20190924140737556",
        //     "orderDate": "24/09/2019 14:06:41",
        //     "confirmedNav": "0",
        //     "channelCode": null,
        //     "channelName": "RIB Mobile."
        //   }
        // ]

        this.checkBTN = true;
        this.transactionHistoryList = res.data ? res.data.transactionHistoryList : null;
        // this.transactionHistoryList = [
        // {
        //   "amcCode": "PTAM",
        //   "amcName": "บลจ. ภัทร",
        //   "fundCode": "PHATRA MP",
        //   "fundName": "กองทุนเปิดภัทร มันนี่ โพสิทีฟ",
        //   "toFundCode": null,
        //   "toFundName": null,
        //   "transStatus": "Confirmed",
        //   "transDate": "24/09/2019",
        //   "transType": "Purchase",
        //   "transSubStatus": null,
        //   "amount": "1000",
        //   "unit": "0",
        //   "confirmedDate": null,
        //   "confirmedUnit": "0",
        //   "confirmedAmount": "0",
        //   "effectiveDate": "12/11/2019",
        //   "mutualFundRef": "176190924172249016",
        //   "referenceNo": "20190924172346147",
        //   "orderDate": "24/09/2019 17:22:49",
        //   "confirmedNav": "0",
        //   "channelCode": null,
        //   "channelName": "RIB Mobile.",
        //   'accountNo': '123456789'
        // },
        // {
        //   "amcCode": "PTAM",
        //   "amcName": "บลจ. ภัทร",
        //   "fundCode": "PHATRA ACT EQ",
        //   "fundName": "กองทุนเปิดภัทร แอ็กทิฟ อิควิตี้",
        //   "toFundCode": null,
        //   "toFundName": null,
        //   "transStatus": "Failed Pay",
        //   "transDate": "24/09/2019",
        //   "transType": "Purchase",
        //   "transSubStatus": null,
        //   "amount": "1000",
        //   "unit": "0",
        //   "confirmedDate": null,
        //   "confirmedUnit": "0",
        //   "confirmedAmount": "0",
        //   "effectiveDate": "12/11/2019",
        //   "mutualFundRef": "176190924153655106",
        //   "referenceNo": "20190924153751757",
        //   "orderDate": "24/09/2019 15:36:55",
        //   "confirmedNav": "0",
        //   "channelCode": null,
        //   "channelName": "RIB Mobile.",
        //   'accountNo': '1234567'
        // },
        // {
        //   "amcCode": "PTAM",
        //   "amcName": "บลจ. ภัทร",
        //   "fundCode": "PHATRA ACT EQ",
        //   "fundName": "กองทุนเปิดภัทร แอ็กทิฟ อิควิตี้",
        //   "toFundCode": null,
        //   "toFundName": null,
        //   "transStatus": "Waiting",
        //   "transDate": "24/09/2019",
        //   "transType": "Purchase",
        //   "transSubStatus": null,
        //   "amount": "1000",
        //   "unit": "0",
        //   "confirmedDate": null,
        //   "confirmedUnit": "0",
        //   "confirmedAmount": "0",
        //   "effectiveDate": "12/11/2019",
        //   "mutualFundRef": "176190924152241330",
        //   "referenceNo": "20190924152337896",
        //   "orderDate": "24/09/2019 15:22:41",
        //   "confirmedNav": "0",
        //   "channelCode": null,
        //   "channelName": "VIB",
        //   'accountNo': '1234567'
        // },
        //   {
        //     "amcCode": "PTAM",
        //     "amcName": "บลจ. ภัทร",
        //     "fundCode": "PHATRA ACT EQ",
        //     "fundName": "กองทุนเปิดภัทร แอ็กทิฟ อิควิตี้",
        //     "toFundCode": null,
        //     "toFundName": null,
        //     "transStatus": "Failed Aprrove",
        //     "transDate": "24/09/2019",
        //     "transType": "Purchase",
        //     "transSubStatus": null,
        //     "amount": "1000",
        //     "unit": "0",
        //     "confirmedDate": null,
        //     "confirmedUnit": "0",
        //     "confirmedAmount": "0",
        //     "effectiveDate": "12/11/2019",
        //     "mutualFundRef": "176190924140640152",
        //     "referenceNo": "20190924140737556",
        //     "orderDate": "24/09/2019 14:06:41",
        //     "confirmedNav": "0",
        //     "channelCode": null,
        //     "channelName": "RIB Mobile.",
        //     'accountNo': '123456'
        //   }
        // ]
      }, error => {
        this.transactionHistoryList = 'ไม่พบข้อมูล'
      }, () => {
        Modal.hide();
      });
  }

  onClickSubmitCancelFund(fund) {
    // fund.momentDate = moment().format('DD/MM/YYYY');
    // fund.momentTime = moment().format("hh:mm");
    // Utils.animate('#container', 'slideOutDown').then(() =>
    //   this.router.navigate(
    //     ["kk", "fund-management", "transfer-fund"],
    //     {
    //       queryParams: {
    //         showSuccessWithMessage: true,
    //         momentDate: fund.momentDate,
    //         momentTime: fund.momentTime,
    //         fundCode: fund.fundCode,
    //         transType: fund.transType,
    //         amount: fund.amount,
    //         mutualFundRef: fund.mutualFundRef,
    //         effectiveDate: fund.effectiveDate
    //     }
    //   })
    // );

    Modal.showProgress();
    this.mutualfundAcountService.submitCancelFund(fund).subscribe(
      res => {
        console.log('onClickSubmitCancelFund --- bass res ->', res);

        fund.momentDate = moment(res.data.txnDate, 'DD/MM/YYYY HH:mm:ss').locale('th').format('DD/MM/YYYY');
        fund.momentTime = moment(res.data.txnDate, 'DD/MM/YYYY HH:mm:ss').locale('th').format("HH:mm");
        Utils.animate('#container', 'slideOutDown').then(() =>
          this.router.navigate(["kk", "fund-management", "transfer-fund"], {
            queryParams: {
              type: 'CANCEL',
              showSuccessWithMessage: true,
              momentDate: fund.momentDate,
              momentTime: fund.momentTime,
              fundCode: fund.fundCode,
              toFundCode: fund.toFundCode,
              transType: fund.transType,
              amount: fund.amount,
              unit: fund.unit,
              mutualFundRef: fund.mutualFundRef,
              effectiveDate: fund.effectiveDate,
              accountNo: fund.accountNo
            }
          })
        );
      },
      error => {
        Modal.showAlertMfs(error.responseStatus.responseMessage);
      },
      () => {
        Modal.hide();
      }
    );

  }

  onClickSubmit() {
    if ($("input[id^='fund_']:checked").val()) {
      let fund = JSON.parse($("input[id^='fund_']:checked").val());
      Modal.showConfirmMfsWhite('ต้องการยกเลิกรายการใช่หรือไม่', null, () => {
        this.onClickSubmitCancelFund(fund);
      });
    } else {
      Modal.showAlert('กรุณาเลือกรายการ');
    }
  }
}
