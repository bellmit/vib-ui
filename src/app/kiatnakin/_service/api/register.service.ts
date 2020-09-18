import { Injectable } from '@angular/core';
import { API, AppConstant, JSONKey } from "../../../share/app.constant";
import { Utils, Environment } from "../../../share/utils";
import { APIService } from "./api.service";
import { Register } from "../../_model/register";
import { debug, isNullOrUndefined } from "util";
import * as moment from 'moment';
import { AppComponent } from 'app/app.component';
import { DataService } from '../data.service';

@Injectable()
export class RegisterService {
    constructor(private apiService: APIService
        , public dataService: DataService) {
    }

    CheckSanctionListAndKYCLevel(register: Register) {
        const birthDay = Utils.changeDateFormat(register.ssu.cardInfo.birthdate) + "T00:00:00";
        const json = {
            ["business_sector_code"]: register.ssu.business.Id,
            ["business_type_code"]: "TH",
            ["country_code"]: "TH",
            ["country_of_citizen_ship"]: "TH",
            ["firstname_th"]: register.ssu.cardInfo.nameTH,
            ["id_no"]: register.ssu.cardInfo.idCardNumber,
            ["id_type"]: AppConstant.IdType,
            ["in_peplist_flag"]: "N",
            ["occupation_code"]: register.ssu.career.Id,
            ["province_code"]: register.ssu.cardInfo.address.provinceId,
            ["surname_th"]: register.ssu.cardInfo.surnameTH,
            ["birth_day"]: birthDay
        };

        const url = API.CheckSanctionListAndKYCLevel;
        return this.apiService.postVIBWithHeader(url, json);
    }

    // ["marital_code"]: register.ssu.spouse.status,
    // ["spouse_title_code"]: register.ssu.spouse.title.TH,
    // ["spouse_name_th"]: register.ssu.spouse.name.TH,
    // ["spouse_mid_name_th"]: "",
    // ["spouse_surname_th"]: register.ssu.spouse.surname.TH,
    // ["spouse_name_eng"]: register.ssu.spouse.name.EN,
    // ["spouse_mid_name_eng"]: "",
    // ["spouse_surname_eng"]: register.ssu.spouse.surname.EN,
    UpdateCustomer(register: Register, data, dateNow, relation_info_list, phone_info_list) {
        const json = {
            ["id_no"]: register.ssu.cardInfo.idCardNumber.toString(),
            ["id_type"]: AppConstant.IdType,
            ["machine_id"]: Environment.machine_id,
            ["branch_no"]: Environment.branchCode,
            ["fatca_status"]: register.fatca.status,
            ["kyc_level"]: register.ssu.kyc.Value,
            ["flg_master_app"]: "Y",
            ["register_address"]:
            {
                ["AddressNumber"]: register.ssu.cardInfo.address.no ? register.ssu.cardInfo.address.no : "",
                ["Village"]: register.ssu.cardInfo.address.village ? register.ssu.cardInfo.address.village : "",
                ["Building"]: register.ssu.cardInfo.address.tower ? register.ssu.cardInfo.address.tower : "",
                ["FloorNo"]: register.ssu.cardInfo.address.floor ? register.ssu.cardInfo.address.floor : "",
                ["Street"]: register.ssu.cardInfo.address.street ? register.ssu.cardInfo.address.street : "",
                ["Soi"]: register.ssu.cardInfo.address.alley ? register.ssu.cardInfo.address.alley : "",
                ["Moo"]: register.ssu.cardInfo.address.moo ? register.ssu.cardInfo.address.moo : "",
                ["CountryCode"]: register.ssu.cardInfo.address.countryId,
                ["DistrictCode"]: register.ssu.cardInfo.address.districtId,
                ["DistrictValue"]: register.ssu.cardInfo.address.district,
                ["ProvinceCode"]: register.ssu.cardInfo.address.provinceId,
                ["ProvinceValue"]: register.ssu.cardInfo.address.province,
                ["PostalCode"]: register.ssu.cardInfo.address.postcode,
                ["PostalValue"]: register.ssu.cardInfo.address.postcode,
                ["SubDistrictCode"]: register.ssu.cardInfo.address.localityId,
                ["SubDistrictValue"]: register.ssu.cardInfo.address.locality
            }
            ,
        };

        const url = API.UpdateCustomer;
        return this.apiService.postVIBWithHeader(url, json);
    }

