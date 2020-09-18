import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Location} from '@angular/common';

@Component({
    selector: 'app-payment-method',
    templateUrl: './payment-method.component.html',
    styleUrls: ['./payment-method.component.sass']
})
export class PaymentMethodComponent implements OnInit {

    constructor(private router: Router,
                private location: Location) {
    }

    ngOnInit() {
    }

    public onClickBack() {
        this.location.back();
    }

    public onClickScanBarcode() {
        this.router.navigate(["kk", "payment", "scan"]);
    }

    public onClickInputBarcode() {
        this.router.navigate(["kk", "payment", "code"]);
    }
}
