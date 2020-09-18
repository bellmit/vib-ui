/**
 * Created by Palomar on 10/20/2016 AD.
 */
import { isNullOrUndefined } from "util";
import { forEach } from "@angular/router/src/utils/collection";
import { count } from "rxjs/operator/count";
import { utils } from "protractor";
import { Utils } from "../../share/utils";
import { Register } from "./register";
import { AppConstant } from "../../share/app.constant";


export class IdCardInfo {

    ACCOUNT_NAME: string = '';
    titleTH: string;
    titleTHId: string;
    titleEN: string;
    titleENId: string;
    titleFullTH: string;
    titleFullEN: string;
    nameTH: string = "";
    nameEN: string = "";
    surnameTH: string = "";
    surnameEN: string = "";
    idCardNumber: string = "";
    idCardNumbertxt: string;
    birthdate: Date = new Date();
    expireDate: Date = new Date();
    issueDate: Date = new Date();
    gender: Gender = new Gender();
    nation: string;
    nationId: string;
    nationThai: string = 'ไทย';
    idType: string = "";
    laser_no: string;
    chipNo: string;
    requestNo: string;
    address: Address = new Address();
    image: string;

    parseJSON(data) {

        //บุคคลธรรมดา
        this.idCardNumber = data.citizenId;
        this.idCardNumbertxt = Utils.idCardformat(data.citizenId);
        this.gender.value = data.sex;
        this.gender.data = data.sex === 'Male' ? 'ชาย' : 'หญิง';
        this.ACCOUNT_NAME = data.nameTh.title + ' ' + data.nameTh.firstName + ' ' + data.nameTh.lastName;
        this.titleTH = data.nameTh.title;
        this.titleEN = data.nameEn.title;

        this.nameTH = data.nameTh.firstName;
        this.nameEN = data.nameEn.firstName.toUpperCase();

        this.surnameTH = data.nameTh.lastName;
        this.surnameEN = data.nameEn.lastName.toUpperCase();
        this.idType = AppConstant.IdType;
        this.chipNo = data.chipNo;
        this.requestNo = data.requestNo;
        this.image = data.image;

        // this.birthdate = data.birthDate.day + ' ' + Utils.getshotMonth(data.birthDate.mounth) + ' ' + data.birthDate.year;
        this.birthdate.sum = data.birthDate.day + '/' + data.birthDate.mounth + '/' + data.birthDate.year;
        this.birthdate.day = data.birthDate.day;
        this.birthdate.mounth = Utils.getshotMonth(data.birthDate.mounth);
        this.birthdate.mounthEN = Utils.getshotMonthEN(data.birthDate.mounth);
        this.birthdate.mounthNumber = data.birthDate.mounth;
        this.birthdate.year = data.birthDate.year;
        this.birthdate.yearEN = Utils.getMinusYearEn(data.birthDate.year).toString();

        this.expireDate.sum = data.expireDate.day + '/' + data.expireDate.mounth + '/' + data.expireDate.year;
        this.expireDate.day = data.expireDate.day;
        this.expireDate.mounth = Utils.getshotMonth(data.expireDate.mounth);
        this.expireDate.mounthEN = Utils.getshotMonthEN(data.expireDate.mounth);
        this.expireDate.year = data.expireDate.year;
        this.expireDate.yearEN = Utils.getMinusYearEn(data.expireDate.year).toString();

        this.issueDate.sum = data.issueDate.day + '/' + data.issueDate.mounth + '/' + data.issueDate.year;
        this.issueDate.day = data.issueDate.day;
        this.issueDate.mounth = Utils.getshotMonth(data.issueDate.mounth);
        this.issueDate.mounthEN = Utils.getshotMonthEN(data.issueDate.mounth);
        this.issueDate.year = data.issueDate.year;
        this.issueDate.yearEN = Utils.getMinusYearEn(data.issueDate.year).toString();
        this.nation = this.nationThai;

        //ที่อยู่ตามบัตรประชาชน
        this.address.no = data.address.no;
        this.address.moo = Utils.subVillage(data.address.village);
        this.address.street = data.address.road ? data.address.road.replace('ถนน', '') : data.address.road;
        this.address.alley = data.address.lane ? data.address.lane.replace('ซอย', '') : data.address.lane;
        this.address.province = data.address.province ? data.address.province.replace('จังหวัด', '') : data.address.province;
        this.address.district = Utils.subDistrict(data.address.district);
        this.address.locality = Utils.subSubDistrict(data.address.subdistrict);
        this.address.country = this.nationThai;


        this.address.AddressFull = data.address.no + ' ' + (data.address.village || data.address.lane.replace("ซอย", "ซ.") || data.address.road.replace("ถนน", "ถ.")) + ' ' +
            data.address.subdistrict.replace("ตำบล", "ต.") + ' ' + data.address.district.replace("อำเภอ", "อ.") + ' ' + data.address.province.replace("จังหวัด", "จ.");
    }
}

export class Address {

    seq: string = '';
    no: string = "";
    moo: string = "";
    alley: string = "";
    floor: string = "";
    street: string = "";
    village: string = "";
    tower: string = "";
    locality: string = "";
    localityId: string;
    district: string = "";
    districtId: string;
    province: string = "";
    provinceId: string;
    postcode: string = "";
    country: string = "";
    countryId: string;
    AddressFull: string = "";
}

export class Date {
    day: string = "";
    mounth: string = "";
    mounthEN: string = "";
    mounthNumber: string;
    year: string = "";
    yearEN: string = "";
    sum: string;
}

export class Gender {
    data: string;
    value: string;
}

