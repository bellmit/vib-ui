import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { DataService } from "../../../_service/data.service";
import { Modal } from "../../../_share/modal-dialog/modal-dialog.component";
import { Product } from "../../../_model/Product";
import { ProductService } from "../../../_service/api/product.service";
import { Register } from "../../../_model/register";
import { RegisterService } from "../../../_service/api/register.service";
import { IdCardInfo } from "../../../_model/idCardInfo";
import { AppConstant } from '../../../../share/app.constant';

@Component({
    selector: 'app-deposit-type',
    templateUrl: 'deposit-type.component.html',
    styleUrls: ['deposit-type.component.sass']
})
export class DepositTypeComponent implements OnInit {
    public bookCover: string;
    public bookHeader: string = 'เคเค เซฟวิ่งส์ พลัส';
    public randomIndexContent: number = 0;
    public imageCover = ["acc1.jpg", "acc1.jpg", "acc2.jpg", "acc3.jpg"];
    public bookImageCover = this.imageCover[0];
    public register = new Register(new IdCardInfo());
    public product: Product = new Product();
    // public data_cover_id: string ;
    public id: string;
    public data_cover_id: string;
    public selectType: string;
    public dataList = new Array();
    public activeIndex: any = 0;
    public productList = [];
    public productD = null;

    constructor(private router: Router,
        private activatedRoute: ActivatedRoute,
        private registerService: RegisterService,
        private dataService: DataService,
        private productService: ProductService) {
        dataService.selectedDepositType = this.activatedRoute.snapshot.queryParams['type'] || '';
        this.selectType = dataService.selectedDepositType;
        if (this.selectType === 'current') {
            this.bookCover = "bookbank/CurrentPassbook.png";
        } else {
            this.bookCover = dataService.selectedDepositType + "_book.png";
        }

    }

    ngOnInit() {
        Modal.showProgress();
        this.setDataType();
    }

    public setDataType() {
        this.activeIndex = 0;
        Modal.showProgress();
        if (this.selectType === 'saving') {
            this.randomIndexContent = 0;
            this.productService.ProductListType(AppConstant.ProdTypeSaving, '')
                .subscribe(
                    data => {
                        this.dataList = data.data;
                        setTimeout(() => {
                            this.data_cover_id = this.dataList[0].PROD_ID;
                            this.getProductDetail();
                        }, 150);
                    }, error => {

                    }
                )
        }

        if (this.selectType === 'current') {
            this.randomIndexContent = 1;
            this.productService.ProductListType(AppConstant.ProdTypeCurrent, '')
                .subscribe(
                    data => {
                        this.dataList = data.data;
                        setTimeout(() => {
                            this.data_cover_id = this.dataList[0].PROD_ID;
                            this.getProductDetail();
                        }, 150);
                        console.log(this.dataList);
                    }, error => {

                    }
                )
        }

        if (this.selectType === 'fixed') {
            this.randomIndexContent = 2;
            this.productService.ProductListType(AppConstant.ProdTypeFix, '')
                .subscribe(
                    data => {
                        this.dataList = data.data
                        setTimeout(() => {
                            this.data_cover_id = this.dataList[0].PROD_ID;
                            this.product.PROD_CODE = this.dataList[0].PROD_ID;
                            this.product.PROD_DESC = this.dataList[0].PROD_NAME;
                            this.product.PROD_TYPE = this.dataList[0].PROD_TYPE;
                            this.product.PROD_TYPE_DESC = this.dataList[0].PROD_TYPE_DESC;
                            this.getProductDetail();
                        }, 150);
                        console.log(this.dataList);
                    }, error => {

                    }
                )
        }
    }

    public getProductDetail() {
        this.productService.ProductDetail()
            .subscribe(
                data => {
                    this.productList = data.data
                    this.productD = this.productList['catalog_product_detail'].filter(Value => Value.prodId === this.dataList[0].PROD_ID);
                    this.productD = this.productD[0];
                    setTimeout(() => {
                        this.initObject();
                        Modal.hide();
                    }, 1000);
                },
                error => {

                }
            )
    }

    public initObject() {

        const that = this;
        const options = {
            horizontal: 0,

            //Item base navigation
            itemNav: 'forceCentered',  // 'basic','centered','forceCentered'
            startAt: 0,
            smart: 1,
            activateMiddle: 1,
            activateOn: 'click',
            mouseDragging: 1,
            touchDragging: 1,
            releaseSwing: 1,

            //Scrolling
            scrollBy: 1,
            speed: 300,
            elasticBounds: 1,
            easing: 'easeOutExpo',

            //Dragging
            dragHandle: 1,
            dynamicHandle: 1,
            clickBar: 1
        };

        this.product.PROD_CODE = this.dataList[0].PROD_ID;
        this.product.PROD_DESC = this.dataList[0].PROD_NAME;
        this.product.PROD_TYPE = this.dataList[0].PROD_TYPE;
        this.product.PROD_TYPE_DESC = this.dataList[0].PROD_TYPE_DESC;

        const $frame = $('#frame');
        $frame.sly(options);
        $frame.sly("activate", this.activeIndex, false);
        $frame.sly('on', 'active', function (e, index) {
            that.activeIndex = index;
            that.data_cover_id = that.dataList[index].id;
            that.product.PROD_CODE = that.dataList[index].PROD_ID;
            that.product.PROD_DESC = that.dataList[index].PROD_NAME;
            that.product.PROD_TYPE = that.dataList[index].PROD_TYPE;
            that.product.PROD_TYPE_DESC = that.dataList[index].PROD_TYPE_DESC;

            that.productD = that.productList['catalog_product_detail'].filter(Value => Value.prodId === that.dataList[index].PROD_ID);
            that.productD = that.productD[0];
            that.bookImageCover = that.imageCover[that.data_cover_id];
            that.bookHeader = that.dataList[index].name;
            that.randomIndexContent = Math.floor((Math.random() * 3));
        });

    }

    public onClickBack() {
        this.dataService.backFromDepositType = true;
        this.router.navigate(["kk"]);
    }

    public onClickOpenAccount() {
        const that = this;
        this.dataService.selectedProduct = this.product;
        that.router.navigate(["kk", "subscription", "account"]);
    }
}
