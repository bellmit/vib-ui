import {
    Component,
    OnInit,
    Input,
    Output,
    SimpleChanges,
    SimpleChange,
    EventEmitter
} from '@angular/core';
import {Location} from '@angular/common';
import {Utils} from "../../../share/utils";
import {DataService} from 'app/kiatnakin/_service';
import { isNullOrUndefined } from 'util';
import {UserService} from "../../_service/user.service";
import { InvestmentService } from '../../_service/api/investment.service';
import { Modal } from '../../_share';
import * as moment from 'moment';

@Component({selector: 'template-fund-list', templateUrl: './template-fund-list.component.html', styleUrls: ['./template-fund-list.component.sass']})
export class TemplateFundListComponent implements OnInit {

    type = {
        fundList: "fundList",
        portfolio: "portfolio" ,
    }

    @Input('fundList')fundList;
    @Input('myPortList')myPortList;
    @Input('holderList')holderList;
    @Input('titleInvestType')titleInvestType;
    @Input('templateType')templateType;
    @Input('transactionType')transactionType;

    @Output()onSubmit = new EventEmitter();
    @Output()onSelectedHolder = new EventEmitter();

    public isDisplayFundFactSheet: Boolean = false;
    public portTransactionList = [];
    public portOrderStatusList = [];
    public fundListLTF = [];
    public fundListRMF = [];
    public fundListMF = [];
    public fundListPortfolio = [];
    public portList = [];
    public unitHolders = [];
    public selectedFundList ;
    public selectedUnitHolder;
    public NavDate = "";
    public isSelected = false;
    public customerSuitScore;
    public customerName;

    public pdfFectSheetData;
    public isViewOrderTransaction: boolean = false;

    constructor(private location: Location,
        private userService: UserService,
        private dataService: DataService,
        private investmentService: InvestmentService) {
        this.customerSuitScore = userService.getUser().suitScore;
        this.customerName = userService.getUserLoginFullName();
    }

    ngOnInit() {
        Utils.animate("#container", "slideInUp")
    }

    ngOnChanges(changes: SimpleChanges) {

        const dataFundList: SimpleChange = changes.fundList;
        const holderList: SimpleChange = changes.holderList;
        const myPortList: SimpleChange = changes.myPortList;


        if (!isNullOrUndefined(this.dataService.transaction) && !isNullOrUndefined(this.dataService.transaction.selectedHolder) ) {
            this.selectedUnitHolder = this.dataService.transaction.selectedHolder;
            this.didSplitFundListToLTFAndRMF()
        }

        if (holderList !== undefined  ) {

            holderList.currentValue.forEach(item => {
                const existing = this.unitHolders.filter(holder => holder.Unitholder === item.Unitholder)

                if (existing.length === 0) {
                    this.unitHolders.push(item)
                }
            });

            this.holderList = this.unitHolders;

            if (this.unitHolders.length > 0) {

                if (!isNullOrUndefined(this.selectedUnitHolder) ) {
                    this.holderList.filter(holder => holder.Unitholder === this.selectedUnitHolder.Unitholder).map(holder => holder.selected = true)
                }
                else {
                    this.holderList[0].selected = true;
                    this.selectedUnitHolder = this.dataService.transaction.selectedHolder =  this.holderList[0]
                }
                this.fundListPortfolio = this.fundList.filter(fund => fund.Unitholder === this.selectedUnitHolder.Unitholder)
                this.didSplitFundListToLTFAndRMF()
            }
        }

        if (dataFundList !== undefined  ) {
            this.fundList = dataFundList.currentValue;

            this.didSplitFundListToLTFAndRMF()
        }

        if (myPortList !== undefined  ) {
            this.myPortList = myPortList.currentValue;
            this.didSplitFundListToLTFAndRMF()
        }
    }

    didSplitFundListToLTFAndRMF() {

        if (this.templateType === this.type.portfolio) {
            if (! isNullOrUndefined(this.selectedUnitHolder)) {
                this.fundListPortfolio =  this.fundList.filter(fund => fund.Unitholder === this.selectedUnitHolder.Unitholder)
            }
        }
        else {
            if (! isNullOrUndefined(this.selectedUnitHolder)) {
                this.portList =  this.myPortList.filter(fund => fund.Unitholder === this.selectedUnitHolder.Unitholder)
                console.log("portList", this.portList)
            }

            this.fundListLTF = this
                .fundList
                .filter(fund => fund.FundType === 'LTF' && fund.IsComplex === "N" );

            this.fundListRMF = this
                .fundList
                .filter(fund => fund.FundType === 'RMF' && fund.IsComplex === "N" );

            this.fundListMF = this
                .fundList
                .filter(fund => fund.FundType === 'MF' && fund.IsComplex === "N" );
        }

        if (this.fundList.length > 0) {
            this.NavDate = this.fundList[0].NavDate
        }
    }

    onClickBack() {
        const that = this;
        Utils
            .animate("#container", "slideOutDown")
            .then(() => {
                that
                    .location
                    .back();
            });
    }

