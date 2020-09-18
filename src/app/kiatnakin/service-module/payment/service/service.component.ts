import {Component, OnInit, AfterViewInit} from '@angular/core';
import {Router} from "@angular/router";
import {ServiceCategory} from "../../../_model/serviceCategory";
import {DataService} from "../../../_service/data.service";
import {TransactionService} from "../../../_service/api/transaction.service";
import {RePay} from "../../../_model/rePay";

@Component({
    selector: 'app-service',
    templateUrl: './service.component.html',
    styleUrls: ['./service.component.sass']
})
export class ServiceComponent implements OnInit, AfterViewInit {

    public serviceCategoryList: ServiceCategory[] = [];
    public rePayList: RePay[] = [];
    public datList: any;
    public isSelectingCategory: boolean = true;

    constructor(private router: Router,
                public dataService: DataService,
                public transactionService: TransactionService) {
    }

    ngOnInit() {
        this.initObject();
        this.getServiceCategory();
    }

    ngAfterViewInit() {
    }

    private getServiceCategory() {
        $(".slidee>li").hide();
        this.transactionService
            .GetConfigList('payment_category')
            .subscribe(
                data => {

                    this.datList = this.serviceCategoryList = ServiceCategory.parseJSONArray(data);
                    this.reloadDataList();

                }
            );
    }

    private getRepayList() {
        $(".slidee>li").hide();
        this.transactionService
            .GetConfigList('product_repay_list')
            .subscribe(
                data => {

                    this.datList = this.rePayList = RePay.parseJSONArray(data);
                    this.reloadDataList();
                },
                error => {

                }
            );
    }


    private initObject() {
        this.setupSlideView();

    }

    private setupSlideView() {

        const options = {
            horizontal: true,

            //Item base navigation
            itemNav: 'forceCentered', // 'basic','centered','forceCentered'
            smart: true,
            activateOn: 'click',
            activateMiddle: true,

            //Scrolling
            scrollBy: 0,

            //Mix options
            speed: 1200,
            easing: 'easeOutExpo',

            //Dragging
            mouseDragging: true,
            touchDragging: true,
            releaseSwing: true,
            elasticBounds: false,
            dragHandle: true,
            dynamicHandle: true,
            clickBar: false
        };

        const $frame1 = $('.frame1');
        $frame1.sly(options);
        $frame1.sly("activate", 0, true);
        $frame1.sly('on', 'active', function (e, index) {

        });
    }

    private reloadDataList() {
        setTimeout(() => {
            $(".slidee>li").show();
            $('.frame1').sly("destroy");
            this.setupSlideView();
        }, 500);
    }

    public onClickBack() {

        if (this.datList[0] instanceof RePay) {
            this.isSelectingCategory = true;
            this.datList = this.serviceCategoryList;
            this.reloadDataList();

        } else {
            this.router.navigate(["kk"]);
        }

    }

    public onClickDetail(data: any) {

        if (this.isSelectingCategory) {

            this.dataService.selectedService = data;
            if (data.code === "00") {
                this.isSelectingCategory = !this.isSelectingCategory;
                this.getRepayList();
                return;
            }

        }

        setTimeout(() => {
            this.router.navigate(["kk", "service", "detail"]);
        }, 500);

    }

}
