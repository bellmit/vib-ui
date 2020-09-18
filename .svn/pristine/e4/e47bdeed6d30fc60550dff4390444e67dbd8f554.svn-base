import {Injectable} from '@angular/core';
import {API, JSONKey} from "../../../share/app.constant";
import {APIService} from "./api.service";
import {UserProfile} from "../../_model/userProfile";

@Injectable()
export class LoginService {

    constructor(private apiService: APIService) {

    }

    loginWithUsernameNewVIB(username: string, password: string, loginType: string) {

        const json = {[JSONKey.Username]: username, [JSONKey.Password]: password};
        const url = API.LoginByUsernameWithProfile;
        return this.apiService.postVIBWithHeader(url, json).map(data => new UserProfile(data, loginType));
    }

    loginWithIDAndPINNewVIB(idCard, pin: string , loginType: string) {
        const json = {
            ["id_type"]: "001",
            ["id_no"]: idCard,
            ["my_pin"]: pin
        };

        const url = API.LoginByIdcardAndmyPinWithProfile;
        return this.apiService.postVIBWithHeader(url, json).map(data => new UserProfile(data, loginType));
    }

    authenticateWithUserName(username: string, password: string) {

        const json = {[JSONKey.Username]: username, [JSONKey.Password]: password};
        const url = API.LoginByUsername;
        return this.apiService.postVIBWithHeader(url, json);
    }

    checkTellerAuthenNewVIB() {
        const json = {};
        const url = API.CheckTellerAuthen;
        return this.apiService.postVIBWithHeader(url, json);
    }

    loginWithATMAndPIN(atm: string, pin: string , loginType: string) {
        const json = {
            ["atm_no"]: atm,
            ["atm_pin"]: pin
        };

        const url = API.LoginByATMAndPIN;
        return this.apiService.postVIBWithHeader(url, json).map(data => new UserProfile(data, loginType));
    }
}
