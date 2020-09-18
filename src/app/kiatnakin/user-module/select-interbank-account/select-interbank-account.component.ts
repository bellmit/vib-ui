import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from "@angular/router";
import { BankAccount } from "../../_model/bankAccount";
import { AccountService } from "../../_service/api/account.service";
import { KeyboardService } from "../../_service/keyboard.service";
import { Bank } from "../../_model/bank";
import { DataService } from "../../_service/data.service";
import { Utils } from "../../../share/utils";
import { Modal } from "../../_share/modal-dialog/modal-dialog.component";
import { ReceiveType, PaymentType } from "../../_model/transaction";
import { UserService } from "../../_service/user.service";
import { isNullOrUndefined } from "util";
import { MasterDataService } from "../../_service/api/master-data.service";
import { AppConstant } from 'app/share/app.constant';

@Component({
    selector: 'select-interbank-account',
    templateUrl: './select-interbank-account.component.html',
    styleUrls: ['./select-interbank-account.component.sass']
})
export class SelectInterbankAccountComponent implements OnInit {

    @Output() selectedAccount: EventEmitter<BankAccount> = new EventEmitter<BankAccount>();
    @Input() queryParams: Map<string, string>;

    public bankList: any[];
    public activeIndex: any = 1;
    public bankcode: string;
    public minlength: number = 14; // default kk bank
    public maxlength: number = 14; // default kk bank
    public placeholder: string = 'input_account_no'; // default kk bank
    public bank: Bank;
    public bankAccount = new BankAccount();
    public title: boolean = true;
    public inputAccountNumber;


    constructor(private router: Router,
        private dataService: DataService,
        private masterData: MasterDataService,
        private accountService: AccountService,
        public userService: UserService) {

    }

    ngOnInit() {
        this.getBankList()
    }

    public initObject() {
        setTimeout(() => {
            KeyboardService.initKeyboardInputText();
        }, 500);


        if (this.dataService.transaction.to.accountNumber != null) {

            if (!this.userService.isLoggedin() || (this.userService.getUser().idNumber !== this.dataService.transaction.to.citizenID)) {
                this.bankAccount.accountNumber = this.dataService.transaction.to.accountNumber;
            }
        }
        this.inputAccountNumber = this.bankAccount.accountNumber;

        Object.keys(this.bankList).forEach(key => {

            if (this.bankList[key].code === this.dataService.transaction.to.bank.code) {
                this.activeIndex = key;
            }
        });

        const that = this;

        const options = {
            horizontal: true,

            //Item base navigation
            itemNav: 'forceCentered', // 'basic','centered','forceCentered'
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
            dynamicHandle: true,
            clickBar: false
        };

        const $frame = $('#frame');

        $frame.sly(options);
        $frame.sly("activate", this.activeIndex, false);
        $frame.sly('on', 'active', function (e, index) {
            that.inputAccountNumber = "";
            that.getMinMaxLength(index)
        });

        this.getMinMaxLength(this.activeIndex)
    }

    public getMinMaxLength(index) {

        this.activeIndex = index;
        this.bankcode = this.bankList[index].code;

        if (this.bankcode === '099') { // code 099 Promtpay
            this.minlength = 10;
            this.maxlength = 15;
            this.placeholder = "input_phone_or_id_no";
        } else if (this.bankcode === '069') {
            this.minlength = 10;
            this.maxlength = 14;
            this.placeholder = "input_account_no";
        } else {
            this.minlength = 10;
            this.maxlength = 14;
            this.placeholder = "input_account_no";
        }
    }

    public getBankList() {

        this.masterData.getMasterBank()
            .subscribe(
                bankList => {

                    this.bankList = bankList;
                    if (this.dataService.transaction.from.accountType === 'TD' ||
                        this.dataService.transaction.from.accountType === PaymentType.Cheque && this.dataService.transaction.from.bank.code !== '069') {
                        this.bankList = bankList.filter(bank => bank.isKiatnakinBank());
                        this.title = false;
                    }

                    setTimeout(() => {
                        $(".bank").show();
                        this.initObject();
                    }, 150);
                },
                error => {
                    Modal.showAlert(error.responseStatus.responseMessage);
                }
            );
    }

