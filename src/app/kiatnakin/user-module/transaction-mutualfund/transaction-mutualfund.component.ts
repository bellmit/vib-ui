import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location, DatePipe } from '@angular/common';

import { DataService } from '../../_service/data.service';
import { Utils } from '../../../share/utils';
import { Modal } from '../../_share/modal-dialog/modal-dialog.component';
import { MutualfundAcountService } from '../../_service/api/mutualfund-account.service';

@Component({
  selector: 'transaction-mutualfund',
  templateUrl: './transaction-mutualfund.component.html',
  styleUrls: ['./transaction-mutualfund.component.sass'],
  providers: [MutualfundAcountService]
})

export class TransactionMutualfundComponent implements OnInit {
  outstandingList;
  unitHolderId;
  unitHolderName;
  netAssetValue = 0;
  netProfit = 0;
  netAssetValueStr = '';
  netProfitStr = '';
  imgPart: string = './assets/kiatnakin/image/';

  constructor(
    private router: Router,
    public dataService: DataService,
    public mutualfundAcountService: MutualfundAcountService
  ) { }

  ngOnInit() {
    this.unitHolderId = this.dataService.selectedMutualfundAccount.unitHolderId;
    this.unitHolderName = this.dataService.selectedMutualfundAccount.unitHolderName;
    this.getOutstandingList(this.unitHolderId);
    Utils.animate('#container', 'slideInUp');
  }

