// deno-lint-ignore-file no-explicit-any
// @deno-types="../../../../../node_modules/@types/webextension-polyfill/index.d.ts"
import browser from "../../../../../node_modules/webextension-polyfill/dist/browser-polyfill.js"
import Rewards from "./Rewards.ts";
import Character from "./Character.ts";

export default class Mission {
	public static All: Mission[];
	public static LastUpdate = 0;
	ID: number;
	Name: string;
	Cost: number;
	Duration: number;
	Rewards: Rewards;
	RewardsPerCost: Rewards;	
	Zone: number;
	Position: number;

	constructor(quest : any, pos: number) {
		this.ID = quest.id;
		this.Name = quest.identifier;
		this.Cost = quest.energy_cost;
		this.Duration = quest.duration;
		this.Rewards = Rewards.Of(quest.rewards);
		this.RewardsPerCost = this.Rewards.divBy(this.Cost);
		this.Zone = quest.stage;
		this.Position = pos;
		//this.isWeekly = quest.rewards.herobook_item_rare == undefined ? false : true;
	}
	public static async UnboxAll() {
		console.log("Unboxing Missions");
		const data = (await browser.storage.local.get("missions")).missions;
		console.log(data);
		if(data == null) return;
		Mission.All = data;
	}
	public static async StoreAll(missions: any) {
		//fixing their cringe json
		for(let i = 0; i < missions.length; i++) {
			missions[i].rewards = JSON.parse(missions[i].rewards.split('\\').join(''));
		}
		Mission.LastUpdate = Math.round(Date.now() / 1000);
		Mission.All = new Array<Mission>(missions.length);
		for(let i = 0; i < missions.length; i++) {
			Mission.All[i] = new Mission(missions[i], i%3);
			if(Mission.All[i].Zone == 0) {
				for(let zone = 1; zone < Character.Mission.Pool.length+1; zone++) {
					Character.Mission.Pool[zone].forEach(id => {
						if(id == Mission.All[i].ID) {
							Mission.All[i].Zone = zone;
							zone = Character.Mission.Pool.length+1;
						}
					});
				}
			}
		}
		
		Mission.All = Mission.All.sort((a: Mission, b : Mission) => b.RewardsPerCost.Coins - a.RewardsPerCost.Coins);
		browser.storage.local.set( {"missions" : Mission.All});
		await browser.storage.local.set({ "latestUpdate" : Mission.LastUpdate.toString()});
	}
}