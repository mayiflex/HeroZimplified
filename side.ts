import { Document } from "https://deno.land/x/deno_dom@v0.1.35-alpha/src/dom/document.ts";
import Mission from "./src/Mission.ts";
import Workout from "./src/Workout.ts";

const document = new Document();
const contentBox = document.querySelector("#flex");
const sections = ["Missions", "Trainings"]
let sectionIndx = 0;
let lastUpdate = 0;


function getLastChangedSectionIndexIfUpdated() {
	let latestUpdate: string | number | null = localStorage.getItem("latestUpdate");
	if(latestUpdate == null) return sectionIndx;
	latestUpdate = parseInt(latestUpdate);

	if(latestUpdate <= lastUpdate) {
		return sectionIndx;
	}

	lastUpdate = latestUpdate;
	if(Mission.LastUpdate == latestUpdate) {
		return 0;
	} else {
		return 1;
	}
}

function updateSidePage() {
	sectionIndx = getLastChangedSectionIndexIfUpdated();

	let latestUpdate: string | number | null = localStorage.getItem("latestUpdate");
	if(latestUpdate == null) return;
	latestUpdate = parseInt(latestUpdate);
	lastUpdate = latestUpdate > lastUpdate ? latestUpdate : lastUpdate;

	let side =  "";
	try {
	switch(sectionIndx) {
		case 0: {
			side += `<table class="styled-table"><thead><tr><th align="right">Zone</th><th>#</th><th>Energycost</th><th>Item</th><th>Exp</th><th>Coins</th><th>⠀</th></tr></thead>`
			const m = Mission.All;
			for(let i = 0; i < m.length; i++) {
				side += `<tbody><tr>
				<th align="right">${m[i].Location}</th>
				<th>${m[i].Position}</th>
				<th align="right">${m[i].Cost}</th>
				<th>${m[i].RewardsPerCost.Item}</th>
				<th>${m[i].RewardsPerCost.Exp}</th>
				<th>${m[i].RewardsPerCost.Coins}</th>
				</tr></tbody>`;
			}
			break;
		}
		case 1: {
			side += "<table class=\"styled-table\"><thead><tr><th>Type</th><th>Cost</th><th>Item</th><th>Exp</th><th>Coins</th><th>Main</th><th>Flex</th><th>Donuts</th><th>⠀⠀</th></tr></thead>"
			const w = Workout.All;
			for(let i = 0; i < w.length; i++) {
				side += `<tbody><tr>
				<th>${w[i].StatType}</th>
				<th align="right">${w[i].Cost}</th>
				<th>${w[i].RewardsPerCost.Item}</th>
				<th>${w[i].RewardsPerCost.Exp}</th>
				<th>${w[i].RewardsPerCost.Coins}</th>
				<th>${w[i].RewardsPerCost.MainStats}</th>
				<th>${w[i].RewardsPerCost.FlexStats}</th>
				<th>${w[i].RewardsPerCost.Donuts}</th>
				</tr></tbody>`;
			}
			break;
		}
	}
	side += "</table></div>"
	} catch { 
		//do nothing
	}
	if(contentBox != null) {
		contentBox.innerHTML = side;
		contentBox.id = "noflex";
	}
}
self.addEventListener("click", () => {
	sectionIndx++;
	if(sectionIndx >= sections.length) sectionIndx = 0;
	updateSidePage();
});

const updateSidePageEvent = () => updateSidePage();
addEventListener('storageUpdate', updateSidePageEvent);
addEventListener('missionUpdate', Mission.UnboxAll);
addEventListener('workoutUpdate', Workout.UnboxAll);
updateSidePage();