  getOutstandingList(unitHolderId) {
    Modal.showProgress();
    this.mutualfundAcountService.getOutstandingList(unitHolderId).subscribe(
      res => {
        // res.data.dataList = [
        //   {
        //     accountNo: "0513339002"
        //     amcCode: "PHAT"
        //     amount: 15000000
        //     availableAmount: 15000000
        //     availableBalanceAmountForSell: 15000000
        //     availableBalanceUnitForSell: 10050.5431
        //     availableUnitBal: 10050.5431
        //     avarageCost: 0
        //     dataDate: "26/07/2019"
        //     fundCode: "PHATRA MP"
        //     fundId: "284"
        //     fundNameEn: "PHATRA MONEY POSITIVE FUND"
        //     fundNameTh: "กองทุนเปิดภัทร มันนี่ โพสิทีฟ"
        //     fundRisk: "1"
        //     navDate: "12/07/2019"
        //     navValue: 100
        //     pendingAmount: 0
        //     pendingUnit: 0
        //     pledgeUnit: 0
        //     unitBalance: 10050.5431
        //     unitholderId: "8685408000036"
        //   }
        // ]

        this.outstandingList = res.data ? res.data.dataList : null;

        // hack is here --- bass below ---
        // this.outstandingList = [
        //   {
        //     accountNo: '0513339002',
        //     amcCode: 'PHAT',
        //     amount: 15000000,
        //     availableAmount: 15000000,
        //     availableBalanceAmountForSell: 15000000,
        //     availableBalanceUnitForSell: 10050.5431,
        //     availableUnitBal: 10050.5431,
        //     avarageCost: 0,
        //     dataDate: '26/07/2019',
        //     fundCode: 'PHATRA MP',
        //     fundId: '284',
        //     fundNameEn: 'PHATRA MONEY POSITIVE FUND',
        //     fundNameTh: 'กองทุนเปิดภัทร มันนี่ โพสิทีฟ',
        //     fundRisk: '1',
        //     navDate: '12/07/2019',
        //     navValue: 100,
        //     pendingAmount: 0,
        //     pendingUnit: 0,
        //     pledgeUnit: 0,
        //     unitBalance: 10050.5431,
        //     unitholderId: '8685408000036'
        //   },
        //   {
        //     accountNo: '0513339002',
        //     amcCode: 'PHAT',
        //     amount: 15000000,
        //     availableAmount: 15000000,
        //     availableBalanceAmountForSell: 15000000,
        //     availableBalanceUnitForSell: 10050.5431,
        //     availableUnitBal: 10050.5431,
        //     avarageCost: 0,
        //     dataDate: '26/07/2019',
        //     fundCode: 'PHATRA MP',
        //     fundId: '284',
        //     fundNameEn: 'PHATRA MONEY POSITIVE FUND',
        //     fundNameTh: 'กองทุนเปิดภัทร มันนี่ โพสิทีฟ',
        //     fundRisk: '1',
        //     navDate: '12/07/2019',
        //     navValue: 100,
        //     pendingAmount: 0,
        //     pendingUnit: 0,
        //     pledgeUnit: 0,
        //     unitBalance: 10050.5431,
        //     unitholderId: '8685408000036'
        //   },
        //   {
        //     accountNo: '0513339002',
        //     amcCode: 'PHAT',
        //     amount: 15000000,
        //     availableAmount: 15000000,
        //     availableBalanceAmountForSell: 15000000,
        //     availableBalanceUnitForSell: 10050.5431,
        //     availableUnitBal: 10050.5431,
        //     avarageCost: 0,
        //     dataDate: '26/07/2019',
        //     fundCode: 'PHATRA MP',
        //     fundId: '284',
        //     fundNameEn: 'PHATRA MONEY POSITIVE FUND',
        //     fundNameTh: 'กองทุนเปิดภัทร มันนี่ โพสิทีฟ',
        //     fundRisk: '1',
        //     navDate: '12/07/2019',
        //     navValue: 100,
        //     pendingAmount: 0,
        //     pendingUnit: 0,
        //     pledgeUnit: 0,
        //     unitBalance: 10050.5431,
        //     unitholderId: '8685408000036'
        //   },
        //   {
        //     accountNo: '0513339002',
        //     amcCode: 'PHAT',
        //     amount: 15000000,
        //     availableAmount: 15000000,
        //     availableBalanceAmountForSell: 15000000,
        //     availableBalanceUnitForSell: 10050.5431,
        //     availableUnitBal: 10050.5431,
        //     avarageCost: 0,
        //     dataDate: '26/07/2019',
        //     fundCode: 'PHATRA MP',
        //     fundId: '284',
        //     fundNameEn: 'PHATRA MONEY POSITIVE FUND',
        //     fundNameTh: 'กองทุนเปิดภัทร มันนี่ โพสิทีฟ',
        //     fundRisk: '1',
        //     navDate: '12/07/2019',
        //     navValue: 100,
        //     pendingAmount: 0,
        //     pendingUnit: 0,
        //     pledgeUnit: 0,
        //     unitBalance: 10050.5431,
        //     unitholderId: '8685408000036'
        //   },
        //   {
        //     accountNo: '0513339002',
        //     amcCode: 'PHAT',
        //     amount: 15000000,
        //     availableAmount: 15000000,
        //     availableBalanceAmountForSell: 15000000,
        //     availableBalanceUnitForSell: 10050.5431,
        //     availableUnitBal: 10050.5431,
        //     avarageCost: 0,
        //     dataDate: '26/07/2019',
        //     fundCode: 'PHATRA MP',
        //     fundId: '284',
        //     fundNameEn: 'PHATRA MONEY POSITIVE FUND',
        //     fundNameTh: 'กองทุนเปิดภัทร มันนี่ โพสิทีฟ',
        //     fundRisk: '1',
        //     navDate: '12/07/2019',
        //     navValue: 100,
        //     pendingAmount: 0,
        //     pendingUnit: 0,
        //     pledgeUnit: 0,
        //     unitBalance: 10050.5431,
        //     unitholderId: '8685408000036'
        //   },
        //   {
        //     accountNo: '0513339002',
        //     amcCode: 'PHAT',
        //     amount: 15000000,
        //     availableAmount: 15000000,
        //     availableBalanceAmountForSell: 15000000,
        //     availableBalanceUnitForSell: 10050.5431,
        //     availableUnitBal: 10050.5431,
        //     avarageCost: 0,
        //     dataDate: '26/07/2019',
        //     fundCode: 'PHATRA MP',
        //     fundId: '284',
        //     fundNameEn: 'PHATRA MONEY POSITIVE FUND',
        //     fundNameTh: 'กองทุนเปิดภัทร มันนี่ โพสิทีฟ',
        //     fundRisk: '1',
        //     navDate: '12/07/2019',
        //     navValue: 100,
        //     pendingAmount: 0,
        //     pendingUnit: 0,
        //     pledgeUnit: 0,
        //     unitBalance: 10050.5431,
        //     unitholderId: '8685408000036'
        //   }
        // ];

        // this.outstandingList = null
        // hack is here --- bass above ---

        if (this.outstandingList) {
          this.outstandingList.forEach((item, index) => {
            item.avarageCostStr = this.numberWithCommas(item.avarageCost.toFixed(2));
            item.unitBalanceStr = this.numberWithCommas(item.unitBalance.toFixed(2));
            item.navValueStr = this.numberWithCommas(item.navValue.toFixed(2));

            item.individualAssetValue = item.unitBalance * item.navValue;
            item.individualAssetValueStr = this.numberWithCommas(item.individualAssetValue.toFixed(2));

            item.individualCost = item.unitBalance * item.avarageCost;
            item.individualCostStr = this.numberWithCommas(item.individualCost.toFixed(2));

            // item.individualProfit = item.individualAssetValue - 999999;
            // item.individualProfit = 0;
            // item.individualProfit = item.individualAssetValue - 999999999999999;
            item.individualProfit = item.individualAssetValue - item.individualCost;
            item.individualProfitStr = this.numberWithCommas(item.individualProfit.toFixed(2));

            this.netAssetValue += item.individualAssetValue;
            this.dataService.netProfit = this.netProfit += item.individualProfit;
          });
          this.dataService.netAssetValueStr = this.netAssetValueStr = this.numberWithCommas(this.netAssetValue.toFixed(2));
          this.dataService.netProfitStr = this.netProfitStr = this.numberWithCommas(this.netProfit.toFixed(2));
        } else {
          this.dataService.netAssetValueStr = '0.00'
          this.dataService.netProfitStr = '0.00'
        }
      },
      error => {
        Modal.showAlert(error.responseStatus.responseMessage);
      },
      () => {
        Modal.hide();
      }
    );
  }

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  onClickBack() {
    Utils.animate('#container', 'slideOutDown').then(() =>
      this.router.navigate(['kk', 'selectMutualfundAccount'])
    );
  }

  onClickMainMenu() {
    Utils.animate('#container', 'slideOutDown').then(() =>
      this.router.navigate(['/kk'])
    );
  }

  onClickNAV(selectedOutstanding) {
    this.dataService.selectedOutstanding = selectedOutstanding;
    Utils.animate('#container', 'slideOutDown').then(() =>
      this.router.navigate(['kk', 'navDetail'])
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
