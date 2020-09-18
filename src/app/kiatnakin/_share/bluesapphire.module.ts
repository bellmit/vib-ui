import {NgZone, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {WebSocketService} from './websocket.service';
import {Subject} from "rxjs/Subject";

interface ITranslator {
    startupContent(content_id: string): Function;

    loadContent(content_id: string, site_id: string): Function;

    onLVZCallee(func_name: string, param: any): Function;
}

interface IProvider {
    startup_content_id: string;
}

interface ILibrary {
    Translator: ITranslator;
    provider: IProvider;
}

declare var BS: ILibrary;
declare var _BS: ILibrary;

export class BlueSapphire {
    private io: WebSocketService;
    private random_script_postfix: string;
    private assets_root_path = 'assets/bluesapphire';
    public io_connection: Subscription[] = [];
    public htmlChange: Subject<string> = new Subject<string>();

    master_scripts = {
        class_name: 'bluesapphire_master',
        scripts: [
            `${this.assets_root_path}/bluesapphire.master.bundle.js`
        ]
    };

    constructor(private core_obj) {
        window['BlueSapphire'] = {component: this, zone: core_obj.ngZone};

        this.random_script_postfix = Date.now().toString();
        this.onLoadScript(this.master_scripts);
        const script_group = document.getElementsByClassName(this.master_scripts.class_name);
        while (!script_group[0]) {
        }
        setTimeout(() => {
            this.onLoadScript(this.core_obj.third_party_scripts);
        }, 50);
    }

    socketIOInitialize(options: { host: string, listeners: { channel: string, event_onPassive_callback: string }[] }) {
        this.io = new WebSocketService();
        this.io.connect(options.host);

        options.listeners.forEach((listener, index) => {
            this.io_connection[index] = this.io.on(listener.channel).subscribe(data => {
                this.onLVZTranslatorCaller(listener.event_onPassive_callback, data);
            });
        });
    }

    socketIOEmit(channel: string, data: any) {
        this.io.emit(channel, data);
    }

    public onLVZTranslatorCaller(func_name: string, data: any) {
        BS.Translator.onLVZCallee(func_name, data);
    }

    lvZeroTranslatorCallee(function_name: string, params: any) {
        if (this.core_obj.function[function_name]) {
            return this.core_obj.function[function_name](params);
        }
    }

    getDataServiceTranslatorCallee(key: any): string {
        return this.core_obj.dataService[key];
    }

    setDataServiceTranslatorCallee(key: any, value: any) {
        this.core_obj.dataService[key] = value;
    }

    goToTranslatorCallee(path: string, params: any) {
        if (params) {
            this.core_obj.router.navigate([path], {queryParams: params});
        } else {
            this.core_obj.router.navigate([path]);
        }
    }

    goToTranslatorCaller(content_id: string, site_id: string) {
        BS.Translator.loadContent(content_id, site_id);
    }

    addScriptElement(class_name: string, script_path: string[], index: number) {
        if (index < script_path.length) {
            const node = document.createElement('script');
            node.className = class_name;
            node.src = script_path[index] + '?p=' + this.random_script_postfix;
            node.type = 'text/javascript';

            node.onload = () => {
                this.addScriptElement(class_name, script_path, index + 1);
            };

            document.getElementsByTagName('head')[0].appendChild(node);
        } else if (class_name === this.core_obj.third_party_scripts.class_name) {

            const master_script_group = document.getElementsByClassName(this.master_scripts.class_name);
            const third_party_script_group = document.getElementsByClassName(this.core_obj.third_party_scripts.class_name);
            while (!master_script_group[0] || !third_party_script_group[0]) {
            }
            setTimeout(() => {
                BS.Translator.startupContent(_BS.provider.startup_content_id);
            }, 100);
        }
    }

    removeScript(scripts_array: { class_name: string, scripts: string[] }) {
        const script_group = document.getElementsByClassName(scripts_array.class_name);
        while (script_group[0]) {
            script_group[0].parentNode.removeChild(script_group[0]);
        }​
    }

    onLoadScript(scripts_array: { class_name: string, scripts: string[] }) {
        const script_group = document.getElementsByClassName(scripts_array.class_name);
        if (!script_group.length) {
            while (script_group[0]) {
                script_group[0].parentNode.removeChild(script_group[0]);
            }​
            // Recusive load script in array
            if (document.getElementsByClassName(scripts_array.class_name).length === 0) {
                this.addScriptElement(scripts_array.class_name, scripts_array.scripts, 0);
            }
        } else if (scripts_array.class_name === this.core_obj.third_party_scripts.class_name) {

            const master_script_group = document.getElementsByClassName(this.master_scripts.class_name);
            const third_party_script_group = document.getElementsByClassName(this.core_obj.third_party_scripts.class_name);
            while (!master_script_group[0] || !third_party_script_group[0]) {
            }
            setTimeout(() => {
                BS.Translator.startupContent(_BS.provider.startup_content_id);
            }, 100);
        }
    }

    public onDestroy() {
        this.removeScript(this.core_obj.third_party_scripts);
        this.io_connection.forEach(connection => connection.unsubscribe());
    }

    public setInnerHTML(html: string) {
        html += `<div id="bs_signature" style="display: none;">${Date.now().toString()}</div>`;
        this.htmlChange.next(html);
    }
}