    CreateCustomerIndividual(register: Register, data, dateNow, relation_info_list, phone_info_list) {

        let contryincome = '';
        if (register.ssu.Contryincome.Select === '0') {
            contryincome = register.ssu.Contryincome.Desc;
        } else {
            contryincome = register.ssu.Contryincome.Value;
        }
        let useSmartRegis = 'N';
        if (!isNullOrUndefined(register.chipNo)) {
            if (register.chipNo !== '') {
                useSmartRegis = 'Y';
            }
        }
        const json = {
            ["address_info_list"]: [
                {
                    ["address_type"]: '02', //AppConstant.AddressTypeRegister,  //2 , ที่อยุ่ตามบัตรประชาชน
                    ["address_building"]: Utils.checkEmptyValue(register.ssu.cardInfo.address.tower),
                    ["address_country"]: this.checkCountryThai(Utils.checkEmptyValue(register.ssu.cardInfo.address.countryId)),
                    ["address_province_text"]: Utils.checkEmptyValue(register.ssu.cardInfo.address.province),
                    ["address_province"]: Utils.checkEmptyValue(register.ssu.cardInfo.address.provinceId),
                    ["address_district_text"]: Utils.checkEmptyValue(register.ssu.cardInfo.address.district),
                    ["address_district"]: Utils.checkEmptyValue(register.ssu.cardInfo.address.districtId),
                    ["address_subdistrict_text"]: Utils.checkEmptyValue(register.ssu.cardInfo.address.locality),
                    ["address_subdistrict"]: Utils.checkEmptyValue(register.ssu.cardInfo.address.localityId),
                    ["address_postal_code"]: Utils.checkEmptyValue(register.ssu.cardInfo.address.postcode),
                    ["address_postal_code_text"]: Utils.checkEmptyValue(register.ssu.cardInfo.address.postcode),
                    ["address_floor"]: Utils.checkEmptyValue(register.ssu.cardInfo.address.floor),
                    ["address_moo"]: Utils.checkEmptyValue(register.ssu.cardInfo.address.moo),
                    ["address_number"]: Utils.checkEmptyValue(register.ssu.cardInfo.address.no),
                    ["address_road"]: Utils.checkEmptyValue(register.ssu.cardInfo.address.street),
                    ["address_soi"]: Utils.checkEmptyValue(register.ssu.cardInfo.address.alley),
                    ["address_village"]: Utils.checkEmptyValue(register.ssu.cardInfo.address.village)
                },
                {
                    ["address_type"]: '04', //AppConstant.AddressTypeMailing, //4 , ที่อยู่จัดส่งเอกสาร
                    ["address_building"]: Utils.checkEmptyValue(register.ssu.current.address.tower),
                    ["address_country"]: this.checkCountryThai(Utils.checkEmptyValue(register.ssu.current.address.countryId)),
                    ["address_province_text"]: Utils.checkEmptyValue(register.ssu.current.address.province),
                    ["address_province"]: Utils.checkEmptyValue(register.ssu.current.address.provinceId),
                    ["address_district_text"]: Utils.checkEmptyValue(register.ssu.current.address.district),
                    //["address_district"]: '1010',
                    ["address_district"]: Utils.checkEmptyValue(register.ssu.current.address.districtId),
                    ["address_subdistrict_text"]: Utils.checkEmptyValue(register.ssu.current.address.locality),
                    ["address_subdistrict"]: Utils.checkEmptyValue(register.ssu.current.address.localityId),
                    ["address_postal_code"]: Utils.checkEmptyValue(register.ssu.current.address.postcode),
                    ["address_postal_code_text"]: Utils.checkEmptyValue(register.ssu.current.address.postcode),
                    ["address_floor"]: Utils.checkEmptyValue(register.ssu.current.address.floor),
                    ["address_moo"]: Utils.checkEmptyValue(register.ssu.current.address.moo),
                    ["address_number"]: Utils.checkEmptyValue(register.ssu.current.address.no),
                    ["address_road"]: Utils.checkEmptyValue(register.ssu.current.address.street),
                    ["address_soi"]: Utils.checkEmptyValue(register.ssu.current.address.alley),
                    ["address_village"]: Utils.checkEmptyValue(register.ssu.current.address.village)
                },
                {
                    ["address_type"]: '05', //AppConstant.AddressTypeOffice, //5 , ที่อยู่ที่ทำงาน
                    ["address_building"]: Utils.checkEmptyValue(register.ssu.office.address.tower),
                    ["address_country"]: this.checkCountryThai(Utils.checkEmptyValue(register.ssu.office.address.countryId)),
                    ["address_province_text"]: Utils.checkEmptyValue(register.ssu.office.address.province),
                    ["address_province"]: Utils.checkEmptyValue(register.ssu.office.address.provinceId),
                    ["address_district_text"]: Utils.checkEmptyValue(register.ssu.office.address.district),
                    //["address_district"]: '1010',
                    ["address_district"]: Utils.checkEmptyValue(register.ssu.office.address.districtId),
                    ["address_subdistrict_text"]: Utils.checkEmptyValue(register.ssu.office.address.locality),
                    ["address_subdistrict"]: Utils.checkEmptyValue(register.ssu.office.address.localityId),
                    ["address_postal_code"]: Utils.checkEmptyValue(register.ssu.office.address.postcode),
                    ["address_postal_code_text"]: Utils.checkEmptyValue(register.ssu.office.address.postcode),
                    ["address_floor"]: Utils.checkEmptyValue(register.ssu.office.address.floor),
                    ["address_moo"]: Utils.checkEmptyValue(register.ssu.office.address.moo),
                    ["address_number"]: Utils.checkEmptyValue(register.ssu.office.address.no),
                    ["address_road"]: Utils.checkEmptyValue(register.ssu.office.address.street),
                    ["address_soi"]: Utils.checkEmptyValue(register.ssu.office.address.alley),
                    ["address_village"]: Utils.checkEmptyValue(register.ssu.office.address.village)
                }
            ],
            ["customer_info"]: {
                ["birth_day"]: data['birth_date'] + "T00:00:00", //T00:00:00
                //["business_type"]: "H000000",
                ["business_type"]: Utils.checkEmptyValue(register.ssu.business.Id),
                ["card_id"]: Utils.checkEmptyValue(register.ssu.cardInfo.idCardNumber),
                ["customer_doc_type"]: AppConstant.IdType, //Hardcode //"I", //ประเภทเอกสารแสดงตัวตน // ไม่รู้ความหมาย
                ["customer_type"]: AppConstant.CustomerSubType,
                ["customer_type_group"]: AppConstant.CustomerCategory,
                ["education"]: Utils.checkEmptyValue(register.ssu.education),
                ["email"]: Utils.checkEmptyValue(register.ssu.current.contact.email),
                ["expired_date"]: data['expired_date'] + "T00:00:00", //T00:00:00
                ["issued_date"]: data['issued_date'] + "T00:00:00", //T00:00:00

                ["firstname_en"]: Utils.checkEmptyValue(register.ssu.cardInfo.nameEN),
                ["firstname_th"]: Utils.checkEmptyValue(register.ssu.cardInfo.nameTH),
                ["gender"]: data['gender'],

                ["lastname_th"]: Utils.checkEmptyValue(register.ssu.cardInfo.surnameTH),
                ["lastname_en"]: Utils.checkEmptyValue(register.ssu.cardInfo.surnameEN),
                ["marital_status"]: Utils.checkEmptyValue(register.ssu.spouse.status), // MAS_CUST_CONFIG = CUST_CONFIG_NAME = MARITAL_STATUS
                ["title_id_th"]: Utils.checkEmptyValue(register.ssu.cardInfo.titleTHId),
                ["title_id_en"]: Utils.checkEmptyValue(register.ssu.cardInfo.titleENId),
                ["nationality_1"]: Utils.checkEmptyValue(register.ssu.cardInfo.nationId),
                ["number_employee"]: "", //จำนวนพนักงานในบริษัท , UI ไม่มีให้กรอก
                ["occupation"]: Utils.checkEmptyValue(register.ssu.career.Id),
                ["sub_occupation"]: "", //อาชีพย่อย , UI ไม่มีให้กรอก
                ["position"]: Utils.checkEmptyValue(register.ssu.position.Id),
                ["religion_code"]: '01', //ศาสนา ,01:พุธ , UI ไม่มีให้กรอก
                ["work_address"]: Utils.checkEmptyValue(register.ssu.career.workplace), //ชื่อสถานที่ทำงาน , UI มีเป็น array รอคุยกับต้นก่อน
                ["salary_code"]: Utils.checkEmptyValue(register.ssu.income.Select),
                ["properties"]: register.ssu.property.Id,
            },
            ["other_info"]: {
                ['machine_id']: Environment.machine_id,
                ["create_by_brn"]: Environment.branchCode,
                ["flg_mst_app"]: "Y", // Flag master Application
                ["main_branch"]: Environment.branchCode,
                ["share_acct_info_flag"]: "Y",
                ["receive_date"]: dateNow,
                ["way_receive"]: Environment.branchCode, //ต้นบอกให้ใส่รหัสสาขา
                ["origination_with_idcard"]: useSmartRegis, // ถ้าคีย์มาเอง ไม่ได้ส่ง N
            },
            ["phone_info_list"]: phone_info_list,
            ["contact_sub_service"]: [
                {
                    ["code"]: AppConstant.ContactTypeEmailCode,
                    ["value"]: register.subscription.contact.email
                },
                {
                    ["code"]: AppConstant.ContactTypeMobileCode,
                    ["value"]: register.subscription.contact.moblie_phone
                }
            ],
            ["reference_info"]: {
                ["prod_group"]: "",
                ["source_ref1"]: "",
                ["source_ref2"]: "",
                ["source_ref3"]: ""
            },
            relation_info_list,
            ["risk_info"]: {
                ["country_income"]: contryincome,
                ["fatca_status"]: Utils.checkEmptyValue(register.fatca.status),
                ["involv_eamlo"]: Utils.checkEmptyValue(register.ssu.launder.Select), //ฟอกเงิน ก่อการร้าย
                ["involv_eamlo_remark"]: Utils.checkEmptyValue(register.ssu.launder.Desc), //ฟอกเงิน ก่อการร้าย
                ["kyc_level"]: Utils.checkEmptyValue(register.ssu.kyc.Select), // ต้องยิง webservice ถึงจะได้ค่ากลับมา
                ["political"]: Utils.checkEmptyValue(register.ssu.politic.Select), //สถาภาพทางการเมือง
                ["political_remark"]: Utils.checkEmptyValue(register.ssu.politic.Desc), //สถาภาพทางการเมือง
                ["sanction_list"]: Utils.checkEmptyValue(register.sanction_list), // ได้จากการยิง CheckCustomer
                ["see_customer"]: "Y", //เห็นลุกค้าหรือป่าว ตอบ Y หรือ N
                ["see_id_card"]: "Y",
                ["source_income"]: Utils.checkEmptyValue(register.ssu.primary.Select), //แหล่งที่มาของรายได้หลัก
                ["source_income_remark"]: Utils.checkEmptyValue(register.ssu.primary.Desc),
                ["review_date"]: dateNow + "T00:00:00", //T00:00:00
                ["kyc_reason"]: Utils.checkEmptyValue(register.ssu.kyc.Value),
                ["remark_high_risk"]: "", //หมายเหตุความเสี่ยงระดับสูง
                ["seize"]: Utils.checkEmptyValue(register.ssu.ban.Select), //ยับยั้งการทำธุรกิจ
                ["seize_remark"]: Utils.checkEmptyValue(register.ssu.ban.Desc) //ยับยั้งการทำธุรกิจ
            }
        };

        // if mailling input
        if (register.subscription.current.Type === 'IN') {
            // if address for subscriotion not same with address cardInfo,current,office
            if (this.checkDiffCardInfoAddress(register) && this.checkDiffCurrentAddress(register) && this.checkDiffOfficeAddress(register)) {
                const jsonAddrSub = {
                    ["address_type"]: '04', //AppConstant.AddressTypeMailing, //4 , ที่อยู่จัดส่งเอกสาร
                    ["address_building"]: Utils.checkEmptyValue(register.subscription.address.tower),
                    ["address_country"]: this.checkCountryThai(Utils.checkEmptyValue(register.subscription.address.countryId)),
                    ["address_province_text"]: Utils.checkEmptyValue(register.subscription.address.province),
                    ["address_province"]: Utils.checkEmptyValue(register.subscription.address.provinceId),
                    ["address_district_text"]: Utils.checkEmptyValue(register.subscription.address.district),
                    ["address_district"]: Utils.checkEmptyValue(register.subscription.address.districtId),
                    ["address_subdistrict_text"]: Utils.checkEmptyValue(register.subscription.address.locality),
                    ["address_subdistrict"]: Utils.checkEmptyValue(register.subscription.address.localityId),
                    ["address_postal_code"]: Utils.checkEmptyValue(register.subscription.address.postcode),
                    ["address_postal_code_text"]: Utils.checkEmptyValue(register.subscription.address.postcode),
                    ["address_floor"]: Utils.checkEmptyValue(register.subscription.address.floor),
                    ["address_moo"]: Utils.checkEmptyValue(register.subscription.address.moo),
                    ["address_number"]: Utils.checkEmptyValue(register.subscription.address.no),
                    ["address_road"]: Utils.checkEmptyValue(register.subscription.address.street),
                    ["address_soi"]: Utils.checkEmptyValue(register.subscription.address.alley),
                    ["address_village"]: Utils.checkEmptyValue(register.subscription.address.village)
                }
                json.address_info_list.push(jsonAddrSub);
            }
        }

        Utils.logDebug("CreateCustomerIndividual", JSON.stringify(json));
        const url = API.CreateCustomerIndividual;
        return this.apiService.postVIBWithHeader(url, json);
    }

    checkCountryThai(country) {
        return country === 'ไทย' ? 'TH' : country;
    }

    checkDiffCardInfoAddress(register) {
        if (register.subscription.address.no !== register.ssu.cardInfo.address.no
            || register.subscription.address.district !== register.ssu.cardInfo.address.district
            || register.subscription.address.locality !== register.ssu.cardInfo.address.locality
            || register.subscription.address.province !== register.ssu.cardInfo.address.province
            || register.subscription.address.postcode !== register.ssu.cardInfo.address.postcode) {
            Utils.logDebug('register.servier', 'checkDiffCardInfoAddress => true');
            return true;
        } else {
            Utils.logDebug('register.servier', 'checkDiffCardInfoAddress => false');
            return false;
        }
    }

    checkDiffCurrentAddress(register) {
        if (register.subscription.address.no !== register.ssu.current.address.no
            || register.subscription.address.district !== register.ssu.current.address.district
            || register.subscription.address.locality !== register.ssu.current.address.locality
            || register.subscription.address.province !== register.ssu.current.address.province
            || register.subscription.address.postcode !== register.ssu.current.address.postcode) {
            Utils.logDebug('register.servier', 'checkDiffCurrentAddress => true');
            return true;
        } else {
            Utils.logDebug('register.servier', 'checkDiffCurrentAddress => false');
            return false;
        }
    }

