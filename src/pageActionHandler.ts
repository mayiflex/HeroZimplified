// deno-lint-ignore-file no-explicit-any
// @deno-types="../../../../node_modules/@types/webextension-polyfill/index.d.ts"
import browser from "../../../../node_modules/webextension-polyfill/dist/browser-polyfill.js"

function pageActionVisibility() {
	browser.tabs.query({active: true}).then((tabs: any) => {
		try {
			if(tabs[0].url.includes(".herozerogame.com")) browser.pageAction.show(tabs[0].id);
			else browser.pageAction.hide(tabs[0].id);
		} catch { 
			//security try catch if browser is lagging out
		}
	});
}

function openMainWindow() {
	const _mainWindow = browser.tabs.create({ url: "../pretty/views/main.html"});
}

export default function StartPageActionHandler() {
    browser.tabs.onActivated.addListener(pageActionVisibility);
    browser.tabs.onUpdated.addListener(pageActionVisibility);
	browser.pageAction.onClicked.addListener(openMainWindow);
}

/*import { createRequire } from "https://deno.land/std/node/module.ts";
const require = createRequire(import.meta.url);
const browser = require("webextension-polyfill");*/