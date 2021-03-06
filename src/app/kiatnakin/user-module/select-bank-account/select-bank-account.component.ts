import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { BankAccount } from "../../_model/bankAccount";
import { DataService } from "../../_service/index";
import { AccountService } from "../../_service/api/account.service";
import { isNullOrUndefined } from "util";
import { Transfer } from "../../_model/transfer";
import { Modal } from "../../_share/modal-dialog/modal-dialog.component";
import { Utils } from "../../../share/utils";
import { Bank } from "../../_model/bank";
import { Location } from '@angular/common';
import { ReceiveType } from "../../_model/transaction";
import { AppConstant } from "../../../share/app.constant";
import { InvestmentService } from '../../_service/api/investment.service';

@Component({
    selector: 'select-bank-account',
    templateUrl: './select-bank-account.component.html',
    styleUrls: ['./select-bank-account.component.sass'],
    providers: [AccountService, AppConstant]
})
export class SelectBankAccountComponent implements OnInit {

    public bankAccountList: any[];
    public isSelectMultipleAccount: boolean;
    public selectedAccountList: Map<string, BankAccount> = new Map();

    public isInputInterBank: boolean = false;
    public checkFundType: boolean;
    public color: string;
    public transfer: Transfer;

    @Input() ignoreAccountNO: string;
    @Input() isChildView: boolean = false;
    @Input() isShowInterBankMenu: boolean;
    @Input() minimumAmount: number = 0;
    @Output() selectedAccount: EventEmitter<BankAccount> = new EventEmitter<BankAccount>();

    constructor(private router: Router,
        private activatedRoute: ActivatedRoute,
        private accountService: AccountService,
        private location: Location,
        private dataService: DataService,
        private investmentService: InvestmentService,
        private appconstant: AppConstant) {
    }

    ngOnInit() {
        this.checkFundType = this.investmentService.selectFund.length === 0 ? true : false;
        this.initObject();
        this.getAccount();
        if (!isNullOrUndefined(this.dataService.transaction)) {
            this.dataService.transaction.receiveType = ReceiveType.BankAC;
        }
        this.activatedRoute.queryParams.subscribe(params => {
            this.isSelectMultipleAccount = params.multiple;
            if (this.isSelectMultipleAccount) {
                if (this.dataService.selectedAccount.constructor === Array) {
                    this.dataService.selectedAccount.forEach((account, key, map) => {
                        this.selectedAccountList.set(account.accountNumber, account);
                    });
                }
            }
        });
    }