    checkDiffOfficeAddress(register) {
        if (register.subscription.address.no !== register.ssu.office.address.no
            || register.subscription.address.district !== register.ssu.office.address.district
            || register.subscription.address.locality !== register.ssu.office.address.locality
            || register.subscription.address.province !== register.ssu.office.address.province
            || register.subscription.address.postcode !== register.ssu.office.address.postcode) {
            Utils.logDebug('register.servier', 'checkDiffOfficeAddress => true');
            return true;
        } else {
            Utils.logDebug('register.servier', 'checkDiffOfficeAddress => false');
            return false;
        }
    }

    GetDummyAccountNo() {
        const json = {};
        const url = API.GetDummyAccountNo
        return this.apiService.postVIBWithHeader(url, json);
    }

    SaveSubscriptionSaving(register: Register, address, atmServiceChecked) {
        let bin_code = '';
        let card_type = '';
        if (atmServiceChecked === true) {
            bin_code = register.subscriptionService.service.bin_code;
            card_type = register.subscriptionService.service.card_type;
        }

        const json = {
            ["id_no"]: Utils.checkEmptyValue(register.ssu.cardInfo.idCardNumber), //รหัสบัตรประชาชน
            ["dummy_account_no"]: Utils.checkEmptyValue(register.subscription.account.ACCOUNT_NO),
            ["id_type"]: AppConstant.IdType,
            ["machine_id"]: Environment.machine_id,
            ["branch_no"]: Environment.branchCode,
            ["atm_code"]: bin_code,
            ["atm_name"]: card_type,
            ["subscription_saving_account"]: {
                ["PROD_CODE"]: Utils.checkEmptyValue(register.subscription.account.PROD_CODE),
                ["PROD_DESC"]: Utils.checkEmptyValue(register.subscription.account.PROD_DESC),
                ["PROD_TYPE"]: Utils.checkEmptyValue(register.subscription.account.PROD_TYPE),
                ["ACCOUNT_NAME"]: Utils.checkEmptyValue(register.subscription.account.ACCOUNT_NAME),
                ["ACCOUNT_NO"]: Utils.checkEmptyValue(register.subscription.account.ACCOUNT_NO),
                ["SYSPRODUCT_GROUP"]: "2",
                ["PMT_COND"]: Utils.checkEmptyValue(register.subscription.account.PMT_COND), //ประเภทเงื่อนไขการสั่งจ่าย
                ["PMT_OTH"]: Utils.checkEmptyValue(register.subscription.account.PMT_OTH), //รายละเอียดเงื่อนไขการสั่งจ่ายอื่นๆ (กรณี PMT_COND = 0 'อื่นๆ')
                ["PMT_DESC"]: register.subscription.account.PMT_COND === 'S' ? "ลงนามสั่งจ่ายคนเดียว" : register.subscription.account.PMT_DESC, //รายละเอียดเงื่อนไขของการสั่งจ่าย (Ex: ลงนามสั่งจ่ายคนเดียว)
                ["OBJ1"]: Utils.checkEmptyValue(register.subscription.account.OBJ1), // ออมเงิน 'Y'/'' ( use '' instead N)
                ["OBJ2"]: Utils.checkEmptyValue(register.subscription.account.OBJ2), // เพื่อลงทุน 'Y'/'' ( use '' instead N)
                ["OBJ3"]: Utils.checkEmptyValue(register.subscription.account.OBJ3), // เพื่อหมุนเวียนทางธุรกิจ 'Y'/'' ( use '' instead N)
                ["OBJ4"]: Utils.checkEmptyValue(register.subscription.account.OBJ4), // ชำระสินค้า/บริการ 'Y'/'' ( use '' instead N)
                ["OBJ5"]: Utils.checkEmptyValue(register.subscription.account.OBJ5), // บัญชีเงินเดือน 'Y'/'' ( use '' instead N)
                ["OBJ6"]: Utils.checkEmptyValue(register.subscription.account.OBJ6), //วัตถุประสงค์ในการเปิดบัญชี อื่นๆ 'Y'/'' ( use '' instead N)
                ["OBJ_OTH"]: Utils.checkEmptyValue(register.subscription.account.OBJ_OTH), //วัตถุประสงค์ในการเปิดบัญชี อื่นๆ (กรณี OBJ6 = 'Y')
                ["OBJ_DESC"]: Utils.checkEmptyValue(register.subscription.account.OBJ.Data), //รายละเอียดวัตถุประสงค์ในการเปิดบัญชี (Ex: ออมเงิน)
                ["CURSTATUS"]: "",
                address
            }
        }

        const url = API.SaveSubscription;
        return this.apiService.postVIBWithHeader(url, json);
    }

    SaveSubscriptionSavingForTD(register: Register, address, PROD_NAME, PROD_CODE, PROD_TYPE) {
        const json = {
            ["id_no"]: register.ssu.cardInfo.idCardNumber.toString(), //รหัสบัตรประชาชน
            ["dummy_account_no"]: register.subscription.account.ACCOUNT_NO,
            ["id_type"]: AppConstant.IdType,
            ["machine_id"]: Environment.machine_id,
            ["branch_no"]: Environment.branchCode,
            ["subscription_saving_account"]: {
                ["PROD_CODE"]: PROD_CODE,
                ["PROD_DESC"]: PROD_NAME,
                ["PROD_TYPE"]: PROD_TYPE,
                ["ACCOUNT_NAME"]: register.subscription.account.ACCOUNT_NAME,
                ["ACCOUNT_NO"]: register.subscription.account.ACCOUNT_NO,
                ["SYSPRODUCT_GROUP"]: "2",
                ["PMT_COND"]: register.subscription.account.PMT_COND ? register.subscription.account.PMT_COND : "", //ประเภทเงื่อนไขการสั่งจ่าย
                ["PMT_OTH"]: register.subscription.account.PMT_OTH ? register.subscription.account.PMT_OTH : "", //รายละเอียดเงื่อนไขการสั่งจ่ายอื่นๆ (กรณี PMT_COND = 0 'อื่นๆ')
                ["PMT_DESC"]: register.subscription.account.PMT_COND === 'S' ? "ลงนามสั่งจ่ายคนเดียว" : register.subscription.account.PMT_DESC, //รายละเอียดเงื่อนไขของการสั่งจ่าย (Ex: ลงนามสั่งจ่ายคนเดียว)
                ["OBJ1"]: !isNullOrUndefined(register.subscription.account.OBJ1) ? register.subscription.account.OBJ1 : '', // ออมเงิน 'Y'/'' ( use '' instead N)
                ["OBJ2"]: !isNullOrUndefined(register.subscription.account.OBJ2) ? register.subscription.account.OBJ2 : '', // เพื่อลงทุน 'Y'/'' ( use '' instead N)
                ["OBJ3"]: !isNullOrUndefined(register.subscription.account.OBJ3) ? register.subscription.account.OBJ3 : '', // เพื่อหมุนเวียนทางธุรกิจ 'Y'/'' ( use '' instead N)
                ["OBJ4"]: !isNullOrUndefined(register.subscription.account.OBJ4) ? register.subscription.account.OBJ4 : '', // ชำระสินค้า/บริการ 'Y'/'' ( use '' instead N)
                ["OBJ5"]: !isNullOrUndefined(register.subscription.account.OBJ5) ? register.subscription.account.OBJ5 : '', // บัญชีเงินเดือน 'Y'/'' ( use '' instead N)
                ["OBJ6"]: !isNullOrUndefined(register.subscription.account.OBJ6) ? register.subscription.account.OBJ6 : '', //วัตถุประสงค์ในการเปิดบัญชี อื่นๆ 'Y'/'' ( use '' instead N)
                ["OBJ_OTH"]: register.subscription.account.OBJ_OTH, //วัตถุประสงค์ในการเปิดบัญชี อื่นๆ (กรณี OBJ6 = 'Y')
                ["OBJ_DESC"]: register.subscription.account.OBJ.Data, //รายละเอียดวัตถุประสงค์ในการเปิดบัญชี (Ex: ออมเงิน)
                ["CURSTATUS"]: "",
                address
            }
        }

        const url = API.SaveSubscription;
        return this.apiService.postVIBWithHeader(url, json);
    }

