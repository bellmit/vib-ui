import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Location} from '@angular/common';

@Component({
    selector: 'app-payment-scanqr',
    templateUrl: './payment-scanqr.component.html',
    styleUrls: ['./payment-scanqr.component.sass']
})
export class PaymentScanqrComponent implements OnInit {

    constructor(private router: Router,
                private location: Location) {
    }

    ngOnInit() {
    }

    public onClickBack() {
        this.location.back();
    }

    public onScanbarcode() {
        this.router.navigate(["kk", "payment", "detail"]);
    }
}
