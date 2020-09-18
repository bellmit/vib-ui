import { Routes } from "@angular/router";
import {
    HomeGuard,
    LoggedInGuard,
    SelectAccountGuard,
    SelectMutualfundAccountGuard,
    SelectOutstandingGuard,
    SelectServiceGuard
} from "./_guard/index";
import { LoginComponent } from "./service-module/login/login.component";
import { CreateBankAccountComponent } from "./service-module/bank-account/create-bank-account/create-bank-account.component";
import { DepositTypeComponent } from "./service-module/bank-account/deposit-type/deposit-type.component";
import { SelectBankAccountComponent } from "./user-module/select-bank-account/select-bank-account.component";
import { SelectMutualfundAccountComponent } from "./user-module/select-mutualfund-account/select-mutualfund-account.component";
import { TransactionBankComponent } from "./user-module/transaction-bank/transaction-bank.component";
import { TransactionMutualfundComponent } from "./user-module/transaction-mutualfund/transaction-mutualfund.component";
import { NavDetailComponent } from './user-module/nav-detail/nav-detail.component';
import { TransferComponent } from "./service-module/transfer/transfer.component";
import { HomeComponent } from "./home/home.component";
import { ChequeScannerComponent } from "./service-module/cheque/cheque-scanner/cheque-scanner.component";
import { ChequeBuyComponent } from "./service-module/cheque/cheque-buy/cheque-buy.component";
import { CatalogComponent } from "./service-module/asset-catalog/catalog.component";
import { ServiceComponent } from "./service-module/payment/service/service.component";
import { ServiceDetailComponent } from "./service-module/payment/service/service-detail.component";
import { PaymentMethodComponent } from "./service-module/payment/payment-method/payment-method.component";
import { PaymentScanqrComponent } from "./service-module/payment/payment-scanqr/payment-scanqr.component";
import { PaymentInputBarcodeComponent } from "./service-module/payment/payment-input-barcode/payment-input-barcode.component";
import { PaymentDetailComponent } from "./service-module/payment/payment-detail/payment-detail.component";
import { DepositComponent } from "./service-module/deposit/deposit.component";
import { WithdrawComponent } from "./service-module/withdraw/withdraw.component";
import { SelectTdPrincipalComponent } from "./user-module/select-td-principal/select-td-principal.component";
import { SelectTdPrincipalByIndexComponent } from "./user-module/select-td-principal-by-index/select-td-principal-by-index.component";
import { EnquiryComponent } from "./service-module/payment/enquiry/enquiry.component";
import { TransactiontypeComponent } from "./user-module/transaction-type/transactiontype.component";
import { RequestComponent } from './service-module/request/request.component';
import { SubscriptionAccountComponent } from "./service-module/subscription/subscription-account/subscription-account.component";
import { SubUsernamepasswordComponent } from "./service-module/subscription/sub-usernamepassword/sub-usernamepassword.component";
import { SubSmarsmsComponent } from "./service-module/subscription/sub-smarsms/sub-smarsms.component";
import { SubPhoneserviceComponent } from "./service-module/subscription/sub-phoneservice/sub-phoneservice.component";
import { SubMypinComponent } from "./service-module/subscription/sub-mypin/sub-mypin.component";
import { InvestmentComponent } from "./service-module/investment/investment.component";
import { SelectInvestmentPrincipalComponent } from "./user-module/select-investment-principal/select-investment-principal.component";
import { CompleteSlipComponent } from "./_share/complete-slip/complete-slip.component";
import { CashierChequeBuyComponent } from "./service-module/cheque/cashier-cheque-buy/cashier-cheque-buy.component";
import { CurrentChequeBuyComponent } from "./service-module/cheque/current-cheque-buy/current-cheque-buy.component";
import { PurchaseComponent } from "./service-module/investment/purchase/purchase.component";
import { RedeemComponent } from "./service-module/investment/redeem/redeem.component";
import { SwitchComponent } from "./service-module/investment/switch/switch.component";
import { TermMutualfundComponent } from "./service-module/investment/term-mutualfund/term-mutualfund.component";
import { AcceptedTermMutualFundGuard } from "./_guard/acceptedTermMutualFund.guard";
import { FundListComponent } from "./service-module/investment/fund-list/fund-list.component";
import { RemoteComponent } from "./service-module/remote/remote.component";
import { CatalogDetailComponent } from "app/kiatnakin/service-module/asset-catalog/catalog-detail/catalog-detail.component";
import { AbsorptionComponent } from "./service-module/absorption/absorption.component";
import { SuitabilityComponent } from "app/kiatnakin/service-module/investment/suitability/suitability.component";
import { TestComponentComponent } from "app/kiatnakin/user-module/test-component/test-component.component";
import { SuitQuestionComponent } from './service-module/investment/suitability/suit-question/suit-question.component';
import { PurchaseFundComponent } from './user-module/fund-management/purchase-fund/purchase-fund.component';
import { MenuFundManagementComponent } from './user-module/fund-management/menu-fund-management/menu-fund-management.component';
import { RedeemFundComponent } from './user-module/fund-management/redeem-fund/redeem-fund.component';
import { SwitchFundComponent } from './user-module/fund-management/switch-fund/switch-fund.component';
import { CancelFundComponent } from './user-module/cancel-fund/cancel-fund.component';
import { RiskTableComponent } from './user-module/risk-table/risk-table.component';