    SaveSubscriptionCurrent(register: Register, address, atmServiceChecked) {
        let bin_code = '';
        let card_type = '';
        if (atmServiceChecked === true) {
            bin_code = register.subscriptionService.service.bin_code;
            card_type = register.subscriptionService.service.card_type;
        }

        const json = {
            ["id_no"]: Utils.checkEmptyValue(register.ssu.cardInfo.idCardNumber), //รหัสบัตรประชาชน
            ["dummy_account_no"]: Utils.checkEmptyValue(register.subscription.account.ACCOUNT_NO),
            ["id_type"]: AppConstant.IdType,
            ["machine_id"]: Environment.machine_id,
            ["branch_no"]: Environment.branchCode,
            ["atm_code"]: bin_code,
            ["atm_name"]: card_type,
            ["subscription_current_account"]: {
                ["PROD_CODE"]: Utils.checkEmptyValue(register.subscription.account.PROD_CODE),
                ["PROD_DESC"]: Utils.checkEmptyValue(register.subscription.account.PROD_DESC),
                ["PROD_TYPE"]: Utils.checkEmptyValue(register.subscription.account.PROD_TYPE),
                ["ACCOUNT_NAME"]: Utils.checkEmptyValue(register.subscription.account.ACCOUNT_NAME),
                ["ACCOUNT_NO"]: Utils.checkEmptyValue(register.subscription.account.ACCOUNT_NO),
                ["SYSPRODUCT_GROUP"]: "40",
                ["PMT_COND"]: Utils.checkEmptyValue(register.subscription.account.PMT_COND), //ประเภทเงื่อนไขการสั่งจ่าย
                ["PMT_OTH"]: Utils.checkEmptyValue(register.subscription.account.PMT_OTH), //รายละเอียดเงื่อนไขการสั่งจ่ายอื่นๆ (กรณี PMT_COND = 0 'อื่นๆ')
                ["PMT_DESC"]: register.subscription.account.PMT_COND === 'S' ? "ลงนามสั่งจ่ายคนเดียว" : register.subscription.account.PMT_DESC, //รายละเอียดเงื่อนไขของการสั่งจ่าย (Ex: ลงนามสั่งจ่ายคนเดียว)
                ["OBJ1"]: Utils.checkEmptyValue(register.subscription.account.OBJ1), // ออมเงิน 'Y'/'' ( use '' instead N)
                ["OBJ2"]: Utils.checkEmptyValue(register.subscription.account.OBJ2), // เพื่อลงทุน 'Y'/'' ( use '' instead N)
                ["OBJ3"]: Utils.checkEmptyValue(register.subscription.account.OBJ3), // เพื่อหมุนเวียนทางธุรกิจ 'Y'/'' ( use '' instead N)
                ["OBJ4"]: Utils.checkEmptyValue(register.subscription.account.OBJ4), // ชำระสินค้า/บริการ 'Y'/'' ( use '' instead N)
                ["OBJ5"]: Utils.checkEmptyValue(register.subscription.account.OBJ5), // บัญชีเงินเดือน 'Y'/'' ( use '' instead N)
                ["OBJ6"]: Utils.checkEmptyValue(register.subscription.account.OBJ6), //วัตถุประสงค์ในการเปิดบัญชี อื่นๆ 'Y'/'' ( use '' instead N)
                ["OBJ_OTH"]: Utils.checkEmptyValue(register.subscription.account.OBJ_OTH), //วัตถุประสงค์ในการเปิดบัญชี อื่นๆ (กรณี OBJ6 = 'Y')
                ["OBJ_DESC"]: Utils.checkEmptyValue(register.subscription.account.OBJ.Data), //รายละเอียดวัตถุประสงค์ในการเปิดบัญชี (Ex: ออมเงิน)
                ["CURSTATUS"]: "",
                address
            }
        }

        const url = API.SaveSubscription;
        return this.apiService.postVIBWithHeader(url, json);
    }

    SaveSubscriptionTD(register: Register, address) {
        const json = {
            ["id_no"]: Utils.checkEmptyValue(register.ssu.cardInfo.idCardNumber), //รหัสบัตรประชาชน
            ["dummy_account_no"]: Utils.checkEmptyValue(register.subscription.account.ACCOUNT_NO),
            ["id_type"]: AppConstant.IdType,
            ["machine_id"]: Environment.machine_id,
            ["branch_no"]: Environment.branchCode,

            ["subscription_td_account"]: {

                ["PROD_CODE"]: Utils.checkEmptyValue(register.subscription.account.PROD_CODE),
                ["PROD_DESC"]: Utils.checkEmptyValue(register.subscription.account.PROD_DESC),
                ["PROD_TYPE"]: Utils.checkEmptyValue(register.subscription.account.PROD_TYPE),
                ["SYSPRODUCT_GROUP"]: "3",
                ["ACCOUNT_NAME"]: Utils.checkEmptyValue(register.subscription.account.ACCOUNT_NAME),
                ["ACCOUNT_NO"]: Utils.checkEmptyValue(register.subscription.account.ACCOUNT_NO),
                ["PMT_COND"]: Utils.checkEmptyValue(register.subscription.account.PMT_COND),
                ["PMT_OTH"]: Utils.checkEmptyValue(register.subscription.account.PMT_OTH),
                ["PMT_DESC"]: register.subscription.account.PMT_COND === 'S' ? "ลงนามสั่งจ่ายคนเดียว" : register.subscription.account.PMT_DESC,
                ["PAY_INT_CHN"]: register.subscription.account.PAY_INT_CHN ? register.subscription.account.PAY_INT_CHN : "A",
                ["ACC_NO_INT"]: register.subscription.account.interest,
                ["OBJ1"]: Utils.checkEmptyValue(register.subscription.account.OBJ1), // ออมเงิน 'Y'/'' ( use '' instead N)
                ["OBJ2"]: Utils.checkEmptyValue(register.subscription.account.OBJ2), // เพื่อลงทุน 'Y'/'' ( use '' instead N)
                ["OBJ3"]: Utils.checkEmptyValue(register.subscription.account.OBJ3), // เพื่อหมุนเวียนทางธุรกิจ 'Y'/'' ( use '' instead N)
                ["OBJ4"]: Utils.checkEmptyValue(register.subscription.account.OBJ4), // ชำระสินค้า/บริการ 'Y'/'' ( use '' instead N)
                ["OBJ5"]: Utils.checkEmptyValue(register.subscription.account.OBJ5), // บัญชีเงินเดือน 'Y'/'' ( use '' instead N)
                ["OBJ6"]: Utils.checkEmptyValue(register.subscription.account.OBJ6), //วัตถุประสงค์ในการเปิดบัญชี อื่นๆ 'Y'/'' ( use '' instead N)
                ["OBJ_OTH"]: Utils.checkEmptyValue(register.subscription.account.OBJ_OTH),
                ["OBJ_DESC"]: Utils.checkEmptyValue(register.subscription.account.OBJ.Data),
                address
            }
        }

        const url = API.SaveSubscription;
        return this.apiService.postVIBWithHeader(url, json);
    }

    CreateMyPinByKKCisId(register: Register, myPin: string) {
        const json = {
            ["id_no"]: register.ssu.cardInfo.idCardNumber,
            ["id_type"]: AppConstant.IdType,
            ["pin"]: myPin
        }

        const url = API.CreateMyPinByKKCisId;
        return this.apiService.postVIBWithHeader(url, json);
    }

    SaveSubscriptionSMS(register: Register, PROD_TYPE, tempType) {

        console.log("PROD_TYPE : " + PROD_TYPE);
        console.log("tempType : " + tempType);
        console.log("account_no_interest" + register.account_no_interest);

        const json = {
            "account_number": register.account_no,
            "account_type": register.subscription.account.PROD_TYPE,
            "id_no": register.ssu.cardInfo.idCardNumber.toString(),
            "id_type": AppConstant.IdType,
            "subscription_email_seq": register.ssu.contact.EMAIL_SEQ,
            "subscription_mobile_number_seq": register.ssu.contact.MOBILE_NO_SEQ,
            "system_id": "SMS"
        }

        const url = API.SaveSubscription;
        return this.apiService.postVIBWithHeader(url, json);
    }

    SaveSubscriptionIB(register: Register, PROD_TYPE) {
        console.log("PROD_TYPE : " + PROD_TYPE);
        console.log("account_no_interest" + register.account_no_interest);

        const json = {
            "account_number": register.account_no,
            "account_type": register.subscription.account.PROD_TYPE,
            "id_no": register.ssu.cardInfo.idCardNumber.toString(),
            "id_type": AppConstant.IdType,
            "subscription_email_seq": register.ssu.contact.EMAIL_SEQ,
            "subscription_mobile_number_seq": register.ssu.contact.MOBILE_NO_SEQ,
            "system_id": "REF"
        }

        const url = API.SaveSubscription;
        return this.apiService.postVIBWithHeader(url, json);
    }

    SaveSubscriptionLock1(register: Register) {

        const json = {
            "account_number": register.account_no,
            "account_type": register.subscription.account.PROD_TYPE,
            "id_no": register.ssu.cardInfo.idCardNumber.toString(),
            "id_type": AppConstant.IdType,
            "subscription_email_seq": register.ssu.contact.EMAIL_SEQ,
            "subscription_mobile_number_seq": register.ssu.contact.MOBILE_NO_SEQ,
            "system_id": "IVR"
        }
        const url = API.SaveSubscription;
        return this.apiService.postVIBWithHeader(url, json);
    }

    OpenCASAAcount(register: Register, createMyPin: string) {

        let isSMS = 'N';
        if (register.smsServiceChecked) {
            isSMS = 'Y';
        }
        let isATM = 'N';
        if (register.atmServiceChecked) {
            isATM = 'Y';
        }
        let isPhone = 'N';
        if (register.phoneServiceChecked) {
            isPhone = 'Y';
        }

        Utils.logDebug('OpenCASAAcount', 'register : ' + JSON.stringify(register));
        const json = {
            "account_address_seq": register.subscription.address.seq,
            "account_email_seq": register.ssu.contact.EMAIL_SEQ,
            "account_mobile_seq": register.ssu.contact.MOBILE_NO_SEQ,
            "account_name": register.subscription.account.ACCOUNT_NAME,
            "atm_flag": isATM, // ATM
            "branch_no": Environment.branchCode,
            "e_notification_flag": isSMS, // SMS
            "eng_account_name1": register.ssu.cardInfo.nameEN,
            "eng_account_name2": register.ssu.cardInfo.surnameEN,
            "flg_ps_book": register.subscription.account.flg_psbook,
            "id_no": register.ssu.cardInfo.idCardNumber.toString(), //รหัสบัตรประชาชน
            "id_type": AppConstant.IdType,
            "internet_banking_flag": register.haveIB,
            "ivr_phone_banking_flag": isPhone,
            "kyc_opening_amount": 0,
            "kyc_purpose_of_account": register.subscription.account.OBJ.Id, // saving , business, ...
            "kyc_purpose_of_account_other": register.subscription.account.OBJ.Data,
            "open_for_branch": Environment.branchCode,
            "product_code": register.subscription.account.PROD_CODE,
            "product_desc": register.subscription.account.PROD_DESC,
            "product_group": register.subscription.account.PROD_TYPE,
            "ref_code_email_seq": register.ssu.contact.EMAIL_SEQ,
            "ref_code_mobile_seq": register.ssu.contact.MOBILE_NO_SEQ,
            "signing_condition": "1",
            "create_mypin": createMyPin // Y , N
        }

        const url = API.OpenCASAAcount;
        return this.apiService.postVIBWithHeader(url, json);
    }

