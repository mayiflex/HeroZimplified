// deno-lint-ignore-file no-explicit-any
// @deno-types="../../../../../node_modules/@types/webextension-polyfill/index.d.ts"
import browser from "../../../../../node_modules/webextension-polyfill/dist/browser-polyfill.js"
import Rewards from "./Rewards.ts";

export default class Workout {
	public static All: Workout[];
	public static LastUpdate = 0;

	public StatType: number;
	public Cost: number;
	public Duration: number;
	public Rewards: Rewards;
	public RewardsPerCost: Rewards;

	constructor(train: any) {
		const r1 = Rewards.Of(train.rewards_star_1, train.stat_points_star_1);
		const r2 = Rewards.Of(train.rewards_star_2, train.stat_points_star_2);
		const r3 = Rewards.Of(train.rewards_star_3, train.stat_points_star_3);
		this.Cost = train.training_cost;
		this.Rewards = r1.combine(r2).combine(r3);
		this.RewardsPerCost = this.Rewards.divBy(this.Cost);
		this.Duration = train.duration;
		this.StatType = train.stat_type;
	}

	public static async UnboxAll() {
		console.log("Unboxing Workouts")
		const data = (await browser.storage.local.get("workouts")).workouts;
		console.log(data);
		if(data == null) return;
		Workout.All = data;
	}
	public static async StoreAll(workouts: any) {
		//fixing their cringe json
		for(let i = 0; i < workouts.length; i++) {
			workouts[i].rewards_star_1 = JSON.parse(workouts[i].rewards_star_1.split('\\').join(''))
			workouts[i].rewards_star_2 = JSON.parse(workouts[i].rewards_star_2.split('\\').join(''))
			workouts[i].rewards_star_3 = JSON.parse(workouts[i].rewards_star_3.split('\\').join(''))
		}
		
		const uxEpoch = Math.round(Date.now() / 1000);
		Workout.All = new Array<Workout>(workouts.length);
		for(let i = 0; i < workouts.length; i++) {
			Workout.All[i] = new Workout(workouts[i]);
		}
		Workout.All = Workout.All.sort((a: Workout, b: Workout) => (b.RewardsPerCost.MainStats + b.RewardsPerCost.FlexStats) - (a.RewardsPerCost.MainStats + a.RewardsPerCost.FlexStats));
		browser.storage.local.set( {"workouts" : Workout.All});
		await browser.storage.local.set( {"latestUpdate" : uxEpoch.toString() });
	}
}