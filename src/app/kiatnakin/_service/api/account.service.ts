import { Injectable } from '@angular/core';
import { APIService } from "./api.service";
import { API, JSONKey, AppConstant } from "../../../share/app.constant";
import { UserService } from "../user.service";
import { BankAccount } from "../../_model/bankAccount";
import { TermDepositList } from "../../_model/termDepositList";
import { Utils } from "../../../share/utils";
import { RegisterService } from "./register.service";
import { Register } from "../../_model/register";
import { debug } from "util";

@Injectable()
export class AccountService {

    public register: Register;

    constructor(private apiService: APIService,
        private registerService: RegisterService,
        private userService: UserService) {
    }

    getAccountList() {
        const idCardNo = '' + this.userService.getUser().idNumber
        const idType = this.userService.getUser().idType
        const json = {
            [JSONKey.IDNo]: idCardNo,
            [JSONKey.IDType]: idType
        };

        const url = API.GetAccountListsByIDCard;
        console.log('AccountService 999 --- bass url ->', url);
        console.log('AccountService --- bass apiService.postVIBWithHeader ->', this.apiService.postVIBWithHeader(url, json).map(jsonData => BankAccount.parseJSONArray(jsonData, idCardNo)));
        return this.apiService.postVIBWithHeader(url, json).map(jsonData => BankAccount.parseJSONArray(jsonData, idCardNo));
    }

    getaccountlistbyidcard(register: Register) {
        console.log(register);
        const json = {
            [JSONKey.IDNo]: register.ssu.cardInfo.idCardNumber,
            [JSONKey.IDType]: AppConstant.IdType
        };

        const url = API.GetAccountListsByIDCard;
        return this.apiService.postVIBWithHeader(url, json);
    }

    getaccountlistbyidcardForSelector(idNumber) {
        const json = {
            [JSONKey.IDNo]: idNumber,
            [JSONKey.IDType]: AppConstant.IdType
        };

        const url = API.GetAccountListsByIDCard;
        return this.apiService.postVIBWithHeader(url, json);
    }

    getAccountDetail(accountNo: string) {

        const json = {
            [JSONKey.AccountNo]: accountNo
        };

        const url = API.AccountDetails;
        return this.apiService.postVIBWithHeader(url, json).map(jsonData => new BankAccount(jsonData.data))

    }

    getAccountTDDetail(account: string) {
        const json = {
            [JSONKey.AccountNo]: account
        };

        const url = API.AccountTDDetails;
        return this.apiService.postVIBWithHeader(url, json).map(jsonData => new BankAccount(jsonData.data))
    }

    getTermDepositList(accountNo: string) {
        const json = {
            [JSONKey.TD_Account_No]: accountNo
        };

        const url = API.GetTDTermList;
        return this.apiService.postVIBWithHeader(url, json).map(jsonData => TermDepositList.parseJSONArray(jsonData.data));
    }

    generateOTP(dataService, card_id: string, txn_type: string, id_type: string) {
        const json = {
            ["card_id"]: card_id,
            ["msg_language"]: "TH",
            ["txn_type"]: txn_type,
            ["account_to"]: dataService.to.accountNumber,
            ["amount"]: dataService.amount,
            ["id_type"]: id_type
        }

        const url = API.GenerateOTP;
        return this.apiService.postVIBWithHeader(url, json)
    }

    verifyOTP(tokenUUID: string, referenceNo: string, otp: string) {
        const json = {
            [JSONKey.TokenUUID]: tokenUUID,
            ["reference_no"]: referenceNo,
            [JSONKey.OTP]: otp,
            [JSONKey.ClientIP]: Utils.getClientIP()
        };

        const url = API.VerifyOTP;
        return this.apiService.postVIBWithHeader(url, json);
    }

    getotp() {
        const url = API.Getotp;
        return this.apiService.get(url)
    }