    OpenTDAcount(register: Register, autoOpenCASAAccount: any, createMyPin: string) {

        let isSMS = 'N';
        if (register.smsServiceChecked) {
            isSMS = 'Y';
        }
        let isATM = 'N';
        if (register.atmServiceChecked) {
            isATM = 'Y';
        }
        let isPhone = 'N';
        if (register.phoneServiceChecked) {
            isPhone = 'Y';
        }
        Utils.logDebug('OpenTDAcount', 'register : ' + JSON.stringify(register));
        const json = {
            "account_address_seq": register.subscription.address.seq,
            "account_email_seq": register.ssu.contact.EMAIL_SEQ,
            "account_mobile_seq": register.ssu.contact.MOBILE_NO_SEQ,
            "account_name": register.subscription.account.ACCOUNT_NAME,
            "atm_flag": isATM, // ATM
            "branch_no": Environment.branchCode,
            "e_notification_flag": isSMS, // SMS
            "eng_account_name1": register.ssu.cardInfo.nameEN,
            "eng_account_name2": register.ssu.cardInfo.surnameEN,
            "flg_ps_book": register.subscription.account.flg_psbook,
            "id_no": register.ssu.cardInfo.idCardNumber.toString(), //รหัสบัตรประชาชน
            "id_type": AppConstant.IdType,
            "internet_banking_flag": register.haveIB,
            "ivr_phone_banking_flag": isPhone,
            "kyc_opening_amount": 0,
            "kyc_purpose_of_account": register.subscription.account.OBJ.Id, // saving , business, ...
            "kyc_purpose_of_account_other": register.subscription.account.OBJ.Data,
            "open_for_branch": Environment.branchCode,
            "product_code": register.subscription.account.PROD_CODE,
            "product_desc": register.subscription.account.PROD_DESC,
            "product_group": register.subscription.account.PROD_TYPE,
            "ref_code_email_seq": register.ssu.contact.EMAIL_SEQ,
            "ref_code_mobile_seq": register.ssu.contact.MOBILE_NO_SEQ,
            "signing_condition": "1",
            "auto_open_casa_account": autoOpenCASAAccount,
            "create_mypin": createMyPin // Y , N
        }

        const url = API.OpenTDAcount;
        return this.apiService.postVIBWithHeader(url, json);
    }

    CheckKKAnyId_idcard(register: Register) {
        const json = {
            ["search_by"]: "PROXY",
            ["kkcis_id"]: '',
            ["proxy_type"]: 'NATID',
            ["proxy_value"]: register.ssu.cardInfo.idCardNumber.toString(),
            ["card_id"]: ''
        }

        const url = API.CheckKKAnyId;
        return this.apiService.postVIBWithHeader(url, json)
    }

    CheckKKAnyId_mobile(register: Register, otp_moblie_number) {
        const json = {
            ["search_by"]: "PROXY",
            ["kkcis_id"]: '',
            ["proxy_type"]: "MSISDN",
            ["proxy_value"]: otp_moblie_number,
            ["card_id"]: ''
        }

        const url = API.CheckKKAnyId;
        return this.apiService.postVIBWithHeader(url, json)
    }

    generateOTP(register: Register, txn_type) {
        const json = {
            ["card_id"]: register.ssu.cardInfo.idCardNumber,
            ["id_type"]: AppConstant.IdType,
            ["msg_language"]: "TH",
            ["txn_type"]: txn_type,
            ["account_to"]: "",
            ["amount"]: "",
        }

        const url = API.GenerateOTP;
        return this.apiService.postVIBWithHeader(url, json)
    }

    RegisterAnyIdByAccount(register: Register) {
        const idCard = register.subscription.cardInfo.idCardNumber.length !== 0 ? register.subscription.cardInfo.idCardNumber : register.ssu.cardInfo.idCardNumber

        const json = {
            "account_name": register.ssu.cardInfo.nameTH,
            "account_no": register.account_no,
            "any_id_type": register.AnyIdType,
            "any_id_value": register.id13orPhoneNo,
            "branch_no": Environment.branchCode,
            "cis_id": register.CISID,
            "dummy_account_no": '',
            "id_no": idCard.toString(),
            "id_type": AppConstant.IdType,
            "notify_mobile_no": register.subscription.contact.moblie_phone
        }

        const url = API.RegisterAnyIdByAccount;
        return this.apiService.postVIBWithHeader(url, json)
    }

    GetMasterAppForm(register: Register) {

        let education = '';
        //let work_address = '';
        let source_income = '';
        let nationality = '';
        let nationality_desc = '';
        let source_income_desc = '';
        let country_income = '';
        let country_income_desc = '';
        let seize = '';
        let seize_desc = '';
        let involv_eamlo = '';
        let involv_eamlo_desc = '';
        let political = '';
        let political_desc = '';
        let benefit = '';
        let benefit_desc = '';
        let business = '';
        let trade_desc = '';
        let business_desc = '';
        let relationshipName1: string;
        let relationshipName2: string;

        const idType = this.checkIdType(register.ssu.cardInfo.idType);
        nationality = 'TH';
        nationality_desc = this.checkDataOther(nationality, 'TH', register.ssu.cardInfo.nation);
        education = this.checkEducation(register.ssu.education.toString());
        source_income = register.ssu.primary.Select;
        source_income_desc = source_income === '04' ? register.ssu.primary.Desc : '';
        country_income = this.checkCountryIncome(register.ssu.Contryincome.Select);
        country_income_desc = this.checkDataOther(register.ssu.Contryincome.Select, '0', register.ssu.Contryincome.Desc);
        seize = register.ssu.ban.Select;
        seize_desc = this.checkDataOther(register.ssu.ban.Select, 'N', register.ssu.ban.Desc);
        involv_eamlo = register.ssu.launder.Select;
        involv_eamlo_desc = this.checkDataOther(register.ssu.launder.Select, 'N', register.ssu.launder.Desc);
        political = register.ssu.politic.Select;
        political_desc = this.checkDataOther(register.ssu.politic.Select, 'N', register.ssu.politic.Desc);
        benefit = this.checkBenefit(register.ssu.interest.Select);
        benefit_desc = this.checkDataOther(register.ssu.interest.Select, '0', register.ssu.interest.Desc);
        const doc_card_image = Utils.checkEmptyValue(register.ssu.cardInfo.image);
        let customer_title_name = '';
        let customer_title_desc = '';
        customer_title_name = this.checkTitleName(register.ssu.cardInfo.titleFullTH);
        customer_title_desc = customer_title_name === 'อื่นๆ' ? register.ssu.cardInfo.titleFullTH : '';
        register.ssu.relationship.Other1 = this.checkRelationShip(register.ssu.relationship.Data1);
        register.ssu.relationship.Other2 = this.checkRelationShip(register.ssu.relationship.Data2);
        relationshipName1 = this.checkRelationShipName1(register.ssu.relationship);
        relationshipName2 = this.checkRelationShipName2(register.ssu.relationship);
        let useSmartRegis = 'N';
        if (!isNullOrUndefined(register.chipNo)) {
            if (register.chipNo !== '') {
                useSmartRegis = 'Y';
            }
        }

        const jsonNew = {
            ["curr_address_info"]: {
                ["curr_address_no"]: register.ssu.current.address.no,
                ["curr_address_moo"]: register.ssu.current.address.moo,
                ["curr_address_village"]: register.ssu.current.address.village,
                ["curr_address_building"]: register.ssu.current.address.tower,
                ["curr_address_floor"]: register.ssu.current.address.floor,
                ["curr_address_soi"]: register.ssu.current.address.alley,
                ["curr_address_road"]: register.ssu.current.address.street,
                ["curr_address_subdistrict"]: register.ssu.current.address.locality,
                ["curr_address_district"]: register.ssu.current.address.district,
                ["curr_address_province"]: register.ssu.current.address.province,
                ["curr_address_country"]: register.ssu.current.address.country,
                ["curr_address_postcode"]: register.ssu.current.address.postcode,
            },
            ["cust_profile"]: {
                ["birth_date"]: register.ssu.cardInfo.birthdate.day + ' ' + register.ssu.cardInfo.birthdate.mounth + ' ' + register.ssu.cardInfo.birthdate.year,
                ["business_type"]: register.ssu.business.Type,
                ["contact_first_name"]: register.ssu.relationship.name1.TH,
                ["contact_last_name"]: register.ssu.relationship.surname1.TH,
                ["contact_mobile_no"]: register.ssu.relationship.contact1.moblie_phone,
                ["contact_title_name"]: register.ssu.relationship.title1.TH,
                ["contact_type"]: register.ssu.relationship.Data1,
                ["cust_doc_info"]: {
                    ["doc_id_no"]: register.ssu.cardInfo.idCardNumber.toString(),
                    ["doc_name_th"]: register.ssu.cardInfo.titleTH + ' ' + register.ssu.cardInfo.nameTH + '  ' + register.ssu.cardInfo.surnameTH,
                    ["doc_name_en"]: register.ssu.cardInfo.titleEN + ' ' + register.ssu.cardInfo.nameEN + '  ' + register.ssu.cardInfo.surnameEN,
                    ["doc_birth_date_th"]: register.ssu.cardInfo.birthdate.day + ' ' + register.ssu.cardInfo.birthdate.mounth + ' ' + register.ssu.cardInfo.birthdate.year,
                    ["doc_birth_date_en"]: register.ssu.cardInfo.birthdate.day + ' ' + register.ssu.cardInfo.birthdate.mounthEN + ' ' + register.ssu.cardInfo.birthdate.yearEN,
                    ["doc_address"]: register.ssu.cardInfo.address.AddressFull,
                    ["doc_date_issue_th"]: register.ssu.cardInfo.issueDate.day + ' ' + register.ssu.cardInfo.issueDate.mounth + ' ' + register.ssu.cardInfo.issueDate.year,
                    ["doc_date_issue_en"]: register.ssu.cardInfo.issueDate.day + ' ' + register.ssu.cardInfo.issueDate.mounthEN + ' ' + register.ssu.cardInfo.issueDate.yearEN,
                    ["doc_date_expire_th"]: register.ssu.cardInfo.expireDate.day + ' ' + register.ssu.cardInfo.expireDate.mounth + ' ' + register.ssu.cardInfo.expireDate.year,
                    ["doc_date_expire_en"]: register.ssu.cardInfo.expireDate.day + ' ' + register.ssu.cardInfo.expireDate.mounthEN + ' ' + register.ssu.cardInfo.expireDate.yearEN
                },
                ["customer_title_name_en"]: register.ssu.cardInfo.titleEN,
                ["customer_title_name_th"]: register.ssu.cardInfo.titleTH,
                ["customer_first_name_th"]: register.ssu.cardInfo.nameTH,
                ["customer_last_name_th"]: register.ssu.cardInfo.surnameTH,
                ["customer_first_name_en"]: register.ssu.cardInfo.nameEN,
                ["customer_last_name_en"]: register.ssu.cardInfo.surnameEN,
                ["education"]: education,
                ["email"]: register.ssu.current.contact.email,
                ["mobile_no"]: register.ssu.current.contact.moblie_phone,
                ["home_tel_no"]: register.ssu.current.contact.home_phone,
                ["home_tel_ext"]: "",
                ["fax_no"]: register.ssu.current.contact.fax_phone,
                ["id_no"]: register.ssu.cardInfo.idCardNumber.toString(),
                ["id_type"]: AppConstant.IdType,
                ["is_from_card"]: idType,
                ["kyc"]: Utils.checkEmptyValue(register.ssu.kyc.Select), // <---- check santionlist and kyv level
                ["nationality"]: nationality,
                ["nationality_desc"]: nationality_desc,
                ["occupation"]: register.ssu.career.Data,
                ["occupation_desc"]: "",
                ["workplace"]: register.ssu.career.workplace,
                ["position"]: register.ssu.position.Data,
                ["properties"]: register.ssu.property.Id,
                ["salary"]: register.ssu.income.Select.toString(),
                ["work_phone"]: register.ssu.office.contact.office_phone,
                ["work_fax"]: '',
            },
            ["imgCard"]: doc_card_image,
            ["reg_address_info"]: {
                ["reg_address_no"]: register.ssu.cardInfo.address.no,
                ["reg_address_moo"]: register.ssu.cardInfo.address.moo,
                ["reg_address_village"]: register.ssu.cardInfo.address.village,
                ["reg_address_building"]: register.ssu.cardInfo.address.tower,
                ["reg_address_floor"]: register.ssu.cardInfo.address.floor,
                ["reg_address_soi"]: register.ssu.cardInfo.address.alley,
                ["reg_address_road"]: register.ssu.cardInfo.address.street,
                ["reg_address_subdistrict"]: register.ssu.cardInfo.address.locality,
                ["reg_address_district"]: register.ssu.cardInfo.address.district,
                ["reg_address_province"]: register.ssu.cardInfo.address.province,
                ["reg_address_country"]: register.ssu.cardInfo.address.country,
                ["reg_address_postcode"]: register.ssu.cardInfo.address.postcode,
            },
            ["risk_info"]: {
                ["benefit_id_no"]: "",
                ["benefit_name"]: benefit_desc,
                ["country_income"]: country_income,
                ["country_income_desc"]: country_income_desc,
                ["fatca_status"]: "FATCLOC", //hardcode
                ["involv_eamlo"]: involv_eamlo,
                ["involv_eamlo_desc"]: involv_eamlo_desc,
                ["political"]: political,
                ["political_desc"]: political_desc,
                ["benefit"]: benefit,
                ["benefit_desc"]: benefit_desc,
                ["kyc_level"]: register.ssu.kyc.Select, // <---- check santionlist and kyv level
                ["kyc_reason"]: register.ssu.kyc.Value, // <---- check santionlist and kyv level
                ["remark_high_risk"]: "",
                ["review_date"]: Utils.getCurrentDate(),
                ["sanction_list"]: "N", //hardcode
                ["see_customer"]: "Y", //hardcode
                ["see_id_card"]: useSmartRegis, // <-- ถ้ามาจากบัตรปชช ให้ Y ไม่ใช่ให้ N
                ["seize"]: seize,
                ["seize_desc"]: seize_desc,
                ["source_income"]: source_income,
                ["source_income_desc"]: source_income_desc
            },
            ["ssid"]: register.onStatus,
            ["txn_date"]: moment().utc(true).format('DD/MM/YYYY'), //hardcode
            ["work_address_info"]: {
                ["work_address_no"]: register.ssu.office.address.no,
                ["work_address_moo"]: register.ssu.office.address.moo,
                ["work_address_village"]: register.ssu.office.address.village,
                ["work_address_building"]: register.ssu.office.address.tower,
                ["work_address_floor"]: register.ssu.office.address.floor,
                ["work_address_soi"]: register.ssu.office.address.alley,
                ["work_address_road"]: register.ssu.office.address.street,
                ["work_address_subdistrict"]: register.ssu.office.address.locality,
                ["work_address_district"]: register.ssu.office.address.district,
                ["work_address_province"]: register.ssu.office.address.province,
                ["work_address_country"]: register.ssu.office.address.country,
                ["work_address_postcode"]: register.ssu.office.address.postcode,
            }
        };

        const url = API.GetMasterAppForm;
        return this.apiService.postVIBWithHeader(url, jsonNew);
    }

