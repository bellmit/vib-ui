import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BankAccount } from '../../_model/bankAccount';
import { DataService } from '../../_service/index';
import { MutualfundAcountService } from '../../_service/api/mutualfund-account.service';
import { isNullOrUndefined } from 'util';
import { Transfer } from '../../_model/transfer';
import { Modal } from '../../_share/modal-dialog/modal-dialog.component';
import { Utils } from '../../../share/utils';
import { Bank } from '../../_model/bank';
import { Location } from '@angular/common';
import { ReceiveType } from '../../_model/transaction';
import { AppConstant } from '../../../share/app.constant';

@Component({
  selector: 'select-mutualfund-account',
  templateUrl: './select-mutualfund-account.component.html',
  styleUrls: ['./select-mutualfund-account.component.sass'],
  providers: [MutualfundAcountService, AppConstant]
})
export class SelectMutualfundAccountComponent implements OnInit {
  mutualfundAccountList;
  imgPart: string = './assets/kiatnakin/image/';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private mutualfundAcountService: MutualfundAcountService,
    private location: Location,
    private dataService: DataService,
    private appconstant: AppConstant
  ) { }

  ngOnInit() {
    this.initObject();
    Utils.animate('#speech', 'fadeIn')
    this.getMutualfundAccount();
  }

  getMutualfundAccount() {
    Modal.showProgress();
    const that = this;
    this.mutualfundAcountService.getMutualfundAccountList().subscribe(
      res => {
        console.log('SelectMutualfundAccountComponent --- bass res ->', res);

        // res.data.unitHolder = [
        //   {
        //     "unitHolderId": "8685408000036",
        //     "unitHolderName": "Mr. Tanatan Easy"
        //   }
        // ]

        this.mutualfundAccountList = res.data ? res.data.unitHolder : null;

        // hack is here --- bass below ---
        // this.mutualfundAccountList = [
        //   {
        //     unitHolderId: '8685408000036',
        //     unitHolderName: 'Mr. Tanatan Easy'
        //   },
        //   {
        //     unitHolderId: '8685408000036',
        //     unitHolderName: 'Mr. Tanatan Easy'
        //   },
        //   {
        //     unitHolderId: '8685408000036',
        //     unitHolderName: 'Mr. Tanatan Easy'
        //   },
        //   {
        //     unitHolderId: '8685408000036',
        //     unitHolderName: 'Mr. Tanatan Easy'
        //   },
        //   {
        //     unitHolderId: '8685408000036',
        //     unitHolderName: 'Mr. Tanatan Easy'
        //   },
        //   {
        //     unitHolderId: '8685408000036',
        //     unitHolderName: 'Mr. Tanatan Easy'
        //   }
        // ];
        // hack is here --- bass above ---

        if (this.mutualfundAccountList) {
          this.mutualfundAccountList.forEach((item, index) => {
            if (item.unitHolderId) {
              item.unitHolderIdCensored =
                item.unitHolderId.substring(0, 4) +
                'xx' +
                item.unitHolderId.substring(
                  item.unitHolderId.length - 1 - 1,
                  item.unitHolderId.length
                );
            }
          });
        }
      },
      error => {
        // Modal.showAlert(error.responseStatus.responseMessage);
        Modal.showAlertWithOk(error.responseStatus.responseMessage, () => {
          this.router.navigate(["/kk"]);
        });
      },
      () => {
        Modal.hide();
        setTimeout(() => {
          $('#frame').sly('reload');
        }, 100);
      }
    );
  }

  initObject() {
    const options = {
      horizontal: true,

      //Item base navigation
      itemNav: 'centered', // 'basic','centered','forceCentered'
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
  }

  onSelectedMutualfundAccount(selectedMutualfundAccount) {
    console.log('selectedMutualfundAccount ->', selectedMutualfundAccount);
    const that = this;
    const selectedId = `#mutualfund-account-${selectedMutualfundAccount.unitHolderId}`;
    const unSelectedId = `[id^='mutualfund-account-']:not('${selectedId}')`;
    const animation = 'zoomOutDown';

    Utils.animate('#speech', 'fadeOut');

    Utils.animate(unSelectedId, animation)
      .then(() => {
        that.dataService.selectedMutualfundAccount = selectedMutualfundAccount;

        setTimeout(() => {
          that.router.navigate(['kk', 'transactionMutualfund']);
        }, 500);
      })
      .catch(error => {
        console.log('error', error);
      });
  }

  onClickBack() {
    const anyId = `[id^='mutualfund-account-']`;
    const animation = 'zoomOutDown';

    Utils.animate('#speech', 'fadeOut');
    Utils.animate(anyId, animation).then(() =>
      this.router.navigate(['kk', 'transactiontype'])
    )
  }

}
