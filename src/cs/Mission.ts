// deno-lint-ignore-file no-explicit-any
import Rewards from "./Rewards.ts";

export default class Mission {
	public static All: Mission[];
	public static LastUpdate: number;
	ID: number;
	Name: string;
	Cost: number;
	Duration: number;
	Rewards: Rewards;
	RewardsPerCost: Rewards;	
	Location: number;
	Position: number;

	constructor(quest : any, pos: number) {
		this.ID = quest.id;
		this.Name = quest.identifier;
		this.Cost = quest.energy_cost;
		this.Duration = quest.duration;
		this.Rewards = Rewards.Of(quest.rewards);
		this.RewardsPerCost = this.Rewards.divBy(this.Cost);
		this.Location = quest.stage;
		this.Position = pos;
		//this.isWeekly = quest.rewards.herobook_item_rare == undefined ? false : true;
	}
	public static UnboxAll() {
		const data = localStorage.getItem("missions")
		if(data == null) return;
		Mission.All = JSON.parse(data);
		console.log("Unboxing")
		console.log(Mission.All)
	}
	public static StoreAll(missions: any) {
		//fixing their cringe json
		for(let i = 0; i < missions.length; i++) {
			missions[i].rewards = JSON.parse(missions[i].rewards.split('\\').join(''))
		}
		const uxEpoch = Math.round(Date.now() / 1000);
		const Ms = new Array<Mission>(missions.length)
		for(let i = 0; i < missions.length; i++) {
			Ms[i] = new Mission(missions[i], i%3+1);
		}
		Ms.sort((a: Mission, b : Mission) => b.RewardsPerCost.Coins - a.RewardsPerCost.Coins);
		localStorage.setItem("missions", JSON.stringify(Mission.All))
		dispatchEvent(new Event("missionUpdate"));
		localStorage.setItem("latestUpdate", uxEpoch.toString());
		dispatchEvent(new Event("storageUpdate"));
		console.log(Ms);
	}
}