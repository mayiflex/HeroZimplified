// deno-lint-ignore-file no-explicit-any
import Rewards from "./Rewards.ts";

export default class Workout {
	public static All: Workout[];
	public static LastUpdate: number;

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

	public static UnboxAll() {
		const data = localStorage.getItem("workouts")
		if(data == null) return;
		Workout.All = JSON.parse(data);
		console.log("Unboxing")
		console.log(Workout.All)
	}
	public static StoreAll(workouts: any) {
		//fixing their cringe json
		for(let i = 0; i < workouts.length; i++) {
			workouts[i].rewards_star_1 = JSON.parse(workouts[i].rewards_star_1.split('\\').join(''))
			workouts[i].rewards_star_2 = JSON.parse(workouts[i].rewards_star_2.split('\\').join(''))
			workouts[i].rewards_star_3 = JSON.parse(workouts[i].rewards_star_3.split('\\').join(''))
		}
		
		const uxEpoch = Math.round(Date.now() / 1000);
		const Ws = new Array<Workout>(workouts.length)
		for(let i = 0; i < workouts.length; i++) {
			Ws[i] = new Workout(workouts[i]);
		}
		Ws.sort((a: Workout, b: Workout) => (b.RewardsPerCost.MainStats + b.RewardsPerCost.FlexStats) - (a.RewardsPerCost.MainStats + a.RewardsPerCost.FlexStats));
		localStorage.setItem("workouts", JSON.stringify(Workout.All))
		dispatchEvent(new Event("workoutUpdate"));
		localStorage.setItem("latestUpdate", uxEpoch.toString());
		dispatchEvent(new Event("storageUpdate"));
		console.log(Ws)
	}
}

/*switch(train.stat_type) {
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
*/