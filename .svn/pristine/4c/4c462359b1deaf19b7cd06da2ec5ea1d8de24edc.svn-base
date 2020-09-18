import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Location} from '@angular/common';

@Component({
    selector: 'app-payment-input-barcode',
    templateUrl: './payment-input-barcode.component.html',
    styleUrls: ['./payment-input-barcode.component.sass']
})
export class PaymentInputBarcodeComponent implements OnInit {

    constructor(private router: Router,
                private location: Location) {
    }

    ngOnInit() {
    }

    public onClickBack() {
        this.location.back();
    }

    public onClickSubmit() {
        this.router.navigate(["kk", "payment", "detail"]);
    }
}