    private checkIdType(idType) {
        return idType === AppConstant.IdType ? 'Y' : 'N';
    }

    private checkNationId(nationId) {
        if (nationId === 'TH') {
            return 'ไทย';
        } else {
            return 'สัญชาติอื่นๆ/หากมีมากกว่า 1 สัญชาติ';
        }
    }

    private checkCurrentType(currentType) {
        if (currentType === 'CI') {
            return '1';
        } else if (currentType === 'CU') {
            return '2';
        } else if (currentType === 'IN') {
            return '3';
        }
    }

    private checkOfficeType(officeType) {
        if (officeType === 'CI') {
            return '1';
        } else if (officeType === 'CU') {
            return '2';
        } else if (officeType === 'IN') {
            return '3';
        }
    }

    private checkSpouseStatus(spouseStatus) {
        if (spouseStatus === '01') {
            return 'โสด';
        } else if (spouseStatus === '02') {
            return 'สมรส';
        } else if (spouseStatus === '04') {
            return 'หม้าย';
        } else if (spouseStatus === '03') {
            return 'หย่าร้าง';
        }
    }

    private checkEducation(education) {
        if (education === '1') {
            return 'ต่ำกว่าปริญญาตรี';
        } else if (education === '2') {
            return 'ปริญญาตรี';
        } else if (education === '3') {
            return 'สูงกว่าปริญญาตรี';
        }
    }

    private checkSourceIncome(primarySelect) {
        if (primarySelect === '01') {
            return 'เงินเดือน'
        } else if (primarySelect === '02') {
            return 'การประกอบธุรกิจ'
        } else if (primarySelect === '03') {
            return 'การลงทุน'
        } else if (primarySelect === '04') {
            return 'อื่นๆ';
        }
    }

    private checkDataOther(data, condition, value) {
        return data !== condition ? value : '';
    }

    private checkCountryIncome(countryIncome) {
        if (countryIncome === '0') {
            return 'TH';
        } else {
            return 'EN';
        }
    }

    private checkSeize(seize) {
        if (seize === 'N') {
            return 'ไม่ใช่';
        } else {
            return 'ใช่';
        }
    }

    private checkInvolvEamlo(launder) {
        if (launder === 'N') {
            return 'ไม่เคย';
        } else {
            return 'เคย';
        }
    }

    private checkPolitical(political) {
        if (political === 'N') {
            return 'ไม่ใช่';
        } else {
            return 'ใช่';
        }
    }

    private checkBenefit(benefit) {
        if (benefit === '0') {
            return 'Y';
        } else {
            return 'N';
        }
    }

    private checkTitleName(title) {
        switch (title) {
            case "นาย":
            case "นาง":
            case "นางสาว":
                return title;
                break;
            default:
                return "อื่นๆ";
                break;
        }
    }

    private checkRelationShip(relationship) {
        if (relationship !== '99') {
            return '';
        }
    }

    private checkRelationShipName1(relationship) {
        if (!isNullOrUndefined(relationship.Data1) && relationship.Data1 !== '') {
            return relationship.title1.TH + ' ' + relationship.name1.TH;
        }
    }

    private checkRelationShipName2(relationship) {
        if (!isNullOrUndefined(relationship.Data2) && relationship.Data2 !== '') {
            return relationship.title2.TH + ' ' + relationship.name2.TH;
        }
    }

