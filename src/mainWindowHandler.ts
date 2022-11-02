import Mission from "./cs/Mission.ts";
import Workout from "./cs/Workout.ts";
const contentBox = document.querySelector("flex");
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
	console.log("updating")
	sectionIndx = getLastChangedSectionIndexIfUpdated();

	let latestUpdate: string | number | null = localStorage.getItem("latestUpdate");
	if(latestUpdate == null) return;
	latestUpdate = parseInt(latestUpdate);
	lastUpdate = latestUpdate > lastUpdate ? latestUpdate : lastUpdate;

	let side = new Array<string>();
	try {
	switch(sectionIndx) {
		case 0: {
			side.push(`<table class="styled-table"><thead><tr><th align="right">Zone</th><th>#</th><th>Energycost</th><th>Item</th><th>Exp</th><th>Coins</th></tr></thead>`);
			const m = Mission.All;
			console.log(m)
			for(let i = 0; i < m.length; i++) {
				side.push(`<tbody><tr>
				<th align="right">${m[i].Location}</th>
				<th>${m[i].Position}</th>
				<th align="right">${m[i].Cost}</th>
				<th>${m[i].RewardsPerCost.Item}</th>
				<th>${m[i].RewardsPerCost.Exp}</th>
				<th>${m[i].RewardsPerCost.Coins}</th>
				</tr></tbody>`);
			}
			break;
		}
		case 1: {
			side.push("<table class=\"styled-table\"><thead><tr><th>Type</th><th>Cost</th><th>Item</th><th>Exp</th><th>Coins</th><th>Main</th><th>Flex</th><th>Donuts</th></tr></thead>");
			const w = Workout.All;
			for(let i = 0; i < w.length; i++) {
				side.push(`<tbody><tr>
				<th>${w[i].StatType}</th>
				<th align="right">${w[i].Cost}</th>
				<th>${w[i].RewardsPerCost.Item}</th>
				<th>${w[i].RewardsPerCost.Exp}</th>
				<th>${w[i].RewardsPerCost.Coins}</th>
				<th>${w[i].RewardsPerCost.MainStats}</th>
				<th>${w[i].RewardsPerCost.FlexStats}</th>
				<th>${w[i].RewardsPerCost.Donuts}</th>
				</tr></tbody>`);
			}
			break;
		}
	}
	side.push("</table></div>");
	} catch (ex) { 
		console.log(ex)
	}
	console.log(contentBox);
	console.log(side);
	if(contentBox != null) {
		contentBox.innerHTML = side.join('');
	}
}
self.addEventListener("click", () => {
	console.log("clicking mainpage")
	sectionIndx++;
	if(sectionIndx >= sections.length) sectionIndx = 0;
	updateSidePage();
});
self.addEventListener()
const updateSidePageEvent = () => updateSidePage();
addEventListener('storageUpdate', updateSidePageEvent);
addEventListener('missionUpdate', Mission.UnboxAll);
addEventListener('workoutUpdate', Workout.UnboxAll);
updateSidePage();