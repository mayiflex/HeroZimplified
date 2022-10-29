// deno-lint-ignore-file no-explicit-any
import browser from "file://C:/Users/IX/node_modules/webextension-polyfill/dist/browser-polyfill.js";
import Mission from "./src/Mission.ts";
import Workout from "./src/Workout.ts";

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
			if(hzdata.data.quests != null) {
				Mission.StoreAll(hzdata.data.quests);
			}
			if(hzdata.data.trainings != null) {
				Workout.StoreAll(hzdata.data.trainings);
			}
		} catch { 
			//do nothing
		}
		filter.disconnect();
	}
	return {};
}
function pageActionVisibility() {
	browser.tabs.query({active: true}).then((tabs: any) => {
		try {
			if(tabs[0].url.includes(".herozerogame.com")) browser.pageAction.show(tabs[0].id);
			else browser.pageAction.hide(tabs[0].id);
		} catch { 
			//do nothing
		}
	});
}

browser.tabs.onActivated.addListener(pageActionVisibility);
browser.tabs.onUpdated.addListener(pageActionVisibility);
browser.webRequest.onBeforeRequest.addListener(
	requestListener,
	{urls: ["https://*.herozerogame.com/request.php"], types: ["xmlhttprequest"]},
	["blocking"]
);

