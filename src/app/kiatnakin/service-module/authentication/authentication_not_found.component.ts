import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { DataService, LoginService } from 'app/kiatnakin/_service';
import { Modal } from "../../_share/modal-dialog/modal-dialog.component";
import * as moment from 'moment';
import { ICarouselConfig, AnimationConfig } from 'angular4-carousel';
import { AppConstant } from '../../../share/app.constant';
import { Product } from '../../_model/Product';
import { ProductService } from '../../_service/api/product.service';
import { Environment } from '../../../share/utils';

@Component({
    selector: 'authentication-not-found',
    templateUrl: './authentication_not_found.component.html',
    styleUrls: ['./authentication_not_found.component.sass']
})
export class AuthenticationNotFoundComponent implements OnInit {

    appVersion = AppConstant.appVersion;
    branchCode = Environment.branchCode;
    machineId = Environment.machine_id;
    envName = Environment.envName;

    public product = new Product();
    public imageSources: string[] = [
        this.product.domainAPI + '/files/product_need/account.png',
        // this.product.domainAPI + '/files/product_need/insurance.png',
        // this.product.domainAPI + '/files/product_need/investment.png',
        // this.product.domainAPI + '/files/product_need/loan.png',
        // this.product.domainAPI + '/files/product_need/other.png'
    ]
    // public imageSources: string[] = [
    //     'http://media.kiatnakin.co.th/image/2018/Feb/%E0%B9%81%E0%B8%84%E0%B8%A1%E0%B9%80%E0%B8%9B%E0%B8%8D%E0%B8%95%E0%B8%A3%E0%B8%B8%E0%B8%A9%E0%B8%88%E0%B8%B5%E0%B8%99_Web_Promotion628.png',
    //     'http://media.kiatnakin.co.th/image/2018/Feb/unionpay-bbq-plaza-detail.jpg',
    //     "http://media.kiatnakin.co.th/image/2018/Feb/fixed-27month-promotion-thumbnail.jpg",
    //     "http://media.kiatnakin.co.th/image/2018/Feb/unionpay-bbq-plaza-detail.jpg"
    // ];

    public config: ICarouselConfig = {
        verifyBeforeLoad: false,
        log: false,
        animation: true,
        animationType: AnimationConfig.SLIDE_OVERLAP,
        autoplay: true,
        autoplayDelay: 3500,
        stopAutoplayMinWidth: 768
    };

    constructor(private router: Router,
        private dataService: DataService,
        public productService: ProductService,
        private loginService: LoginService) {
        // this.getProductNeed()ß
    }

    ngOnInit() {
        // this.getProductNeed();
    }

    getProductNeed() {
        this.productService.ProductNeed()
            .subscribe(
                Data => {
                    this.imageSources = Data.data;
                    let i = 0;
                    this.imageSources.forEach(element => {
                        this.imageSources[i] = this.product.domainAPI + element['prodnImg'];
                        i++;
                    });
                    console.log(this.imageSources);
                }, error => {
                    Modal.showAlert(error.responseStatus.responseMessage);
                }
            )
    }

    onCheckTellerAuthentication() {
        Modal.showProgress()
        // this.dataService.LastDateTellerAuthorized = moment().toISOString(); // bypass --- bass
        // this.dataService.tellerToken = "QTAwMTE1NjM4NTc0NjA1NDU1ZTVhZjdmOC0xNWViLTQ4OTUtOThlZS0xMzMwZjM1ZGE2YTE" // bypass --- bass
        // Modal.hide(); // bypass --- bass
        // return this.router.navigate(['kk']); // bypass --- bass

        this.loginService.checkTellerAuthenNewVIB()
            .subscribe(
                res => {
                    if (res.header.success) {
                        this.dataService.LastDateTellerAuthorized = moment().toISOString();
                        this.dataService.tellerToken = res.data.token;
                        this.dataService.tokenOtt = res.data.ott;
                        // console.log('this.dataService.tellerToken --- bass ->', this.dataService.tellerToken)
                        // console.log('this.dataService.tokenOtt --- bass ->', this.dataService.tokenOtt)
                        this.router.navigate(['kk']);
                    }
                },
                error => {
                    console.log(error);
                    Modal.showAlert(error.responseStatus.responseMessage);
                }
            )
    }

    onCheckTellerUnAuthentication() {
        Modal.showProgress();

        this.loginService.checkTellerAuthenNewVIB()
            .subscribe(
                res => {
                    this.dataService.LastDateTellerAuthorized = "";
                    this.router.navigate(['kk']);
                },
                error => {
                    Modal.showAlert(error.responseStatus.responseMessage);
                }
            );
    }
}
