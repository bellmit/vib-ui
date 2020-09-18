/**
 * Created by imac on 6/5/2017 AD.
 */
import {browser, element, by} from 'protractor';
import {Utils} from "./utils";
import {rendererTypeName} from "@angular/compiler";

export class TransferPage {

    navigateTo() {
        return browser.get('/#/kk/').then(function () {

            browser.executeScript('document.querySelector(\'[id="transfer"]\').style.right = "0px"');
            Utils.onClickElementById("transfer")
                .then(function () {
                    browser.waitForAngular();
                    return;
                });
        });

    }

    selectFromAccount() {
        return Utils.onClickElementById("div-select-account-from");
    }

    selectToAccount() {
        return Utils.onClickElementById("div-select-account-to");
    }

    submitAccountNumberByNonLogin() {

        return Utils.onEnterVirtualKeyboard()
            .then(function () {
                return Utils.onClickElementById("button-submit");
            });
    }

    submitGetFee() {

        return Utils.onEnterVirtualKeyboard()
            .then(function () {
                return Utils.onClickElementById("button-submit-fee");
            });
    }

    submitConfirmTransfer() {

        return Utils.onClickElementById("button-confirm-transfer");
    }

    submitConfirmTransferPayFeeByDeduction() {

        return Utils.onClickElementById("button-confirm-transfer-via-deduction");
    }

    submitFinishWithoutPrintSlip() {

        return Utils.onClickElementById("button-do-not-print-slip");
    }

    submitFinishWithPrintSlip() {

        return Utils.onClickElementById("button-do-print-slip");
    }

    submitAuthenticate(username: string, password: string) {
        const usernameElement = element(by.id("username"));
        const passwordElement = element(by.id("password"));

        usernameElement.sendKeys(username);
        passwordElement.sendKeys(password);

        return Utils.onClickElementById("button_login");
    }

    inputAccountNumberByNonLogin(accountNumber: string) {

        const input = element(by.id("account-number"));
        input.clear();
        input.sendKeys(accountNumber);
        return input.getAttribute("value");
    }

    inputTransferAmount(amount: string) {

        const input = element(by.id("input-amount"));
        input.clear();
        input.sendKeys(amount);
        return input.getAttribute("value");
    }

    scrollSelectInterBank(bankCode: string) {

        return Utils.onClickElementById(bankCode)
            .then(function () {
                browser.waitForAngular();
            });
    }
}