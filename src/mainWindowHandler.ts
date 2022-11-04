// @deno-types="../../../../node_modules/@types/webextension-polyfill/index.d.ts"
import browser from "../../../../node_modules/webextension-polyfill/dist/browser-polyfill.js"
import Mission from "./cs/Mission.ts";
import Workout from "./cs/Workout.ts";
import Settings from "./cs/Settings.ts"
import Language from "./cs/Language.ts";
import { Section } from "./enums/Section.ts";

const contentBox = document.querySelector("#flex");
const sections = ["Missions", "Trainings"]
let settings: Settings | undefined = undefined;
let language: Language | undefined = undefined;
let sectionIndex = 0;
let lastUpdate = 0;


async function updateSectionIndex() {
	const latestUpdate = await unboxLatestUpdate()
	if(latestUpdate > Workout.LastUpdate) {
		await Workout.UnboxAll();
		Workout.LastUpdate = latestUpdate;
		sectionIndex = Section.Workouts;
		lastUpdate = latestUpdate
	}
	if(latestUpdate > Mission.LastUpdate) { 
		await Mission.UnboxAll();
		Mission.LastUpdate = latestUpdate;
		sectionIndex = Section.Missions;
		lastUpdate = latestUpdate
	}
}
async function doesNeedUpdate() : Promise<boolean> { 
	if(await unboxLatestUpdate() > lastUpdate) return true;
	return false;
}
async function unboxLatestUpdate() : Promise<number> {
	const lastUpdateStr = (await browser.storage.local.get("latestUpdate")).latestUpdate;
	if(lastUpdateStr == null) return 0;
	return parseInt(lastUpdateStr);
}

async function updateSidePage() {
	if(language == undefined || settings == undefined) return;
	console.log("updating")
	if(await doesNeedUpdate()) {
		await updateSectionIndex();
	}

	const table = new Array<string>();
	try {
		switch(sectionIndex) {
			case Section.Missions: {
				table.push(`<table class="styled-table"><thead><tr><th># Zone</th><th>Energycost</th><th>Item</th><th>Exp</th><th>Coins</th></tr></thead>`);
				const m = Mission.All;
				const zoneNames = language.Text[Section.Missions];
				for(let i = 0; i < m.length; i++) {
					table.push(`<tbody><tr>
					<th class="right">${settings.IdentifierSet[m[i].Position]} ${zoneNames[m[i].Zone]}</th>
					<th>${m[i].Cost}</th>
					<th>${m[i].Rewards.Item == null ? "Nein" : "Ja"}</th>
					<th>${m[i].RewardsPerCost.Exp.toFixed(2)}</th>
					<th>${m[i].RewardsPerCost.Coins.toFixed(2)}</th>
					</tr></tbody>`);
				}
				break;
			}
			case Section.Workouts: {
				table.push(`<table class=\"styled-table\"><thead><tr><th>Type</th><th>Cost</th><th>Item</th><th>Exp</th><th>Coins</th><th>Main</th><th>Flex</th><th>Donuts</th></tr></thead>`);
				const w = Workout.All;
				const skillNames = language.Text[Section.Workouts];
				for(let i = 0; i < w.length; i++) {
					table.push(`<tbody><tr>
					<th>${skillNames[w[i].StatType]}</th>
					<th>${w[i].Cost}</th>
					<th>${w[i].Rewards.Item == null ? "Nein" : "Ja"}</th>
					<th>${w[i].RewardsPerCost.Exp.toFixed(2)}</th>
					<th>${w[i].RewardsPerCost.Coins.toFixed(2)}</th>
					<th>${w[i].RewardsPerCost.MainStats.toFixed(2)}</th>
					<th>${w[i].RewardsPerCost.FlexStats.toFixed(2)}</th>
					<th>${w[i].Rewards.Donuts}</th>
					</tr></tbody>`);
				}
				break;
			}
		}
		table.push("</table></div>");
	} catch (ex) { 
		console.log(ex)
	}
	if(contentBox != null) {
		contentBox.innerHTML = table.join('');
		contentBox.id = "noflex";
	}
}

async function Init() {
	settings = (await Settings.Load());
	language = new Language(settings.Language)
}
Init();

self.addEventListener("click", () => {
	sectionIndex++;
	if(sectionIndex >= sections.length) sectionIndex = 0;
	updateSidePage();
});

browser.storage.local.onChanged.addListener(updateSidePage);