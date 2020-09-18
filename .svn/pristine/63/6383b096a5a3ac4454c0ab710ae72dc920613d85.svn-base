import {TransferPage} from "./transfer.po";
import {browser, by, element} from "protractor";


describe('vib-application: TRANSFER FLOW: CASA TO INTER BANK (Non Login)', function () {

    let transfer: TransferPage;

    beforeEach(() => {
        transfer = new TransferPage();

    });

    it('should render transfer page', function () {
        transfer.navigateTo()
            .then(function () {
                const currentUrl = browser.driver.getCurrentUrl();
                expect(currentUrl).toMatch('/transfer');
            });

    });

    it('should render select from account page', function () {
        transfer.selectFromAccount().then(function () {

        })
    });

    it('should input from account number 14 digit "12345678901234" ', function () {

        const inputAccountNumber = "12345678901234";
        const result = transfer.inputAccountNumberByNonLogin(inputAccountNumber);
        expect(result).toMatch(inputAccountNumber);
    });

    it('should submit input from account number ', function () {
        transfer.submitAccountNumberByNonLogin()
            .then(function () {
            });

    });

    it('should render select to account page', function () {
        transfer.selectToAccount().then(function () {

        })
    });

    it('should select other bank (KBANK: Code 004) ', function () {
        const bankCode = "034";
        transfer.scrollSelectInterBank(bankCode)
            .then(function () {
                // const activeBank = element(by.id(bankCode));
                // expect(Utils.hasClass(activeBank, "active")).toBeTruthy();
            });
    });

    it('should input to account number 14 digit "12345678901234" ', function () {

        const inputAccountNumber = "12345678901234";
        const result = transfer.inputAccountNumberByNonLogin(inputAccountNumber);
        expect(result).toMatch(inputAccountNumber);

    });

    it('should submit input from account number ', function () {

        transfer.submitAccountNumberByNonLogin();
    });

    it('should not input transfer amount with Alphabet ', function () {

        const inputAccountNumber = "ABCDE";
        transfer.inputTransferAmount(inputAccountNumber);
        expect(element(by.id("button-submit-fee")).getAttribute('disabled')).toBeTruthy();
    });


    it('should input transfer amount with integer (1000) ', function () {

        const inputAccountNumber = "1000";
        const result = transfer.inputTransferAmount(inputAccountNumber);
        expect(result).toMatch(inputAccountNumber);
        expect(element(by.id("button-submit-fee")).getAttribute('disabled')).toBeFalsy();
    });

    it('should input transfer amount with decimal (100.25)', function () {

        const inputAccountNumber = "100.25";
        const result = transfer.inputTransferAmount(inputAccountNumber);
        expect(result).toMatch(inputAccountNumber);
        expect(element(by.id("button-submit-fee")).getAttribute('disabled')).toBeFalsy();
    });

    it('should submit get fee', function () {
        transfer.submitGetFee()
            .then(function () {
                const divConfirmData = element(by.id("div-confirm-data"));
                expect(divConfirmData.isDisplayed()).toBeTruthy();
            })
    });

    it('should submit confirm TRANSFER', function () {
        transfer.submitConfirmTransferPayFeeByDeduction()
            .then(function () {

            });
    });


    it('should Authenticate success with username: palomar password: 1234', function () {
        const username = "palomar";
        const password = "1234";
        transfer.submitAuthenticate(username, password)
            .then(function () {

            });
    });


    it('should submit to done without print slip ', function () {
        transfer.submitFinishWithoutPrintSlip()
            .then(function () {
                const currentUrl = browser.driver.getCurrentUrl();
                expect(currentUrl).toContain("http://localhost:5200/#/kk");
            });
    });
});
