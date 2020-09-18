import { Component } from '@angular/core';
import { TranslateService } from "ng2-translate";
import { ProductService } from "../app/kiatnakin/_service/api/product.service";
import { LocalStorage } from "ngx-webstorage";
import { AppConstant } from "./share/app.constant";
import { Router } from "@angular/router";
import { Http } from "@angular/http";
import { DataService } from "../app/kiatnakin/_service/data.service";
import { Environment } from "../app/share/utils";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.sass']
})

export class AppComponent {

    @LocalStorage("lang", "th")
    language: string;
    appVersion: string;
    branchCode: string;
    machineId: string;
    envName: string;
    show: boolean = false;
    showdialog: boolean = false;
    showMenu: string = 'Show Menu';
    releaseNote: any[];

    constructor(translate: TranslateService,
        private productService: ProductService,
        private dataService: DataService,
        private router: Router,
        private http: Http) {
        translate.setDefaultLang('th');
        translate.use(this.language);

        this.appVersion = AppConstant.appVersion;
        this.branchCode = Environment.branchCode;
        this.machineId = Environment.machine_id;
        this.envName = Environment.envName;
        this.getReleaseNote();

    }

    setLanguage(language: string) {
        this.language = language;
        window.location.reload();
    }

    private getReleaseNote() {

        this.http.get("./assets/release.json")
            .map(res => res.json())
            .subscribe(
                data => {

                    this.releaseNote = data;
                    setTimeout(() => $('.carousel').carousel(), 250);
                }
            );
    }


    public onClickBillPayRePay() {
        this.show = false;
        this.router.navigate(["kk", "service"]);
    }

    public onClickRequest() {
        this.show = false;
        this.router.navigate(["kk", "request"]);
    }

    public onClickInvestment() {
        this.show = false;
        this.router.navigate(["kk", "investment"]);
    }

    public onClickSubscription() {
        this.show = false;
        this.dataService.SubService = true;
        this.router.navigate(["kk", "subscription", "account"]);
    }

    public onClickSubUsernamePassword() {
        this.show = false;
        this.router.navigate(["kk", "subscription", "usernamepassword"]);
    }

    public onClickSubSmartSMS() {
        this.show = false;
        this.router.navigate(["kk", "subscription", "smartsms"]);
    }

    public onClickSubPhoneService() {
        this.show = false;
        this.router.navigate(["kk", "subscription", "phoneservice"]);
    }

    public onClickSubMyPin() {
        this.show = false;
        this.router.navigate(["kk", "subscription", "mypin"]);
    }

    public onClickShow() {

        if (this.show === true) {
            this.show = false;
            this.showMenu = 'Show Menu';
        } else {
            this.show = true;
            this.showMenu = 'Hide Menu';
        }
    }

    public onClickShowDialog() {

        if (this.showdialog === true) {
            this.showdialog = false;
        } else {
            this.showdialog = true;
        }
    }

}
