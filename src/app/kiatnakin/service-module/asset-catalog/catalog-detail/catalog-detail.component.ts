import { Component, OnInit, Output, EventEmitter, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from '@angular/common';
import { DataService } from 'app/kiatnakin/_service';
import { Product } from 'app/kiatnakin/_model/Product';
import { ProductService } from 'app/kiatnakin/_service/api/product.service';
import { Modal } from "../../../_share/modal-dialog/modal-dialog.component"
import { forEach } from '@angular/router/src/utils/collection';
import { isNullOrUndefined } from 'util';
import { Utils } from '../../../../share/utils';
import { AppConstant } from 'app/share/app.constant';
import { ValueTransformer } from '@angular/compiler/src/util';
import { UserService } from '../../../_service/user.service';
import { InvestmentService } from '../../../_service/api/investment.service';


@Component({
  selector: 'catalog-detail',
  templateUrl: './catalog-detail.component.html',
  styleUrls: ['./catalog-detail.component.sass',
    '../../../_template/template-flip-book/template-flip-book.component.sass']
})

export class CatalogDetailComponent implements OnInit {

  public currentPageIndex = 0;
  public isShowCloseButton: boolean = true;
  public savingBook = null;
  public isClosed = false;
  public coverImage;
  public product: Product = new Product();
  public productList = [];
  public productDetail = [];
  public isProductNew: boolean = false;
  public isShowType4: boolean = false;
  public isShowType2: boolean = false;
  public imgPart: string = "./assets/kiatnakin/image/";
  public ShowBTN: boolean = false;
  public ShowBTN_login: boolean = false;
  public check: any = [];
  public prodType: any = [];
  public prodType1: any = [];
  public prodType2: any = [];
  public prodType3: any = [];

  constructor(
    private router: Router,
    private location: Location,
    public dataService: DataService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private investmentService: InvestmentService,
  ) {
    dataService.selectedDepositType = this.activatedRoute.snapshot.queryParams['type'] || '';
    this.coverImage = this.activatedRoute.snapshot.queryParams['c'] || '';
    this.productList = this.dataService.selectedProductList;
    console.log('DATA PRODUCT LIST: ', this.productList)
    this.productDetail = this.dataService.selectedProductDetail;
    window["cornerSize"] = 50

    Utils.logDebug('constructor', 'dataService.selectedDepositType : ' + dataService.selectedDepositType);
    Utils.logDebug('constructor', 'this.productList : ' + this.productList);
    Utils.logDebug('constructor', 'this.productDetail : ' + this.productDetail);
  }

  ngOnInit() {
    Utils.logDebug('ngOnInit', 'this.dataService.selectedProductList : ' + this.dataService.selectedProductList);
    this.setShowCloseButton(false);
    setTimeout(() => {
      this.setTemplate(this.dataService.selectedDepositType);
    }, 1000);
  }

  public setShowCloseButton(bool: boolean) {
    this.isShowCloseButton = bool;
  }

  public closeBook() {
    this.setShowCloseButton(false);
    this.isClosed = true;
    this.savingBook
      .turn("page", 2)
      .turn('stop')
      .turn("page", 1);
  }

  public onClickClose() {
    this.closeBook();
    setTimeout(() => {
      this.savingBook.fadeOut();
      this.location.back();
    }, 800);
  }

  public goToTransactionType() {
    this.closeBook();
    setTimeout(() => {
      this.savingBook.fadeOut();
      this.router.navigate(['kk', 'termMutualFund']);
    }, 800);
  }

  public updateCurrentPage(index: number) {
    this.currentPageIndex = index;
  }

  public onFlipInit(flipObject) {
    this.savingBook = flipObject;
  }

  public onStart($event) {
  }

  public onTurning($page) {
    this.updateCurrentPage($page.index);
    if (this.currentPageIndex < 1) {
      this.setShowCloseButton(false);
    }
  }

  public onTurned($page) {
    this.setShowCloseButton(($page.index > 1) ? true : false);

    if ($page.index === 1 && !this.isClosed) {
      if (this.savingBook) {
        const that = this;
        setTimeout(function () {
          that
            .location
            .back();
        }, 500);
      }
    }
  }

  public onEnd($page) {
    this.setShowCloseButton($page.index !== 1)
  }

  public onOpenSection(type, prod_id) {
    const that = this;
    // const filterSMS = this.productList.filter(x => x.PROD_ID === prod_id)[0];
    // if (filterSMS.PROD_TYPE === 'SMS') {
    //   this.ShowBTN = false;
    // } else {
    //   this.ShowBTN = true;
    // }
    this.productDetail.forEach(function (element, index) {

      if (prod_id === element.prodId) {
        that.savingBook.turn("page", (index * 2) + 4)
      }
    })
  }

  public onSubmitOpenAccount(prodId) {
    this.setProduct(prodId);
    this.closeBook();

    setTimeout(() => {
      this
        .router
        .navigate(["kk", "subscription", "account"], { queryParams: { coverImage: this.coverImage, type: this.dataService.selectedDepositType } });
    }, 900);

  }

  public setProduct(product_Id) {
    const product = this.productList.filter(value => value.PROD_ID === product_Id);
    if (!isNullOrUndefined(product)) {
      this.product.PROD_CODE = product[0].PROD_ID;
      this.product.PROD_DESC = product[0].PROD_NAME;
      this.product.PROD_TYPE = product[0].PROD_TYPE;
      this.product.PROD_TYPE_DESC = product[0].PROD_TYPE_DESC;
    }

    this.dataService.selectedProduct = this.product;

  }

  public setTemplate(type) {
    Utils.logDebug('setTemplate', 'start');
    Utils.logDebug('setTemplate', 'type : ' + type);
    Utils.logDebug('setTemplate', 'productList : ' + JSON.stringify(this.productList));
    switch (type) {
      case "account":
        this.prepareDataTemplateAccount();
        break;
      case "other":
        this.prepareDataTemplateOther();
        break;
      case "insurance":
        this.prepareDataTemplateInsurance();
        break;
      case "loan":
        this.prepareDataTemplateLoan();
        break;
      case "investment":
        this.prepareDataTemplateInvestment();
        break
      default:
        break

    }
  }

  public prepareDataTemplateAccount() {
    this.ShowBTN = true;
    this.product.prod_title_TH = 'บัญชีแนะนำ';
    this.product.prod_title_EN = 'Recommend';

    if (!isNullOrUndefined(this.productList)) {
      this.isShowType4 = true;
      // this.product.prod.prod_New = this.productList.filter(value => value.PROD_NEW === 'Y');
      // this.productList.map(productType => {
      //   this.prodType = productType.PROD_TYPE}
      this.prodType = this.productList.filter(value => value.PROD_TYPE === AppConstant.ProdTypeSaving);
      if (this.prodType.length !== 0) {
        this.product.prod.product1 = this.productList.filter(value => value.PROD_TYPE === AppConstant.ProdTypeSaving);
        this.product.special.sp_1 = [Utils.shuffle(this.product.prod.product1).shift()];
        this.product.productList.data1 = this.product.prod.product1;
        this.product.prod.prod_type1 = 'ออมทรัพย์';
      }

      this.prodType1 = this.productList.filter(value => value.PROD_TYPE === AppConstant.ProdTypeFix);
      if (this.prodType1.length !== 0) {
        this.product.prod.product2 = this.productList.filter(value => value.PROD_TYPE === AppConstant.ProdTypeFix);
        this.product.special.sp_2 = [Utils.shuffle(this.product.prod.product2).shift()];
        this.product.productList.data2 = this.product.prod.product2;
        this.product.prod.prod_type2 = 'ฝากประจำ';
      } else { this.isShowType2 = true; }

      this.prodType2 = this.productList.filter(value => value.PROD_TYPE === AppConstant.ProdTypeCurrent);
      if (this.prodType2.length !== 0) {
        this.product.prod.product3 = this.productList.filter(value => value.PROD_TYPE === AppConstant.ProdTypeCurrent);
        this.product.special.sp_3 = [Utils.shuffle(this.product.prod.product3).shift()];
        this.product.productList.data3 = this.product.prod.product3;
        this.product.prod.prod_type3 = 'กระแสรายวัน';
      }
      // this.isShowType4 = true;
      // this.isProductNew = true;
    } else {
      Utils.logDebug('setTemplate', 'redirectToMain');
      this.redirectToMain();
    }
  }

  public prepareDataTemplateOther() {
    this.ShowBTN = true;
    this.product.prod_title_TH = 'บริการอื่นๆ';
    this.product.prod_title_EN = 'Services';
    if (!isNullOrUndefined(this.productList)) {
      this.prodType = this.productList.filter(value => value.PROD_TYPE === 'SMS');
      if (this.prodType.length !== 0) {
        this.product.prod.product1 = this.productList.filter(value => value.PROD_TYPE === 'SMS');
        this.product.special.sp_1 = [Utils.shuffle(this.product.prod.product1).shift()];
        this.product.productList.data1 = this.product.prod.product1;
        this.product.prod.prod_type1 = 'Smart SMS';
      }

      this.prodType1 = this.productList.filter(value => value.PROD_TYPE === 'PromptPay');
      if (this.prodType1.length !== 0) {
        this.product.prod.product2 = this.productList.filter(value => value.PROD_TYPE === 'PromptPay');
        this.product.special.sp_2 = [Utils.shuffle(this.product.prod.product2).shift()];
        this.product.productList.data2 = this.product.prod.product2;
        this.product.prod.prod_type2 = 'PromptPay';
      } else { this.isShowType2 = true; }

      this.prodType2 = this.productList.filter(value => value.PROD_TYPE === 'Debit Card');
      if (this.prodType2.length !== 0) {
        this.product.prod.product3 = this.productList.filter(value => value.PROD_TYPE === 'Debit Card');
        this.product.special.sp_3 = [Utils.shuffle(this.product.prod.product3).shift()];
        this.product.productList.data3 = this.product.prod.product3;
        this.product.prod.prod_type3 = 'Debit Card';
      }

      this.prodType3 = this.productList.filter(value => value.PROD_TYPE === 'eBanking');
      if (this.prodType3.length !== 0) {
        this.product.prod.product4 = this.productList.filter(value => value.PROD_TYPE === 'eBanking');
        this.product.special.sp_4 = [Utils.shuffle(this.product.prod.product4).shift()];
        this.product.productList.data4 = this.product.prod.product4;
        this.product.prod.prod_type4 = 'e-Banking';
      } else { this.isShowType4 = true }

    } else {
      Utils.logDebug('setTemplate', 'redirectToMain');
      this.redirectToMain();
    }
  }

  public prepareDataTemplateInsurance() {
    this.product.prod_title_TH = 'ประกัน';
    this.product.prod_title_EN = 'Insurance';
    if (!isNullOrUndefined(this.productList)) {
      this.prodType = this.productList.filter(value => value.PROD_TYPE === 'ประกันชีวิต');
      if (this.prodType.length !== 0) {
        this.product.prod.product1 = this.productList.filter(value => value.PROD_TYPE === 'ประกันชีวิต');
        this.product.special.sp_1 = [Utils.shuffle(this.product.prod.product1).shift()];
        this.product.productList.data1 = this.product.prod.product1;
        this.product.prod.prod_type1 = 'ประกันชีวิต';
      }

      this.prodType1 = this.productList.filter(value => value.PROD_TYPE === 'ประกันสุขภาพ');
      if (this.prodType1.length !== 0) {
        this.product.prod.product2 = this.productList.filter(value => value.PROD_TYPE === 'ประกันสุขภาพ');
        this.product.special.sp_2 = [Utils.shuffle(this.product.prod.product2).shift()];
        this.product.productList.data2 = this.product.prod.product2;
        this.product.prod.prod_type2 = 'ประกันสุขภาพ';
      } else { this.isShowType2 = true; }

      this.prodType2 = this.productList.filter(value => value.PROD_TYPE === 'ประกันวินาศภัย');
      if (this.prodType2.length !== 0) {
        this.product.prod.product3 = this.productList.filter(value => value.PROD_TYPE === 'ประกันวินาศภัย');
        this.product.special.sp_3 = [Utils.shuffle(this.product.prod.product3).shift()];
        this.product.productList.data3 = this.product.prod.product3;
        this.product.prod.prod_type3 = 'ประกันวินาศภัย';
      }

      this.prodType3 = this.productList.filter(value => value.PROD_TYPE === 'ประกันชีวิตแบบอินเวส ลิงค์');
      if (this.prodType3.length !== 0) {
        this.product.prod.product4 = this.productList.filter(value => value.PROD_TYPE === 'ประกันชีวิตแบบอินเวส ลิงค์');
        this.product.special.sp_4 = [Utils.shuffle(this.product.prod.product4).shift()];
        this.product.productList.data4 = this.product.prod.product4;
        this.product.prod.prod_type4 = 'ประกันชีวิตแบบอินเวส ลิงค์';
      } else { this.isShowType4 = true }

    } else {
      Utils.logDebug('setTemplate', 'redirectToMain');
      this.redirectToMain();
    }
  }

  public prepareDataTemplateLoan() {
    this.product.prod_title_TH = 'สินเชื่อ';
    this.product.prod_title_EN = 'Loan';
    if (!isNullOrUndefined(this.productList)) {
      this.prodType = this.productList.filter(value => value.PROD_TYPE === 'สินเชื่อรถยนต์');
      if (this.prodType.length !== 0) {
        this.product.prod.product1 = this.productList.filter(value => value.PROD_TYPE === 'สินเชื่อรถยนต์');
        this.product.special.sp_1 = [Utils.shuffle(this.product.prod.product1).shift()];
        this.product.productList.data1 = this.product.prod.product1;
        this.product.prod.prod_type1 = 'สินเชื่อรถยนต์';
      }

      this.prodType1 = this.productList.filter(value => value.PROD_TYPE === 'สินเชื่อบุคคล');
      if (this.prodType1.length !== 0) {
        this.product.prod.product2 = this.productList.filter(value => value.PROD_TYPE === "สินเชื่อบุคคล");
        this.product.special.sp_2 = [Utils.shuffle(this.product.prod.product2).shift()];
        this.product.productList.data2 = this.product.prod.product2;
        this.product.prod.prod_type2 = 'สินเชื่อบุคคล';
      } else { this.isShowType2 = true; }

      this.prodType2 = this.productList.filter(value => value.PROD_TYPE === 'สินเชื่อบ้าน');
      if (this.prodType2.length !== 0) {
        this.product.prod.product3 = this.productList.filter(value => value.PROD_TYPE === 'สินเชื่อบ้าน');
        this.product.special.sp_3 = [Utils.shuffle(this.product.prod.product3).shift()];
        this.product.productList.data3 = this.product.prod.product3;
        this.product.prod.prod_type3 = 'สินเชื่อบ้าน';
      }

      this.prodType3 = this.productList.filter(value => value.PROD_TYPE === 'สินเชื่อธุรกิจ');
      if (this.prodType3.length !== 0) {
        this.product.prod.product4 = this.productList.filter(value => value.PROD_TYPE === 'สินเชื่อธุรกิจ');
        this.product.special.sp_4 = [Utils.shuffle(this.product.prod.product4).shift()];
        this.product.productList.data4 = this.product.prod.product4;
        this.product.prod.prod_type4 = 'สินเชื่ออื่นๆ';
      } else { this.isShowType4 = true; }

    } else {
      Utils.logDebug('setTemplate', 'redirectToMain');
      this.redirectToMain();
    }
  }

  public prepareDataTemplateInvestment() {
    this.ShowBTN_login = true;
    this.product.prod_title_TH = 'กองทุน';
    this.product.prod_title_EN = 'Investment';
    this.isShowType4 = true;
    if (!isNullOrUndefined(this.productList)) {
      this.prodType = this.productList.filter(value => value.PROD_TYPE === 'กองทุนเปิดภัทร');
      console.log('กองทุน 1', this.prodType)
      if (this.prodType.length !== 0) {
        this.product.prod.product1 = this.productList.filter(value => value.PROD_TYPE === 'กองทุนเปิดภัทร');
        this.product.special.sp_1 = [Utils.shuffle(this.product.prod.product1).shift()];
        this.product.productList.data1 = this.product.prod.product1;
        this.product.prod.prod_type1 = 'กองทุนเปิดภัทร';
      }

      this.prodType1 = this.productList.filter(value => value.PROD_TYPE === 'LTF');
      console.log('กองทุน 2', this.prodType1)
      if (this.prodType1.length !== 0) {
        this.product.prod.product2 = this.productList.filter(value => value.PROD_TYPE === 'LTF');
        this.product.special.sp_2 = [Utils.shuffle(this.product.prod.product2).shift()];
        this.product.productList.data2 = this.product.prod.product2;
        this.product.prod.prod_type2 = 'LTF';
      } else { this.isShowType2 = true }

      this.prodType2 = this.productList.filter(value => value.PROD_TYPE === 'RMF');
      console.log('กองทุน 3', this.prodType2)
      if (this.prodType2.length !== 0) {
        this.product.prod.product3 = this.productList.filter(value => value.PROD_TYPE === 'RMF');
        this.product.special.sp_3 = [Utils.shuffle(this.product.prod.product3).shift()];
        this.product.productList.data3 = this.product.prod.product3;
        this.product.prod.prod_type3 = 'RMF';
      }

    } else {
      Utils.logDebug('setTemplate', 'redirectToMain');
      this.redirectToMain();
    }
  }

  public onClickNextPage() {
    this.savingBook.turn("next");
  }

  public onClickPreviuesPage() {
    this.savingBook.turn("previous");
  }

  public redirectToMain() {
    const that = this;
    that.router.navigate(["/kk"]);
  }
}
