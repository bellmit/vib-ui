import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import {BankAccount} from "../../_model/bankAccount";
import {PaymentType} from "../../_model/transaction";
import {Router} from "@angular/router";
import {AccountService} from "../../_service/api/account.service";
import {KeyboardService} from "../../_service/keyboard.service";
import {TranslateService} from "ng2-translate";
import {DataService} from "../../_service/index";
import {Modal} from "../../_share/modal-dialog/modal-dialog.component";
import {isNullOrUndefined} from "util";
import {Withdraw} from "../../_model/withdraw";
import { AppConstant } from 'app/share/app.constant';

@Component({
    selector: 'select-bank-account-by-number',
    templateUrl: './select-bank-account-by-number.component.html',
    styleUrls: ['./select-bank-account-by-number.component.sass']
})
export class SelectBankAccountByNumberComponent implements OnInit {

    @Output() selectedAccount: EventEmitter<BankAccount> = new EventEmitter<BankAccount>();
    @Input() queryParams: Map<string, string>;
    accountNumber: string = "";
    @Input() showLogin: boolean;

    constructor(private router: Router,
                private dataService: DataService,
                private accountService: AccountService,
                private translate: TranslateService) {
    }

    ngOnInit() {
        setTimeout(() => {
            KeyboardService.initKeyboardInputText();
        }, 500);

        if (isNullOrUndefined(this.showLogin)) {
            this.showLogin = true;
        }
    }

    public onSelectedAccount(accountNumber) {

        if (!isNullOrUndefined(this.dataService.transaction.to)) {
            const sourceAccountNumber = this.dataService.transaction.to.accountNumber;
            if (sourceAccountNumber === accountNumber) {
                Modal.showAlert("ไม่สามารถระบุหมายเลขบัญชีที่เหมือนปลายทาง กรุณาทำรายการใหม่อีกครั้ง");
                return;
            }
        }

        if (accountNumber.substring(0, 1) === '3') { // TD

            Modal.showProgress();
            this.accountService
                .getAccountTDDetail(accountNumber)
                .subscribe(
                    (bankAccount: BankAccount) => {
                        Modal.hide();

                        if (isNullOrUndefined(bankAccount.accountNumber) || bankAccount.accountNumber === '') {
                            Modal.showAlert(bankAccount.apiResponseMessage);
                            return;
                        }
                        if (!bankAccount.isStatusOpen()) {
                            Modal.showAlert(bankAccount.accountStatusDesc);
                            return;
                        }

                        this.dataService.transaction.ignoreAccountNO = accountNumber;
                        this.dataService.transaction.from = bankAccount;
                        this.dataService.transaction.from.accountNumber = accountNumber;
                        this.dataService.transaction.from.accountType = AppConstant.ProdTypeFix;
                        this.selectedAccount.emit(bankAccount);
                    },
                    error => {
                        Modal.hide();
                        Modal.showAlert(error.responseStatus.responseMessage);
                    }
                );

        } else if (accountNumber.substring(0, 1) === '1' || accountNumber.substring(0, 1) === '2') { // CASA

            Modal.showProgress();
            this.accountService
                .getAccountDetail(accountNumber)
                .subscribe(
                    (bankAccount: BankAccount) => {
                        Modal.hide();

                        if (!bankAccount.isStatusOpen()) {
                            Modal.showAlert(bankAccount.accountStatusDesc);
                            return;
                        }

                        if (this.dataService.transaction.paymentType === PaymentType.Cheque
                            && this.dataService.transaction.constructor === Withdraw) {
                            setTimeout(() => {
                                this.dataService.transaction.currentStatus = this.dataService.transaction.status.inputData;
                                this.dataService.transaction.isCheque = true;
                            }, 100);
                        }

                        this.dataService.transaction.ignoreAccountNO = bankAccount.accountNumber;
                        this.selectedAccount.emit(bankAccount);
                    },
                    error => {
                        Modal.hide();
                        Modal.showAlert(error.responseStatus.responseMessage);
                    }
                );

        } else {
            Modal.showAlert('ระบุเลขที่บัญชีไม่ถูกต้อง');
        }
    }

    public onClickBack() {
        this.selectedAccount.emit(null);
    }

    public onClickLogin() {
        this.router.navigate(["kk", "login"], {queryParams: this.queryParams});
    }
}