export const KKRoutes: Routes = [

    {
        path: "", component: HomeComponent,
        canActivate: [HomeGuard]
    }, {
        path: "login", component: LoginComponent
    }, {
        path: "createBankAccount", component: CreateBankAccountComponent
    }, {
        path: "depositType", component: DepositTypeComponent
    }, {
        path: "catalog", component: CatalogComponent
    }, {
        path: "catalogDetail", component: CatalogDetailComponent
    }, {
        path: "selectBankAccount", component: SelectBankAccountComponent,
        canActivate: [LoggedInGuard]
    }, {
        path: "selectTDPrincipal", component: SelectTdPrincipalComponent
    }, {
        path: "selectTDPrincipalByIndex", component: SelectTdPrincipalByIndexComponent,
    }, {
        path: "transactionBank", component: TransactionBankComponent,
        canActivate: [SelectAccountGuard]
    }, {
        path: "selectMutualfundAccount", component: SelectMutualfundAccountComponent,
        canActivate: [LoggedInGuard, AcceptedTermMutualFundGuard]
    }, {
        path: "transactionMutualfund", component: TransactionMutualfundComponent,
        canActivate: [SelectMutualfundAccountGuard]
    }, {
        path: "navDetail", component: NavDetailComponent,
        canActivate: [SelectOutstandingGuard]
    }, {
        path: "riskTable", component: RiskTableComponent,
        canActivate: [LoggedInGuard, AcceptedTermMutualFundGuard]
    }, {
        path: "transfer", component: TransferComponent
    }, {
        path: "chequeScanner", component: ChequeScannerComponent
    }, {
        path: "chequeBuy", component: ChequeBuyComponent,
        canActivate: [LoggedInGuard, SelectAccountGuard]
    }, {
        path: "service", component: ServiceComponent
    }, {
        path: "service/detail", component: ServiceDetailComponent,
        canActivate: [SelectServiceGuard]
    }, {
        path: "payment", component: PaymentMethodComponent,
        canActivate: [SelectServiceGuard]
    }, {
        path: "payment/scan", component: PaymentScanqrComponent,
        canActivate: [SelectServiceGuard]
    }, {
        path: "payment/code", component: PaymentInputBarcodeComponent,
        canActivate: [SelectServiceGuard]
    }, {
        path: "payment/detail", component: PaymentDetailComponent
    }, {
        path: "deposit", component: DepositComponent
    }, {
        path: "withdraw", component: WithdrawComponent
    }, {
        path: "transactiontype", component: TransactiontypeComponent
        , canActivate: [LoggedInGuard]
    }, {
        path: "enquiry", component: EnquiryComponent
        , canActivate: [LoggedInGuard]
    }, {
        path: "request", component: RequestComponent,
        canActivate: [LoggedInGuard]
    }, {
        path: "selectInvestPrincipal", component: SelectInvestmentPrincipalComponent
    }, {
        path: "slip", component: CompleteSlipComponent
    }, {
        path: 'subscription',
        children: [
            { path: "account", component: SubscriptionAccountComponent },
            { path: "usernamepassword", component: SubUsernamepasswordComponent },
            { path: "smartsms", component: SubSmarsmsComponent },
            { path: "phoneservice", component: SubPhoneserviceComponent },
            { path: "mypin", component: SubMypinComponent }
        ]
    }, {
        path: "cashierChqBuy", component: CashierChequeBuyComponent
    }, {
        path: "currentChqBuy", component: CurrentChequeBuyComponent
    }, {
        path: "termMutualFund", component: TermMutualfundComponent,
        canActivate: [LoggedInGuard]
    }, {
        path: "suitability", component: SuitabilityComponent,
        canActivate: [LoggedInGuard]
    }, {
        path: "suit-question", component: SuitQuestionComponent,
        canActivate: [LoggedInGuard, AcceptedTermMutualFundGuard]
    }, {
        path: "investment",
        canActivate: [LoggedInGuard, AcceptedTermMutualFundGuard],
        children: [
            { path: "", component: InvestmentComponent },
            { path: "fundList", component: FundListComponent },
            { path: "purchase", component: PurchaseComponent },
            { path: "redeem", component: RedeemComponent },
            { path: "switch", component: SwitchComponent },
        ]
    }, {
        path: "remote", component: RemoteComponent
    }, {
        path: "absorption", component: AbsorptionComponent
    }, {
        path: "test", component: TestComponentComponent
    }, {
        path: "fund-management",
        canActivate: [LoggedInGuard, AcceptedTermMutualFundGuard, SelectMutualfundAccountGuard],
        children: [
            { path: "", component: MenuFundManagementComponent },
            { path: "purchase", component: PurchaseFundComponent },
            { path: "redeem", component: RedeemFundComponent },
            // { path: "switch_out", component: RedeemFundComponent },
            // { path: "switch_in", component: PurchaseFundComponent },
            { path: "switch_in", component: SwitchFundComponent },
            { path: "switch_out", component: SwitchFundComponent },
            { path: "cancelFund", component: CancelFundComponent },
            { path: "selectBankAccount-fund", component: SelectBankAccountComponent },
            { path: "transfer-fund", component: TransferComponent },
        ]
    }
];