    GetSubscriptionForm(register: Register, atm, smsList, productList, ib, phoneService) {

        let work_address_1 = "";
        let work_address_2 = "";
        let work_address_3 = "";
        let register_address_1 = "";
        let register_address_2 = "";
        let register_address_3 = "";
        let current_address_1 = "";
        let current_address_2 = "";
        let current_address_3 = "";
        let phoneService_job_id = "";

        //office
        work_address_1 = this.checkAddress1(register.ssu.office);
        work_address_2 = this.checkAddress2(register.ssu.office);
        work_address_3 = this.checkAddress3(register.ssu.office);

        //cardInfo
        register_address_1 = this.checkAddress1(register.ssu.cardInfo);
        register_address_2 = this.checkAddress2(register.ssu.cardInfo);
        register_address_3 = this.checkAddress3(register.ssu.cardInfo);

        //current
        current_address_1 = this.checkAddress1(register.subscription);
        current_address_2 = this.checkAddress2(register.subscription);
        current_address_3 = this.checkAddress3(register.subscription);

        // if (!isNullOrUndefined(register.subscription.address.no) && register.subscription.address.no !== '') {
        //     current_address_1 = current_address_1 + '  เลขที่ ' + register.subscription.address.no
        // } else { register_address_1 = register_address_1 + '  เลขที่ ' + "-" }
        // if (!isNullOrUndefined(register.subscription.address.moo) && register.subscription.address.moo !== '') {
        //     current_address_1 = current_address_1 + '   หมู่ที่' + register.subscription.address.moo
        // } else { register_address_1 = register_address_1 + '   หมู่ที่ ' + "-" }
        // if (!isNullOrUndefined(register.subscription.address.village) && register.subscription.address.village !== '') {
        //     current_address_1 = current_address_1 + '   หมู่บ้าน' + register.subscription.address.village
        // } else { register_address_1 = register_address_1 + '   หมู่บ้าน ' + "-" }
        // if (!isNullOrUndefined(register.subscription.address.tower) && register.subscription.address.tower !== '') {
        //     current_address_1 = current_address_1 + '   อาคาร' + register.subscription.address.tower
        // } else { current_address_1 = current_address_1 + '   อาคาร ' + "-" }
        // if (!isNullOrUndefined(register.subscription.address.floor) && register.subscription.address.floor !== '') {
        //     current_address_1 = current_address_1 + '   ชั้น' + register.subscription.address.floor
        // } else { current_address_1 = current_address_1 + '   ชั้น ' + "-" }

        // if (!isNullOrUndefined(register.subscription.address.alley) && register.subscription.address.alley !== '') {
        //     current_address_2 = current_address_2 + '   ซอย ' + register.subscription.address.alley
        // } else { current_address_2 = current_address_2 + '   ซอย ' + "-" }
        // if (!isNullOrUndefined(register.subscription.address.street) && register.subscription.address.street !== '') {
        //     current_address_2 = current_address_2 + '   ถนน ' + register.subscription.address.street
        // } else { current_address_2 = current_address_2 + '   ถนน ' + "-" }
        // if (!isNullOrUndefined(register.subscription.address.locality) && register.subscription.address.locality !== '') {
        //     current_address_2 = current_address_2 + '   แขวง/ตำบล ' + register.subscription.address.locality
        // } else { current_address_2 = current_address_2 + '   แขวง/ตำบล ' + "-" }

        // if (!isNullOrUndefined(register.subscription.address.district) && register.subscription.address.district !== '') {
        //     current_address_3 = current_address_3 + '   เขต/อำเภอ ' + register.subscription.address.district
        // } else { current_address_3 = current_address_3 + '  เขต/อำเภอ ' + "-" }
        // if (!isNullOrUndefined(register.subscription.address.province) && register.subscription.address.province !== '') {
        //     current_address_3 = current_address_3 + '   จังหวัด ' + register.subscription.address.province
        // } else { current_address_3 = current_address_3 + '   จังหวัด ' + "-" }
        // if (!isNullOrUndefined(register.subscription.address.country) && register.subscription.address.country !== '') {
        //     current_address_3 = current_address_3 + '   ประเทศ ' + register.subscription.address.country
        // } else { current_address_3 = current_address_3 + '   ประเทศ ' + "-" }
        // if (!isNullOrUndefined(register.subscription.address.postcode) && register.subscription.address.postcode !== '') {
        //     current_address_3 = current_address_3 + '   รหัสไปรษณีย์ ' + register.subscription.address.postcode
        // } else { current_address_3 = current_address_3 + '   รหัสไปรษณีย์ ' + "-" }

        const idType = register.ssu.cardInfo.idType === 'I' ? 'Y' : 'N';
        const nameTH = register.ssu.cardInfo.titleTH + ' ' + register.ssu.cardInfo.nameTH + '  ' + register.ssu.cardInfo.surnameTH;
        const nameEN = register.ssu.cardInfo.titleEN + ' ' + register.ssu.cardInfo.nameEN + '  ' + register.ssu.cardInfo.surnameEN;

        const birthDateTH = register.ssu.cardInfo.birthdate.day + ' ' + register.ssu.cardInfo.birthdate.mounth + ' ' + register.ssu.cardInfo.birthdate.year;
        const birthDateEN = register.ssu.cardInfo.birthdate.day + ' ' + register.ssu.cardInfo.birthdate.mounthEN + ' ' + register.ssu.cardInfo.birthdate.yearEN;

        const issueDateTH = register.ssu.cardInfo.issueDate.day + ' ' + register.ssu.cardInfo.issueDate.mounth + ' ' + register.ssu.cardInfo.issueDate.year;
        const issueDateEN = register.ssu.cardInfo.issueDate.day + ' ' + register.ssu.cardInfo.issueDate.mounthEN + ' ' + register.ssu.cardInfo.issueDate.yearEN;

        const expireDateTH = register.ssu.cardInfo.expireDate.day + ' ' + register.ssu.cardInfo.expireDate.mounth + ' ' + register.ssu.cardInfo.expireDate.year;
        const expireDateEN = register.ssu.cardInfo.expireDate.day + ' ' + register.ssu.cardInfo.expireDate.mounthEN + ' ' + register.ssu.cardInfo.expireDate.yearEN;

        const doc_card_image = Utils.checkEmptyValue(register.ssu.cardInfo.image);

        if (phoneService === true) {
            phoneService_job_id = register.job_id_lock;
        }

        const json = {
            ["ssid"]: register.subscription_id || '',
            ["cust_title_name"]: register.ssu.cardInfo.titleFullTH || register.subscription.cardInfo.titleFullTH,
            ["cust_first_name"]: register.ssu.cardInfo.nameTH,
            ["cust_last_name"]: register.ssu.cardInfo.surnameTH,
            ["id_type"]: AppConstant.IdType,
            ["id_no"]: register.ssu.cardInfo.idCardNumber.toString(),
            ["work_address_1"]: work_address_1,
            ["work_address_2"]: work_address_2,
            ["work_address_3"]: work_address_3,
            ["work_tel_no"]: register.ssu.office.contact.office_phone || register.subscription.office.contact.office_phone,
            ["work_tel_ext"]: "",
            ["current_address_1"]: current_address_1,
            ["current_address_2"]: current_address_2,
            ["current_address_3"]: current_address_3,
            ["email"]: register.subscription.contact.email,
            ["mobile_no"]: register.subscription.contact.moblie_phone,
            ["home_tel_no"]: register.subscriptionService.contact.home_phone || register.ssu.current.contact.home_phone,
            ["home_tel_ext"]: "",
            ["fax_no"]: register.subscription.contact.fax_phone || register.ssu.current.contact.fax_phone,
            ["fax_ext"]: "",
            ["kyc_level"]: register.ssu.kyc.Value,
            ["isReadFromCard"]: idType,
            ["docInfo"]: {
                ["doc_id_no"]: register.ssu.cardInfo.idCardNumber.toString(),
                ["doc_name_th"]: nameTH,
                ["doc_name_en"]: nameEN,
                ["doc_birth_date_th"]: birthDateTH,
                ["doc_birth_date_en"]: birthDateEN,
                ["doc_address"]: register.ssu.cardInfo.address.AddressFull,
                ["doc_date_issue_th"]: issueDateTH,
                ["doc_date_issue_en"]: issueDateEN,
                ["doc_date_expire_th"]: expireDateTH,
                ["doc_date_expire_en"]: expireDateEN,
                ["doc_card_image"]: doc_card_image
            },
            ["productList"]: productList,
            ["ib"]: ib,
            ['atm']: Utils.checkEmptyValue(atm),
            ['smsList']: Utils.checkEmptyValue(smsList),
            ["phone_job_id"]: Utils.checkEmptyValue(phoneService_job_id)
        }

        const url = API.GetSubscriptionForm;
        return this.apiService.postVIBWithHeader(url, json)
    }

    private checkAddress1(workaddress) {
        let address = '';
        address += this.replaceAddress(workaddress.address.no, '  เลขที่ ');
        address += this.replaceAddress(workaddress.address.moo, '   หมู่ที่ ');
        address += this.replaceAddress(workaddress.address.village, '   หมู่บ้าน ');
        address += this.replaceAddress(workaddress.address.tower, '   อาคาร ');
        address += this.replaceAddress(workaddress.address.floor, '   ชั้น ');
        return address;
    }

    private checkAddress2(workaddress) {
        let address = '';
        address += this.replaceAddress(workaddress.address.alley, '  ซอย ');
        address += this.replaceAddress(workaddress.address.street, '   ถนน ');
        address += this.replaceAddress(workaddress.address.locality, '   แขวง/ตำบล ');
        return address;
    }

    private checkAddress3(workaddress) {
        let address = '';
        address += this.replaceAddress(workaddress.address.district, '  เขต/อำเภอ ');
        address += this.replaceAddress(workaddress.address.province, '   จังหวัด ');
        address += this.replaceAddress(workaddress.address.country, '   ประเทศ ');
        address += this.replaceAddress(workaddress.address.postcode, '   รหัสไปรษณีย์ ');

        return address;
    }
    private replaceAddress(data, label) {
        if (!isNullOrUndefined(data) && data !== '') {
            return label + data;
        } else {
            return label + "-";
        }
    }

