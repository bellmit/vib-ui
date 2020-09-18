/**
 * Created by imac on 6/5/2017 AD.
 */
import {browser, element, by} from 'protractor';

export class Utils {

    static onEnterVirtualKeyboard() {
        return browser.actions().mouseMove(element(by.xpath("//td[@data-name='Enter']"))).click().perform()
            .then(function () {
                browser.waitForAngular();
            });
    }

    static onClickElementById(id: string) {
        return browser.actions().mouseMove(element(by.id(id))).click().perform()
            .then(function () {
                browser.waitForAngular();
            });
    }

    static onDragElementById(id: string, x: number, y: number) {
        return browser.actions().dragAndDrop(element(by.id(id)), {x: x, y: y}).perform()
            .then(function () {
                browser.waitForAngular();
            });
    }

    static hasClass(_element, cls) {

        return _element.getAttribute('class').then(function (classes) {
            browser.waitForAngular();
            return classes.split(' ').indexOf(cls) !== -1;
        });
    }
}