    public initObject() {

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
            dynamicHandle: true,

        };
        $('#frame').sly(options);
    }

    public getAccount() {
        Modal.showProgress();
        const that = this;
        this.accountService.getAccountList().subscribe((bankAccountList: BankAccount[]) => {
            // check from tranfer
            console.log('SelectBankAccountComponent --- bass bankAccountList 1 ->', bankAccountList);
            if (!isNullOrUndefined(this.dataService.transaction)) {
                if (that.dataService.transaction.from.accountType !== AppConstant.ProdTypeFix) {
                    bankAccountList = bankAccountList.filter(x => x.accountNumber !== that.dataService.transaction.from.accountNumber);
                    console.log('DATTA', bankAccountList)
                }
                if (that.dataService.transaction.from.accountType === AppConstant.ProdTypeFix) {
                    that.isShowInterBankMenu = false;
                }
            }
            that.dataService.ownBankAccountList = bankAccountList;
            that.bankAccountList = bankAccountList.filter(
                bankAccount => {
                    return this.checkIgnoreAccountNo(bankAccount);
                });
            that.bankAccountList.forEach(
                (bankAccount) => bankAccount.enable = that.checkSelectableAccount(bankAccount)
            );
            const sortAccount = that.bankAccountList;
            that.bankAccountList = sortAccount
                .sort(function (bankAccount1, bankAccount2) {
                    return bankAccount2.enable - bankAccount1.enable;
                });
            console.log('SelectBankAccountComponent --- bass bankAccountList ->', this.bankAccountList);
        },
            error => {
                Modal.showAlert(error.responseStatus.responseMessage);
            },
            () => {
                Modal.hide();
                setTimeout(() => {
                    $('#frame').sly("reload");
                }, 100);
            })
        console.log('SelectBankAccountComponent --- bass accountService.getAccountList() ->', this.accountService.getAccountList());
    }

    public onSelectedAccount(selectedAccount?: BankAccount) {
        console.log('selectedAccount ccccccccc', selectedAccount)
        if (isNullOrUndefined(selectedAccount)) {
            this.isInputInterBank = false;
            return;
        } else if (!selectedAccount.enable) {
            return;
        }
        // this.dataService.transaction.from.accountType = selectedAccount.accountType;
        // if (selectedAccount.accountType === 'T') {
        //     Modal.showAlert("??????????????????????????????????????????????????? ?????????????????????????????????????????????????????????")
        //     return;
        // }

        if (!selectedAccount.isStatusOpen() || this.getReturnURL()[0] !== 'transactionBank') {
            Modal.showAlert("??????????????????????????????????????????????????????????????????????????? ??????????????????????????????????????????????????????????????????");
            return;
        }
        if (this.isSelectMultipleAccount) {
            if (this.selectedAccountList.has(selectedAccount.accountNumber)) {
                this.selectedAccountList.delete(selectedAccount.accountNumber);
            }
            else {
                console.log('selectedAccountList');
                this.selectedAccountList.set(selectedAccount.accountNumber, selectedAccount);
            }
            return
        } else {
            const that = this;
            const selectedId = `#book-${selectedAccount.accountNumber}`;
            const unSelectedId = selectedAccount.isSearchByNumber ? '#div-container' : `[id^='book-']:not('${selectedId}')`;
            const animation = selectedAccount.isSearchByNumber ? 'fadeOut' : 'zoomOutDown';
            Utils.animate('#speech', 'fadeOut');
            Utils.animate(unSelectedId, animation)
                .then(() => {
                    console.log('animation ->', animation)
                    if (that.isChildView) {
                        that.selectedAccount.emit(selectedAccount);
                    } else {
                        that.dataService.selectedAccount = selectedAccount;
                        setTimeout(() => {
                            if (this.checkFundType) {
                                that.router.navigate(["/kk/"].concat(that.getReturnURL()));
                            } else {
                                that.router.navigate(["kk", "fund-management", "transfer-fund"]);
                            }
                        }, 500);
                    }
                }).catch(
                    error => {
                        console.log('error', error);
                    }
                )
        }
    }

    public onSubmitWithMultipleAccount() {

        const selectList: BankAccount[] = [];
        this.selectedAccountList.forEach((value, key, map) => {
            selectList.push(value);
        });

        this.dataService.selectedAccount = selectList;
        this.router.navigate(["/kk/"].concat(this.getReturnURL()));

    }

    public checkSelectableAccount(account: BankAccount) {

        if (this.minimumAmount > 0 &&
            this.minimumAmount > account.balance || this.minimumAmount > account.principalBalance) {
            return false;
        }
        return true;
    }

    public onClickBack() {

        if (this.isInputInterBank) {
            this.isInputInterBank = false;
            return;
        }

        if (this.isChildView) {
            this.selectedAccount.emit();
        } else {
            // this.location.back();
            this.router.navigate(["kk", "transactiontype"]);
        }
    }

    public getReturnURL() {
        const queryParams = this.activatedRoute.snapshot.queryParams;
        const returnUrl = !isNullOrUndefined(queryParams) && queryParams.hasOwnProperty('returnUrl') ? queryParams['returnUrl'] : 'transactionBank';
        const returnUrlList = [];
        if (!Array.isArray(returnUrl)) {
            returnUrlList.push(returnUrl);
        } else {
            return returnUrlList.concat(returnUrl);
        }
        return returnUrlList;
    }

    public getAppConstant() {
        return AppConstant;
    }

    public checkAccountTD(bankAccount: BankAccount) {
        if (bankAccount.accountType === AppConstant.ProdTypeFix) {
            return false;
        } else {
            return bankAccount;
        }
    }

    public checkIgnoreAccountNo(bankAccount: BankAccount) {
        if (bankAccount.accountNumber === this.ignoreAccountNO) {
            if (bankAccount.accountType === AppConstant.ProdTypeFix) {
                return true;
            }
        }
        return bankAccount;
    }
}