    public onSelectedAccount(accountNumber: string) {

        if (accountNumber.length === 0) {
            return;
        }

        if (!isNullOrUndefined(this.dataService.transaction.from)) {
            const sourceAccountNumber = this.dataService.transaction.from.accountNumber;
            if (sourceAccountNumber.substring(0, 1) !== '3' &&
            accountNumber.substring(0, 1) !== '3' &&
            sourceAccountNumber === accountNumber) {
                Modal.showAlert("ไม่สามารถระบุหมายเลขบัญชีที่เหมือนต้นทาง กรุณาทำรายการใหม่อีกครั้ง");
                return;
            }
        }

        this.checkAccountTypeTD();
        this.bankAccount.accountNumber = accountNumber;
        this.bankAccount.bank = this.bank;
        this.bankAccount.isSearchByNumber = true;
        this.bankAccount.accountType = "INTER";

        if (this.bankAccount.bank.code === '099') {
            if (this.bankAccount.accountNumber.length === 13) {
                const check_id13 = Utils.validateNationalID(this.bankAccount.accountNumber);
                if (check_id13 === true) {
                    this.dataService.transaction.receiveType = ReceiveType.NationID;
                    console.log("National_ID Respon => success");
                }
                else {
                    console.log("National_ID Respon => error");
                    Modal.showAlert('รหัสบัตรประชาชนผิดพลาด');
                    return;
                }
            }
            else if (this.bankAccount.accountNumber.length === 10) {
                this.dataService.transaction.receiveType = ReceiveType.MobileID;
            }
            else if (this.bankAccount.accountNumber.length === 15) {
                this.dataService.transaction.receiveType = ReceiveType.EWalletID;
            }
            else {
                Modal.showAlert('โปรดกรอกรหัสบัตรประชาชน หรือ หมายเลขโทรศัพท์ ให้ถูกต้อง');
                return;
            }
        }

        if (this.bank.isKiatnakinBank()) {
            Modal.showProgress();

            if (accountNumber.substring(0, 1) === '3') { // TD
                if (this.userService.isLoggedin()) {

                    Modal.hide();
                    this.dataService.transaction.receiveType = ReceiveType.BankAC;
                    const bankAccount = new BankAccount();
                    bankAccount.isSearchByNumber = true;
                    bankAccount.bank = this.bank;
                    bankAccount.accountNumber = accountNumber;
                    bankAccount.accountType = AppConstant.ProdTypeFix;
                    if (isNullOrUndefined(this.dataService.ownBankAccountList.filter(x => x.accountNumber === accountNumber))) {
                        // found in account list
                        bankAccount.accountStatusCode = this.dataService.ownBankAccountList.filter(x => x.accountNumber === accountNumber)[0].accountStatusCode;
                        this.selectedAccount.emit(bankAccount);
                    } else {
                        // not found in account list
                        Modal.showAlert("ไม่สามารถทำรายการได้ เนื่องจากบัญชีปลายทางไม่ใช่บัญชีของท่าน");
                    }

                } else {

                    this.accountService.getAccountTDDetail(accountNumber)
                        .subscribe((bankAccount: BankAccount) => {
                            Modal.hide();
                            if (isNullOrUndefined(bankAccount.accountNumber) || bankAccount.accountNumber === '') {
                                Modal.showAlert(bankAccount.apiResponseMessage);
                            } else {

                                if (!bankAccount.isStatusOpen()) {
                                    Modal.showAlert(bankAccount.accountStatusDesc);
                                    return;
                                }
                                this.dataService.transaction.receiveType = ReceiveType.BankAC;
                                bankAccount.isSearchByNumber = true;
                                bankAccount.bank = this.bank;
                                this.selectedAccount.emit(bankAccount);
                            }
                        },
                        error => {
                            Modal.showAlert(error.responseStatus.responseMessage);
                        });
                }
            } else if (accountNumber.substring(0, 1) === '1' || accountNumber.substring(0, 1) === '2') { // CASA
                this.accountService
                    .getAccountDetail(accountNumber)
                    .subscribe(
                        (bankAccount: BankAccount) => {
                            Modal.hide();

                            if (!bankAccount.isStatusOpen()) {
                                Modal.showAlert(bankAccount.accountStatusDesc);
                                return;
                            }
                            this.dataService.transaction.receiveType = ReceiveType.BankAC;
                            bankAccount.isSearchByNumber = true;
                            bankAccount.bank = this.bank;
                            this.selectedAccount.emit(bankAccount);
                        },
                        error => {
                            Modal.showAlert(error.responseStatus.responseMessage);
                        }
                    );
            } else {

                Modal.showAlert('ระบุเลขที่บัญชีไม่ถูกต้อง');
            }
        }
        else {

            this.selectedAccount.emit(this.bankAccount);
        }
    }

    public checkAccountTypeTD() {
        // if (this.dataService.transaction.from.accountType === AppConstant.ProdTypeFix) {
        //     this.bank = this.bankList[0];
        // } else {
        //     this.bank = this.bankList[this.activeIndex];
        // }
        this.bank = this.bankList[this.activeIndex];
    }

    public onClickLogin() {

        this.dataService.transaction.loginfrom = 'INTER';
        this.router.navigate(["kk", "login"], { queryParams: this.queryParams });
    }


}
