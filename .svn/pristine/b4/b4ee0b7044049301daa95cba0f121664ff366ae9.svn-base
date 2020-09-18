import {Component, OnInit} from '@angular/core';
import {BankAccount} from "../../_model/bankAccount";
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from "../../_service/data.service";
import {AccountService} from "../../_service/api/account.service";
import {asTextData} from "@angular/core/src/view";
import { TermDepositList } from "../../_model/termDepositList";
import {Modal} from "../../_share/modal-dialog/modal-dialog.component";
import {isNullOrUndefined} from "util";
import { AppConstant } from 'app/share/app.constant';
import {TransactionService} from "../../_service/api/transaction.service";

@Component({
    selector: 'select-td-principal',
    templateUrl: './select-td-principal.component.html',
    styleUrls: ['./select-td-principal.component.sass']
})
export class SelectTdPrincipalComponent implements OnInit {

    accountStatusCodeActive = AppConstant.AccountStatusCodeActive;
    accountStatusCodeOpenToday = AppConstant.AccountStatusCodeOpenToday;
    bankAccount: BankAccount;
    termDepositList: TermDepositList[];
    //selectedIndexPrincipal;

    constructor(private activatedRoute: ActivatedRoute,
                private router: Router,
                public dataService: DataService,
                private accountService: AccountService,
                private transactionService: TransactionService) {

        this.getTDPrincipal();
    }

    ngOnInit() {

    }

    getTDPrincipal() {
        if (isNullOrUndefined(this.dataService.transaction)) {
            this.back();
            return;
        }
        const accountNumber = this.dataService.transaction.from.accountNumber; //00013120003354
        Modal.showProgress();
        this.accountService
            .getTermDepositList(accountNumber)
            .subscribe(
                depositList => {
                    this.termDepositList = depositList;
                },
                error => {
                    Modal.showAlert(error.responseStatus.responseMessage);
                }
            );

    }

    onSubmit() {
        const termDeposit = this.termDepositList[this.dataService.transaction.selectedIndexPrincipal];
        Modal.showProgress();
        this.transactionService
            .getTDTermByDepNO(termDeposit.tdPlacementNumber, '')
            .subscribe(
                data => {
                    this.dataService.transaction.selectedTermDepositList = termDeposit;
                    this.dataService.transaction.selectedIndexPrincipal = termDeposit.tdSequence;
                    this.dataService.transaction.amount = data.data.settlementAmount;
                    this.dataService.transaction.penaltyForEarlyRedeem = data.data.penaltyForEarlyRedeem;
                    this.dataService.transaction.tdGPlacementNumber = data.data.tdGPlacementNumber;
                    this.dataService.transaction.witholdingTax = data.data.witholdingTax;
                    this.back();
                },
                error => {

                    Modal.showAlert(error.responseStatus.responseMessage);
                }
            );
    }

    onScrollToTop() {
        const scroll = $(".scroll");
        scroll.stop().animate({scrollTop: 0}, 500, 'swing');
    }

    onClickBack() {
        this.dataService.transaction.selectedIndexPrincipal = null;
        this.dataService.transaction.from = new BankAccount();
        this.back();
    }

    public back() {
        if (isNullOrUndefined(this.dataService.transaction.selectedIndexPrincipal) &&
            this.dataService.transaction.from.accountNumber.length === 0  &&
                this.dataService.transaction.fromFix === true) {
            this.router.navigate(["kk", "transactionBank"]);
            return
        }

        const objectParams = this.activatedRoute.snapshot.queryParams;
        const returnUrl = objectParams.returnUrl || '';
        const queryParams = {};
        for (const key in objectParams) {

            if (key !== "returnUrl") {
                queryParams[key] = objectParams[key];
            }
        }
        this.router.navigate(["/kk/" + returnUrl], {queryParams: queryParams});
    }
}