    onClickViewOrder() {
        Modal.showProgress();
        this.onClickSelectHolder(null, 0);
        this.isViewOrderTransaction = true;
        this.investmentService
            .getPortTransaction()
            .subscribe(
                res => {

                    if (!isNullOrUndefined(res.data[0])) {
                        this.portTransactionList = res.data[0].ListTrans.reverse()
                    }

                },
                error => {
                    Modal.showAlert(error.responseStatus.responseMessage)
                }
            );

        this.investmentService
            .getOrderStatus()
            .subscribe(
                res => {
                    this.portOrderStatusList = res.data
                },
                error => {
                    Modal.showAlert(error.responseStatus.responseMessage)
                }
            )
    }

    onClickSelectFund(selectedFund) {

        if ( this.templateType === this.type.fundList) {
            selectedFund.selected = !selectedFund.selected;
            this.isSelected = selectedFund.selected;

           this.isDisplayFundFactSheet = selectedFund.selected;
            this
                .fundList
                .map(fund => fund.FundCode !== selectedFund.FundCode
                    ? fund.selected = false
                    : fund.selected = selectedFund.selected);

            this
                .myPortList
                .map(fund => fund.FundCode !== selectedFund.FundCode
                    ? fund.selected = false
                    : fund.selected = selectedFund.selected);


           if (selectedFund.selected) {
                this.selectedFundList = selectedFund;
                if(this.transactionType === "purchase" || this.transactionType === "switch_in"){
                    this.onRequestGetPDFFundFactSheet()
                }
                else{
                    this.onClickSubmit()
                }
           }
        }

    }

    onRequestGetPDFFundFactSheet() {
        Modal.showProgress();
        Utils.animate("#fund-fact-sheet-container", "slideInUp")
        .then(() => {
             $("#fund-fact-sheet-container").removeClass(" slideInUp")
        });
        this.investmentService.GetFundFactByFundCode(this.selectedFundList.FundCode)
            .subscribe( dataPDF => {
                this.pdfFectSheetData =  `data:application/pdf;base64,${dataPDF.data.content}`

            },
            error => {
                //Modal.showAlert(error.responseStatus.responseMessage)
            })
    }

    onDismissFactSheetAndClearSelectData() {
        this.didClearSelectedFund();
        this.onDismissFactSheet()
    }

    onDismissFactSheet() {

        this.pdfFectSheetData = null;
        if($("#fund-fact-sheet-container").is(':visible')){
            Utils.animate("#fund-fact-sheet-container", "slideOutDown")
            .then(() => {
                $("#fund-fact-sheet-container").hide().removeClass(" slideOutDown")
            });
        }
    }

    public didClearSelectedFund() {
        this.selectedFundList = null;
        this.isSelected =  false;
        this.isDisplayFundFactSheet = false;
        this.fundList.forEach(fund => fund.selected = false);
        this.portList.forEach(fund => fund.selected = false)
    }

    onClickSelectHolder(_selectedHolder, index) {
        if (_selectedHolder == null) {
            this
            .unitHolders
            .forEach(holder => holder.selected = false);
            this.dataService.transaction.selectedHolder = this.selectedUnitHolder  = null;
            return
        }
        this.isViewOrderTransaction = false;
        this
            .unitHolders
            .forEach(holder => holder.selected = false);
            _selectedHolder.selected = true;


        //auto scroll onTab list visible ui tab
        const itemTabWidth = 170;
        const margin = 50;
        const tabContainerWidth = $("#div-tabbar").width();
        const position = ( ( (index + 1) * itemTabWidth) - tabContainerWidth ) + margin;

        if ( position > 0 ) {
            $('#div-tabbar').animate({
                scrollLeft: position
           }, 'slow');
        }
        this.dataService.transaction.selectedHolder = this.selectedUnitHolder  = _selectedHolder;
        this.onSelectedHolder.emit(_selectedHolder);
        this.didSplitFundListToLTFAndRMF();
        console.log("onClickSelectHolder", _selectedHolder)
    }

    onClickSubmit() {
        if (this.isSelected) {
            this.onDismissFactSheet();
            const selectedFund = this .fundList.filter(fund => fund.selected === true);
            const selectedMyPort = this.portList.filter(fund => fund.selected === true);

            const selectedHolder = this
                .unitHolders
                .filter(holder => holder.selected === true);

            this
                .onSubmit
                .emit({funds: selectedFund ? selectedFund : selectedMyPort, holder: selectedHolder[0]})
        }
    }

    parsTransType(transType) {
        let text = "-";
        switch (transType) {
            case "BU":
            case "Buy":
                text = "ซื้อ";
                break;
            case "SE":
            case "Sell":
                text = "ขาย";
                break;
            case "SO":
                text = "สับเปลี่ยนออก";
                break;
            case "SI":
                text = "สับเปลี่ยนเข้า";
                break;
        }
        return text
    }

    validateAllowCancelOrder(order) {
       return order.AllowCancel === 'Y' && order.Status === 'NEW'
    }

    didClickCancelOrder(order) {
        Modal.showConfirm(`ต้องการยกเลิกรายการ ${order.FundCode}`, () => {
            Modal.showProgress();
            this.investmentService
                .updateOrderCancel(order.Unitholder, order.TransID)
                .subscribe(
                    res => {
                        this.onClickViewOrder()
                    },
                    error => {
                        Modal.showAlert(error.responseStatus.responseMessage)
                    }
                )
        })
    }
}
