import { Component, OnInit, Output } from '@angular/core';
import { Router } from "@angular/router";
import { Location } from '@angular/common';
import { Utils } from 'app/share/utils';
import { DataService } from "../../_service/data.service";
import { ProductService } from '../../_service/api/product.service';
import { Modal } from "../../_share/modal-dialog/modal-dialog.component";
import { Product } from "../../_model/Product";

@Component({
    selector: 'app-catalog',
    templateUrl: './catalog.component.html',
    styleUrls: ['./catalog.component.sass', '../../_template/template-flip-book/template-flip-book.component.sass']
})
export class CatalogComponent implements OnInit {

    public catalogLists = [];
    public productDetail = new Array();
    public productList = new Array();
    public product = new Product();

    constructor(private router: Router,
        private dataService: DataService,
        private location: Location,
        private productService: ProductService) {

    }

    ngOnInit() {
        this.getProductNeed();
    }

    public getProductNeed() {
        this.productService.ProductNeed()
            .subscribe(
                Data => {
                    const catalogLists = Data.data;
                    console.log(catalogLists);
                    this.catalogLists = [
                        catalogLists[4],
                        catalogLists[3],
                        catalogLists[0],
                        catalogLists[2],
                        catalogLists[1],
                    ]
                    setTimeout(() => {
                        this.initCatalogList()
                    }, 250);
                },
                Error => {
                    this.ModalProgress(Error.responseStatus.responseMessage);
                }
            )
    }

    public ModalProgress(value) {
        Modal.showAlert(value)
    }

    public initCatalogList() {

        const options = {
            horizontal: true,

            //Item base navigation
            itemNav: 'basic', // 'basic','centered','forceCentered'
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
            elasticBounds: true,
            dragHandle: true,
            dynamicHandle: true,

        };

        $('.catalog_frame').sly(options);
        $(".div-item-catalog").fadeIn();
    }

    onClickBack() {
        this.router.navigate(["kk"]);
    }

    public onProductList(catalogObject, needType) {
        Utils.logDebug('onProductList', 'needType : ' + needType);
        Utils.logDebug('onProductList', 'this.dataService.selectedDepositType : ' + this.dataService.selectedDepositType);
        this.productService.ProductList('', needType)
            .subscribe(
                productData => {
                    this.productList = productData.data;
                    this.dataService.selectedProductList = this.productList;
                    this.onProductDetail(catalogObject, needType);
                },
                Error => {
                    this.ModalProgress(Error.responseStatus.responseMessage);
                }
            )
    }

    public onProductDetail(catalogObject, type) {
        Utils.logDebug('onProductDetail', 'start');
        Utils.logDebug('onProductDetail', 'catalogObject : ' + catalogObject);
        Utils.logDebug('onProductDetail', 'type : ' + type);
        this.productService.ProductDetail()
            .subscribe(
                productdetail => {
                    this.productDetail = productdetail.data.catalog_product_detail;
                    this.dataService.selectedProductDetail = this.productDetail.filter(value => value.needType === type)
                    this.onSubmit(catalogObject, type)
                },
                Error => {

                }
            )
    }

    public onSubmit(catalogObject, type) {
        Utils.logDebug('onSubmit', 'start');
        Utils.logDebug('onSubmit', 'catalogObject : ' + catalogObject);
        Utils.logDebug('onSubmit', 'type : ' + type);
        this.router.navigate(["kk", "catalogDetail"], { queryParams: { c: catalogObject.PRODN_COVER, type: type } });
    }
}