    GetSubscriptionForm2(register: Register, subscriptionService, customerExist: boolean, getFormFor: string) {
        const nameTH = register.ssu.cardInfo.titleTH + ' ' + register.ssu.cardInfo.nameTH + '  ' + register.ssu.cardInfo.surnameTH;
        const nameEN = register.ssu.cardInfo.titleEN + ' ' + register.ssu.cardInfo.nameEN + '  ' + register.ssu.cardInfo.surnameEN;

        const birthDateTH = register.ssu.cardInfo.birthdate.day + ' ' + register.ssu.cardInfo.birthdate.mounth + ' ' + register.ssu.cardInfo.birthdate.year;
        const birthDateEN = register.ssu.cardInfo.birthdate.day + ' ' + register.ssu.cardInfo.birthdate.mounthEN + ' ' + register.ssu.cardInfo.birthdate.yearEN;

        const issueDateTH = register.ssu.cardInfo.issueDate.day + ' ' + register.ssu.cardInfo.issueDate.mounth + ' ' + register.ssu.cardInfo.issueDate.year;
        const issueDateEN = register.ssu.cardInfo.issueDate.day + ' ' + register.ssu.cardInfo.issueDate.mounthEN + ' ' + register.ssu.cardInfo.issueDate.yearEN;

        const expireDateTH = register.ssu.cardInfo.expireDate.day + ' ' + register.ssu.cardInfo.expireDate.mounth + ' ' + register.ssu.cardInfo.expireDate.year;
        const expireDateEN = register.ssu.cardInfo.expireDate.day + ' ' + register.ssu.cardInfo.expireDate.mounthEN + ' ' + register.ssu.cardInfo.expireDate.yearEN;

        const doc_card_image = !isNullOrUndefined(register.ssu.cardInfo.image) ? register.ssu.cardInfo.image : '';
        let useSmartRegis = 'N';
        if (!isNullOrUndefined(register.chipNo)) {
            if (register.chipNo !== '') {
                useSmartRegis = 'Y';
            }
        }
        if (isNullOrUndefined(getFormFor)) {
            Utils.logDebug('GetSubscriptionForm2', 'Not suppoer type getFormFor: ' + getFormFor);
            getFormFor = '';
        }
        console.log(register.subscription_id);
        // ยัง mapping ข้อมูลไม่ครบ
        const json = {
            "curr_address_info": {
                "curr_address_building": register.subscription.address.tower,
                "curr_address_country": register.subscription.address.country,
                "curr_address_district": register.subscription.address.district,
                "curr_address_floor": register.subscription.address.floor,
                "curr_address_moo": register.subscription.address.moo,
                "curr_address_no": register.subscription.address.no,
                "curr_address_postcode": register.subscription.address.postcode,
                "curr_address_province": register.subscription.address.province,
                "curr_address_road": register.subscription.address.street,
                "curr_address_soi": register.subscription.address.alley,
                "curr_address_subdistrict": register.subscription.address.locality,
                "curr_address_village": register.subscription.address.village,
            },
            "cust_doc_info": {
                "doc_address": register.ssu.cardInfo.address.AddressFull,
                "doc_birth_date_en": birthDateEN,
                "doc_birth_date_th": birthDateTH,
                "doc_date_expire_en": expireDateEN,
                "doc_date_expire_th": expireDateTH,
                "doc_date_issue_en": issueDateEN,
                "doc_date_issue_th": issueDateTH,
                "doc_id_no": register.ssu.cardInfo.idCardNumber.toString(),
                "doc_name_en": nameEN,
                "doc_name_th": nameTH,
            },
            "cust_profile": {
                "cust_type": (customerExist === true) ? 'E' : 'N',
                "customer_first_name": register.ssu.cardInfo.nameTH,
                "customer_last_name": register.ssu.cardInfo.surnameTH,
                "customer_title_name": register.ssu.cardInfo.titleTH,
                "email": register.subscription.contact.email,
                "fax_no": register.ssu.current.contact.fax_phone,
                "home_tel_no": register.ssu.current.contact.home_phone,
                "id_no": register.ssu.cardInfo.idCardNumber.toString(),
                "id_type": AppConstant.IdType,
                "is_from_card": useSmartRegis,
                "kyc": Utils.checkEmptyValue(register.ssu.kyc.Select),
                "mobile_no": register.subscription.contact.moblie_phone,
                "ssid": register.onStatus,
                "work_phone": register.ssu.office.contact.office_phone
            },
            "img": Utils.checkEmptyValue(register.ssu.cardInfo.image),
            "subscription_product": {
                "account_name": register.subscription.account.ACCOUNT_NAME,
                "account_no": Utils.checkEmptyValue(register.account_no),
                "account_type": register.subscription.account.PROD_TYPE,
                "product_code": this.dataService.selectedProduct.PROD_CODE,
                "product_desc": this.dataService.selectedProduct.PROD_DESC,
                "product_group": register.subscription.account.PROD_TYPE,
                "psbook_flg": Utils.checkEmptyValue(register.subscription.account.flg_psbook),
                "psbook_no": "",
                "purpose": register.subscription.account.OBJ.Id,
                "purpose_desc": register.subscription.account.OBJ.Id === '99' ? register.subscription.account.OBJ_OTH : '',
                "sign_condition": "1",
                "sign_condition_desc": "-",
                "statement_type": "M",
                "benefit_account_no": Utils.checkEmptyValue(register.account_no_interest)
            },
            "subscription_service": subscriptionService,
            "txn_date": moment().utc(true).format('DD/MM/YYYY'),
            "txn_type": getFormFor, // OpenAccount , SubService
            "work_address_info": {
                "work_address_building": register.ssu.office.address.tower,
                "work_address_country": register.ssu.office.address.country,
                "work_address_district": register.ssu.office.address.district,
                "work_address_floor": register.ssu.office.address.floor,
                "work_address_moo": register.ssu.office.address.moo,
                "work_address_no": register.ssu.office.address.no,
                "work_address_postcode": register.ssu.office.address.postcode,
                "work_address_province": register.ssu.office.address.province,
                "work_address_road": register.ssu.office.address.street,
                "work_address_soi": register.ssu.office.address.alley,
                "work_address_subdistrict": register.ssu.office.address.locality,
                "work_address_village": register.ssu.office.address.village,
            }
        }

        const url = API.GetSubscriptionForm;
        return this.apiService.postVIBWithHeader(url, json);
    }

    GetMasterATM() {
        const json = {};
        const url = API.GetMasterATM;
        return this.apiService.postVIBWithHeader(url, json);
    }

    GetTitleList() {
        const json = {
            "type_group": "I"
        }

        const url = API.GetTitleList;
        return this.apiService.postVIBWithHeader(url, json, false);
    }

    UpdateKYCLevel(register: Register) {
        const json = {
            ["id_no"]: register.ssu.cardInfo.idCardNumber.toString(),
            ["id_type"]: AppConstant.IdType,
            ["kyc_level"]: register.ssu.kyc.Value,
        }

        const url = API.UpdateKYCLevel;
        return this.apiService.postVIBWithHeader(url, json);
    }

    public GetFATCAForm(register: Register) {

        let nationality = ''
        let usCard = ''
        let usLocation = '';
        let usTerritory = '';
        let usTransfer = '';
        let usSignatory = '';
        let usContact = '';
        let usAddress = '';
        let usTelephone = '';

        if (register.ssu.cardInfo.nationId === 'TH') {
            nationality = 'ไทย'
        } else {
            nationality = 'สัญชาติอื่นๆ/หากมีมากกว่า 1 สัญชาติ';
        }

        register.fatca.usCard === '0' ? usCard = 'Y' : usCard = 'N';
        register.fatca.usLocation === '0' ? usLocation = 'Y' : usLocation = 'N';
        register.fatca.usTerritory === '0' ? usTerritory = 'Y' : usTerritory = 'N';
        register.fatca.usTransfer === '0' ? usTransfer = 'Y' : usTransfer = 'N';
        register.fatca.usSignatory === '0' ? usSignatory = 'Y' : usSignatory = 'N';
        register.fatca.usContact === '0' ? usContact = 'Y' : usContact = 'N';
        register.fatca.usAddress === '0' ? usAddress = 'Y' : usAddress = 'N';
        register.fatca.usTelephone === '0' ? usTelephone = 'Y' : usTelephone = 'N';

        const json = {
            ["ssid"]: "-",
            ["cust_title_name"]: register.ssu.cardInfo.titleTH,
            ["cust_first_name"]: register.ssu.cardInfo.nameTH,
            ["cust_last_name"]: register.ssu.cardInfo.surnameTH,
            ["id_type"]: AppConstant.IdType,
            ["id_no"]: register.ssu.cardInfo.idCardNumber.toString(),
            ["nationality"]: nationality,
            ["passport_no"]: "",
            ["account_no"]: "",
            ["Q1"]: register.fatca.usCitizen,
            ["Q2"]: usCard,
            ["Q3"]: usLocation,
            ["Q4"]: usTerritory,
            ["Q5"]: usTransfer,
            ["Q6"]: usSignatory,
            ["Q7"]: usContact,
            ["Q8"]: usAddress,
            ["Q9"]: usTelephone
        }

        const url = API.GetFATCAForm;
        return this.apiService.postVIBWithHeader(url, json);
    }

    public GetPromptPayForm(register: Register) {

        let new_type = ''
        if (register.AnyIdType === 'NATID') {
            new_type = 'CARDID'
        } else {
            new_type = register.AnyIdType;
        }

        const json = {
            "cancel_promptpay": {
                "cancel_type": ""
            },
            "cust_profile": {
                "account_no": register.account_no,
                "customer_first_name": register.ssu.cardInfo.nameTH,
                "customer_last_name": register.ssu.cardInfo.surnameTH,
                "customer_title_name": register.ssu.cardInfo.titleFullTH,
                "email": register.subscriptionService.contact.email,
                "id_no": register.ssu.cardInfo.idCardNumber,
                "id_type": AppConstant.IdType,
                "tel_no": register.subscriptionService.contact.moblie_phone,
                "txn_flag": "N" //N = NEW , E = EDIT , C = CANCLE
            },
            "edit_promptpay": {
                "edit_type": "",
                "new_account_no": "",
                "new_tel_no": "",
                "old_account_no": "",
                "old_tel_no": ""
            },
            "new_promptpay": {
                "new_type": new_type,
                "request_copy_contract": ""
            },
            "ssid": ""
        }

        const url = API.GetPromptPayForm;
        return this.apiService.postVIBWithHeader(url, json);
    }
}

