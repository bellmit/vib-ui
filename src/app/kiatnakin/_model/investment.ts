import {PaymentType, Transaction} from "./transaction";
import {isNullOrUndefined} from "util";

export class Investment extends Transaction {

    estimateEffectiveDate;
    cutOffTime;
    fundSuitAndExchange = {
        FundSuitLevel: "",
        ExchangeFlag: ""
    };
    selectedFund;
    selectedHolder;
    selectedFundSwitchIn;
    selectedHolderSwitchIn;

    refName;
    profileCode;
    insertOrderBuyAndPrePayment;
    paymentAndUpdateStatus;

    insertOrderSell;
    insertOrderSwitch;

}