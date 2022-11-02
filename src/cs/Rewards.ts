// deno-lint-ignore-file no-explicit-any
import Item from "./Item.ts"

export default class Rewards {
	constructor (
	public Donuts: number,
	public Coins: number,
	public Exp: number,
	public MainStats: number,
	public FlexStats: number,
	public Honor: number,
	public Item: Item | null,
	) {}
	
	public static Of(rewards: any): Rewards;
	public static Of(rewards: any, mainStats: number): Rewards;
	public static Of(rewards: any, mainStats?: number): Rewards {
		//add item sell value to Coins
		return new Rewards(rewards.premium, rewards.coins, rewards.xp, mainStats != null ? mainStats : 0, rewards.statPoints, rewards.honor, Item.GetItemByID(rewards.item))
	}
	
	combine(other: Rewards) {
		return new Rewards(this.Donuts + other.Donuts, this.Coins + other.Coins, this.Exp + other.Exp, this.MainStats + other.MainStats, this.FlexStats + other.FlexStats, this.Honor + other.Honor, 
						   this.Item != null ? this.Item : other.Item);
	}
	divBy(div: number) {
		return new Rewards(this.Donuts/div, this.Coins/div, this.Exp/div, this.MainStats/div, this.FlexStats/div, this.Honor/div, this.Item)
	}
}