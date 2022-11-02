// deno-lint-ignore-file no-explicit-any
// @deno-types="../../../../node_modules/@types/webextension-polyfill/index.d.ts"
import browser from "../../../../node_modules/webextension-polyfill/dist/browser-polyfill.js"
import Mission from "./cs/Mission.ts";
import Workout from "./cs/Workout.ts";
import Item from "./cs/Item.ts";

function requestListener(details: any) {
	const filter = browser.webRequest.filterResponseData(details.requestId);
	const decoder = new TextDecoder("utf-8");
	const responses = new Array<string>();
	
	filter.ondata = (event: any) => {
		const str = decoder.decode(event.data, {stream: true});
		responses.push(str);
		filter.write(event.data);
	}
	
	filter.onstop = (_event: any) => {
		try {
			const hzdata = JSON.parse(responses.join(''));
			console.log(hzdata);
			if(hzdata.data.items != null) {
				console.log("setting items")
				Item.SetAll(hzdata.data.items);
			}
			if(hzdata.data.quests != null) {
				console.log("calling mission store")
				Mission.StoreAll(hzdata.data.quests);
			}
			if(hzdata.data.trainings != null) {
				console.log("calling workout store")
				Workout.StoreAll(hzdata.data.trainings);
			}
		} catch (ex) { 
			console.log(ex)
		}
		filter.disconnect();
	}
	return {};
}

export default function StartListenerHandler() {
    browser.webRequest.onBeforeRequest.addListener(
        requestListener,
        {urls: ["https://*.herozerogame.com/request.php"], types: ["xmlhttprequest"]},
        ["blocking"]
    );
}