const contentBox = document.querySelector("#flex");
const sections = ["Missions", "Trainings"]
let sectionIndx = 0;
let lastUpdate = 0;
let hasContent = false;

async function getLastChangedSectionIndexIfUpdated() {
	let latestUpdate = (await browser.storage.local.get("latestUpdate")).latestUpdate
	if(latestUpdate <= lastUpdate) {
		return sectionIndx;
	}
	for(let i = 0; i < sections.length; i++) {
		sectionTS = await browser.storage.local.get(sections[i] + "_ts");
		switch(i) {
			//sections[0] = "Missions"
			case 0:
				sectionTS = sectionTS.Missions_ts
				break;
			case 1:
				sectionTS = sectionTS.Trainings_ts
				break;
			default:
				sectionTS = 0;
				break;
		}
		if(sectionTS > lastUpdate) {
			return i;
		}
	}
	return sectionIndx;
}

async function updateSidePage() {
	sectionIndx = await getLastChangedSectionIndexIfUpdated();
	try {
		let latestUpdate = (await browser.storage.local.get("latestUpdate")).latestUpdate;
		lastUpdate = latestUpdate > lastUpdate ? latestUpdate : lastUpdate;
	} catch (ex) {}
	let section = sections[sectionIndx];
	let side =  "";
	let data = await browser.storage.local.get(sections[sectionIndx]);
	try {
	switch(section) {
		case "Missions":
			side += `<table class="styled-table"><thead><tr><th align="right">Zone</th><th>#</th><th>Energycost</th><th>Item</th><th>Exp</th><th>Coins</th><th>⠀</th></tr></thead>`
			let m = data.Missions;
			for(let i = 0; i < m.length; i++) {
				side += `<tbody><tr>
				<th align="right">${m[i].stage}</th>
				<th>${m[i].number}</th>
				<th align="right">${m[i].cost}</th>
				<th>${m[i].rewardsPerCost.item}</th>
				<th>${m[i].rewardsPerCost.exp}</th>
				<th>${m[i].rewardsPerCost.coins}</th>
				</tr></tbody>`;
			}
			break;
		case "Trainings":
			side += "<table class=\"styled-table\"><thead><tr><th>Type</th><th>Cost</th><th>Item</th><th>Exp</th><th>Coins</th><th>Main</th><th>Flex</th><th>Donuts</th><th>⠀⠀</th></tr></thead>"
			let t = data.Trainings;
			for(let i = 0; i < t.length; i++) {
				side += `<tbody><tr>
				<th>${t[i].statType}</th>
				<th align="right">${t[i].cost}</th>
				<th>${t[i].rewardsPerCost.item}</th>
				<th>${t[i].rewardsPerCost.exp}</th>
				<th>${t[i].rewardsPerCost.coins}</th>
				<th>${t[i].rewardsPerCost.mainStats}</th>
				<th>${t[i].rewardsPerCost.flexStats}</th>
				<th>${t[i].rewardsPerCost.premium}</th>
				</tr></tbody>`;
			}
			break;
	}
	side += "</table></div>"
	} catch (ex) { }
	contentBox.innerHTML = side;
	contentBox.id = "noflex";
}
window.addEventListener("click", () => {
	sectionIndx++;
	if(sectionIndx >= sections.length) sectionIndx = 0;
	updateSidePage();
});


/*
When the sidebar loads, get the ID of its window,
and update its content.
*/
browser.windows.getCurrent({populate: true}).then((windowInfo) => {
  myWindowId = windowInfo.id;
}); 
browser.storage.local.onChanged.addListener(updateSidePage);