    checkExistingCustomerAndSanctionList(idCard: string, chipNo: string, requestNo: string, birthdate: string, idType: string, firstName: string, lastName: string) {

        if (idType === 'N' || idType === 'E') {
            idType = AppConstant.IdType;
        }
        console.log(idType);
        const json = {
            "id_no": idCard,
            "id_type": idType,
            "first_name_th": firstName,
            "last_name_th": lastName,
        };

        const url = API.CheckExistingCustomerAndSanctionList;

        return this.apiService.postVIBWithHeader(url, json, false)
            .flatMap(
                data => {
                    console.log(data.data);
                    if (data.data.customerExist) {
                        Utils.logDebug('checkExistingCustomerAndSanctionList', 'getCustomerProfileMain');
                        return this.getCustomerProfileMain(idCard, AppConstant.IdType).map(profileMain => {
                            data.data.profileMain = profileMain.data;
                            return data;
                        });
                    }
                    else {
                        return [data];
                    }
                }
            )
            .flatMap(
                data => {
                    if (data.data.customerExist) {
                        Utils.logDebug('checkExistingCustomerAndSanctionList', 'getGetSubscriptionInfo');
                        return this.getGetSubscriptionInfo(idCard).map(
                            subAddress => {
                                data.data.subAddress = subAddress.data;
                                return data;
                            });
                    }
                    else {
                        return [data];
                    }
                }
            )
            .flatMap(
                data => {
                    if (data.data.customerExist) {
                        Utils.logDebug('checkExistingCustomerAndSanctionList', 'getCustomerAddress');
                        const customerNo = data.data.profileMain.CUSTPROFILEMAINSUB_LIST.CUSTPROFILEMAIN_INFO.CISID;
                        return this.getCustomerAddress(customerNo).map(
                            cusAddress => {
                                data.data.cusAddress = cusAddress.data;
                                return data;
                            });
                    }
                    else {
                        return [data];
                    }
                }
            )

    }

    getCustomerProfileSub(idCard: string, idType: string) {
        const json = {
            "card_id": idCard,
            "cisid": "",
            "firstname": "",
            "id_type": idType,
            "kkcisid": "",
            "mobile_no": "",
            "prod_group": "",
            "subscription_ref_no": "",
            "surname": ""
        };
        const url = API.GetCustomerProfileSub;
        return this.apiService.postVIBWithHeader(url, json)
    }

    getCustomerProfileMain(idCard: string, idType: string) {
        const json = {
            'card_id': idCard,
            'cisid': '',
            'firstname': '',
            'id_type': idType,
            'mobile_no': '',
            'surname': ''
        };
        console.log('getCustomerProfileMain => idType : ' + idType);
        const url = API.GetProfileMain;
        return this.apiService.postVIBWithHeader(url, json, false)
    }

    checkInternetBankingAndPin(idCard: string, idType: string) {
        const json = {
            "id_no": idCard,
            "id_type": idType,
        };

        const url = API.CheckInternetBankingAndPin;
        return this.apiService.postVIBWithHeader(url, json, false)
    }

    verifyidcard(idCard: string, chipNo: string, requestNo: string, birthdate: string, firstName: string, lastName: string, laser_no: string) {
        const json = {
            "id_card": idCard,
            "chip_card_no": chipNo,
            "id_card_request_no": requestNo,
            "first_name": firstName,
            "last_name": lastName,
            "birth_day": birthdate,
            "laser_no": laser_no
        };

        const url = API.Verifyidcard;
        return this.apiService.postVIBWithHeader(url, json)
    }

    getCustomerAddress(customerNo) {
        const json = {
            'address_id': '',
            'address_type': '',
            'branch_no': '',
            'cis_id': customerNo,
            'id_no': '',
            'id_type': ''
        };

        const url = API.GetCustomerAddress;
        return this.apiService.postVIBWithHeader(url, json, false)
    }

    getGetSubscriptionInfo(idCard) {
        const json = {
            ["id_no"]: idCard,
            ["id_type"]: AppConstant.IdType
        }
        const url = API.GetSubscriptionInfo;
        return this.apiService.postVIBWithHeader(url, json, false)
    }

    getJobId(register: Register, productType) {
        const json = {
            ["id_no"]: register.subscription.cardInfo.idCardNumber,
            ["id_type"]: AppConstant.IdType,
            ["ss_id"]: register.subscription_id,
            ["prod_type"]: productType
        }

        const url = API.GetJobId;
        return this.apiService.postVIBWithHeader(url, json);
    }
}
