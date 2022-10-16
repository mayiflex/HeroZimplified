let storeable = {}
class TrainInfo {
	constructor(train) {
		let r1 = Reward.fromTrain(train.rewards_star_1, train.stat_points_star_1);
		let r2 = Reward.fromTrain(train.rewards_star_2, train.stat_points_star_2);
		let r3 = Reward.fromTrain(train.rewards_star_3, train.stat_points_star_3);
		this.cost = train.training_cost;
		this.rewards = r1.combine(r2).combine(r3);
		this.rewardsPerCost = this.rewards.divBy(this.cost);
		this.duration = train.duration;
		this.statType = "";
		switch(train.stat_type) {
			case 1:
				this.statType = "Kondition";
				break;
			case 2:
				this.statType = "Kraft";
				break;
			case 3:
				this.statType = "Grips";
				break;
			case 4:
				this.statType = "Intuition";
			default:
				break;
		}
	}
}
class QuestInfo {
	constructor(quest, number) {
		this.cost = quest.energy_cost;
		this.rewards = Reward.fromQuest(quest.rewards);
		this.rewardsPerCost = this.rewards.divBy(this.cost);
		this.duration = quest.duration;
		this.number = number;
		this.isWeekly = quest.rewards.herobook_item_rare == undefined ? false : true;
		switch(quest.stage) {
			case 1:
				this.stage = "Zuh. in Humphreydale";
				break;
			case 2:
				this.stage = "Dreckige Innenstadt";
				break;
			case 3:
				this.stage = "Zent. von Granbury";
				break;
			case 4:
				this.stage = "State Capitol";
				break;
			case 5:
				this.stage = "Schweiz";
				break;
			case 6:
				this.stage = "Der Big Crumble";
				break;
			case 7:
				this.stage = "Yoyo-Insel";
				break;
			case 8:
				this.stage = "Gamble City";
				break;
			case 9:
				this.stage = "Sillycon Valley";
				break;
			case 10:
				this.stage = "Paris";
				break;
			case 11:
				this.stage = "Yollywood";
				break;
			case 12:
				this.stage = "Australien";
				break;
			default:
				this.stage = "";
				break;
		}
	}
}
class Reward {
	
	constructor(coins, honor, item, premium, flexStats, exp, mainStats) {
		this.coins = coins;
		this.honor = honor;
		this.item = item;
		this.premium = premium;
		this.flexStats = flexStats;
		this.exp = exp;
		this.mainStats = mainStats;
	}
	
	static fromQuest(rewards) {
		return new Reward(rewards.coins, rewards.honor, rewards.item == 0 ? false : true, rewards.premium, rewards.statPoints, rewards.xp, 0)
	}
	static fromTrain(rewards, mainStats) {
		return new Reward(rewards.coins, rewards.honor, rewards.item == 0 ? false : true, rewards.premium, rewards.statPoints, rewards.xp, mainStats)
	}
	
	combine(other) {
		return new Reward(this.coins + other.coins, this.honor + other.honor, 
						  (this.item || other.item), this.premium + other.premium, 
						  this.flexStats + other.flexStats, this.exp + other.exp, this.mainStats + other.mainStats);
	}
	divBy(div) {
		return new Reward(parseFloat((this.coins/div).toFixed(2)), parseFloat((this.honor/div).toFixed(2)), this.item, parseFloat((this.premium/div).toFixed(2)), parseFloat((this.flexStats/div).toFixed(2)), parseFloat((this.exp/div).toFixed(2)), parseFloat((this.mainStats/div)).toFixed(2))
	}
}
//stores given key under value, unix time epoch under key+"_ts" and the "latestUpdate" timestamp
function store(key, value) {
	storeable[key] = value;
	let uxTimeEpoch = Math.round(Date.now() / 1000);
	storeable[key+"_ts"] = uxTimeEpoch;
	storeable["latestUpdate"] = uxTimeEpoch;
	console.log(storeable);
	browser.storage.local.set(storeable);
}
function handleQuestData(quests) {
	//fixing their cringe json
	for(let i = 0; i < quests.length; i++) {
		quests[i].rewards = JSON.parse(quests[i].rewards.split('\\').join(''))
	}
	let Qs = Array.apply(null, Array(quests.length)).map(function () {})
	for(let i = 0; i < Qs.length; i++) {
		Qs[i] = new QuestInfo(quests[i], i%3+1);
	}
	Qs.sort((a, b) => b.rewardsPerCost.exp - a.rewardsPerCost.exp);
	store("Missions", Qs);
}
function handleTrainData(trains) {
	//fixing their cringe json
	for(let i = 0; i < trains.length; i++) {
		trains[i].rewards_star_1 = JSON.parse(trains[i].rewards_star_1.split('\\').join(''))
		trains[i].rewards_star_2 = JSON.parse(trains[i].rewards_star_2.split('\\').join(''))
		trains[i].rewards_star_3 = JSON.parse(trains[i].rewards_star_3.split('\\').join(''))
	}
	
	let Ts = Array.apply(null, Array(trains.length)).map(function () {})
	for(let i = 0; i < trains.length; i++) {
		Ts[i] = new TrainInfo(trains[i]);
	}
	Ts.sort((a, b) => b.rewardsPerCost.flexStats - a.rewardsPerCost.flexStats);
	store("Trainings", Ts);
}

function requestListener(details) {
	let filter = browser.webRequest.filterResponseData(details.requestId);
	let decoder = new TextDecoder("utf-8");
	let encoder = new TextEncoder();
	let response = "";
	
	filter.ondata = (event) => {
		let str = decoder.decode(event.data, {stream: true});
		response = response + str;
		filter.write(event.data);
	}
	
	filter.onstop = (event) => {
		try {
			let hzdata = JSON.parse(response);
			console.log(hzdata);
			if(hzdata.data.quests != null) {
				handleQuestData(hzdata.data.quests);
			}
			if(hzdata.data.trainings != null) {
				handleTrainData(hzdata.data.trainings);
			}
		} catch (ex) { }
		filter.disconnect();
	}
	return {};
}
function pageActionVisibility() {
	browser.tabs.query({active: true}).then((tabs) => {
		try {
		if(tabs[0].url.includes(".herozerogame.com")) browser.pageAction.show(tabs[0].id);
		else browser.pageAction.hide(tabs[0].id);
		} catch (ex) { }
	});
}
browser.tabs.onActivated.addListener(pageActionVisibility);
browser.tabs.onUpdated.addListener(pageActionVisibility);
browser.webRequest.onBeforeRequest.addListener(
	requestListener,
	{urls: ["https://*.herozerogame.com/request.php"], types: ["xmlhttprequest"]},
	["blocking"]
);
browser.pageAction.onClicked.addListener(() => {
	browser.sidebarAction.toggle()
});



