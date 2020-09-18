import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from "../../_service/data.service";
import {BankAccount} from "../../_model/bankAccount";
import {KeyboardService} from "../../_service/keyboard.service";
import {TransactionService} from "../../_service/api/transaction.service";
import {Modal} from "../../_share/modal-dialog/modal-dialog.component";
import {isNullOrUndefined} from "util";

@Component({
    selector: 'select-td-principal-by-index',
    templateUrl: './select-td-principal-by-index.component.html',
    styleUrls: ['./select-td-principal-by-index.component.sass']
})
export class SelectTdPrincipalByIndexComponent implements OnInit {

    selectedIndex: string = "";

    constructor(private activatedRoute: ActivatedRoute,
                private router: Router,
                public  dataService: DataService,
                private transactionService: TransactionService) {
        if (isNullOrUndefined(this.dataService.transaction.from)) {
            this.back();
        }
    }

    ngOnInit() {
        KeyboardService.initKeyboardInputText();
    }


    public onSubmit() {

        const accountNumber = this.dataService.transaction.from.accountNumber;
        Modal.showProgress();
        console.log('this.selectedIndex : ' + this.selectedIndex);
        this.transactionService
            .getTDTermByDepNO(accountNumber, this.selectedIndex)
            .subscribe(
                data => {

                    this.dataService.transaction.selectedIndexPrincipal = this.selectedIndex;
                    this.dataService.transaction.amount = data.data.settlementAmount;
                    this.dataService.transaction.penaltyForEarlyRedeem = data.data.penaltyForEarlyRedeem;
                    this.dataService.transaction.tdGPlacementNumber = data.data.tdGPlacementNumber;
                    this.dataService.transaction.witholdingTax = data.data.witholdingTax;
                    console.log(this.dataService.transaction);
                    this.back();
                },
                error => {

                    Modal.showAlert(error.responseStatus.responseMessage);
                }
            );

    }

    onClickBack() {
        this.dataService.transaction.from = new BankAccount();
        this.back();
    }

    private back() {

        const objectParams = this.activatedRoute.snapshot.queryParams;
        const returnUrl = objectParams.returnUrl || '';
        const queryParams = {};
        for (const key in objectParams) {

            if (key !== "returnUrl") {
                queryParams[key] = objectParams[key];
            }
        }

        this.router.navigate(["/kk/" + returnUrl], {queryParams: queryParams, replaceUrl: true});
    }

}
