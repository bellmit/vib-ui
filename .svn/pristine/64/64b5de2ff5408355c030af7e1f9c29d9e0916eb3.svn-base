import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Modal} from "../../../_share/modal-dialog/modal-dialog.component";

@Component({
    selector: 'app-payment-detail',
    templateUrl: './payment-detail.component.html',
    styleUrls: ['./payment-detail.component.sass']
})
export class PaymentDetailComponent implements OnInit {

    public paymentState: number = 0;
    public isSelectAccount: boolean = false;
    public titleSelectBankAccount: string = "กรุณาระบุบัญชีที่ต้องการชำระ";

    constructor(private router: Router) {
    }

    ngOnInit() {
    }

    public onClickBack() {
        this.router.navigate(["kk", "payment"]);
    }

    public onClickBackMain() {

        const that = this;
        Modal.showConfirm(Modal.title.exit, function () {
            that.router.navigate(["kk"]);
        }, null);
    }

    public onSelectedAccount() {
        this.isSelectAccount = false;
    }

    public onClickSubmit(page) {
        this.paymentState = page;

        if (page == null) {
            this.router.navigate(["kk"]);
        }
    }
}
