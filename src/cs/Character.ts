// deno-lint-ignore-file no-unused-vars no-explicit-any
import Stats from "./Stats.ts";
class StatsInfo {
    TotalCount: number | undefined;
    Base: Stats | undefined;
    Bought: Stats | undefined;
    Trained: Stats | undefined;
    Gear: Stats | undefined;
    Total: Stats | undefined;
    private constructor() { }
    
    public SetIfDefined(TotalCount: number | undefined, Base: Stats | undefined, Bought: Stats | undefined, Trained: Stats | undefined, Total: Stats | undefined) {
        if(TotalCount != undefined) this.TotalCount = TotalCount;
        if(Base != undefined) this.Base = Base;
        if(Bought != undefined) this.Bought = Bought;
        if(Trained != undefined) this.Trained = Trained;
        if(Trained != undefined) this.Total = Total;
        if(this.Total != undefined && this.Base != undefined) this.Gear = this.Total.Subtract(this.Base);
    }

    public static CreateEmpty(): StatsInfo {
        return new StatsInfo();
    }
}

export default class Character {
    static ID: number;
    static Name: number;
    //Description: string;
    static Donuts: number;
    static Coins: number;
    static Level: number;
    static Locale: string;
    static Stats: StatsInfo = StatsInfo.CreateEmpty();
    static Mission: MissionInfo;
    static Workout: WorkoutInfo;
    static Duel: DuelInfo;
    static League: LeagueInfo;

    
    static SetAll(char: any, donuts: number) {
        if(donuts != undefined) this.Donuts = donuts;
        if(char.id != undefined) this.ID = char.id;
        if(char.name != undefined) this.Name = char.name;
        //this.Description = char.description;
        if(char.game_currency != undefined) this.Coins = char.game_currency;
        if(char.level != undefined) this.Level = char.level;
        if(char.locale != undefined) this.Locale = char.locale;

        let base: Stats | undefined = undefined;
        let bought: Stats | undefined = undefined;
        let trained: Stats | undefined = undefined;
        let total: Stats | undefined = undefined;
        try { base = new Stats(char.stat_base_strength, char.stat_base_stamina, char.stat_base_critical_rating, char.stat_base_dodge_rating); } catch { /*nothing*/ } 
        try { bought = new Stats(char.stat_bought_strength, char.stat_bought_stamina, char.stat_bought_critical_rating, char.stat_bought_dodge_rating); } catch { /*nothing*/ } 
        try { trained = new Stats(char.stat_trained_strength, char.stat_trained_stamina, char.stat_trained_critical_rating, char.stat_trained_dodge_rating); } catch { /*nothing*/ } 
        try { total = new Stats(char.stat_total_strength, char.stat_total_stamina, char.stat_total_critical_rating, char.stat_total_dodge_rating); } catch { /*nothing*/ } 
        this.Stats.SetIfDefined(char.stat_total, base, bought, trained, total); 
    
        //fixing cringe json once again
        try { this.Mission = new MissionInfo(char.quest_energy, char.max_quest_energy, 200 - char.quest_energy_refill_amount_today, char.current_energy_storage,
            Object.values(JSON.parse(char.quest_pool.split('\\').join('')))); } catch { /*nothing*/ }
        try { this.Workout = new WorkoutInfo(char.training_count, char.max_training_count, char.current_training_storage, char.training_energy, char.max_training_energy, char.ts_last_training_energy_change, char.ts_last_training_finished)} catch { /*nothing*/ }
        try { this.Duel = new DuelInfo(char.honor, char.duel_stamina, char.max_duel_stamina, char.duel_stamina_cost, char.ts_last_duel_stamina_change) } catch { /*nothing*/ }
        try { this.League = new LeagueInfo(char.league_points, char.league_fight_count, char.league_stamina, char.max_league_stamina, char.ts_last_league_stamina_change); } catch { /*nothing*/ }
    }
}

export class MissionInfo {
    constructor(
        public Energy: number,
        public EnergyMax: number,
        public EnergyRefillable: number,
        public EnergyStorage: number,
        public Pool: number[][]
    ) {}
}
export class WorkoutInfo {
    constructor(
        Motivation: number,
        MotivationMax: number,
        MotivationStorage: number,
        Energy: number,
        EnergyMax: number,
        LastEnergyIncrease: number,
        LastWorkoutCompleted: number
    ) {}
}
export class LeagueInfo {
    constructor(
        LeaguePoints: number,
        LeagueFightsToday: number,
        Adrenalin: number,
        AdrenalinMax: number,
        LastAdrenalinChange: number
    ) {}
}
export class DuelInfo {
    constructor(
        Honor: number,
        Courage: number,
        CourageMax: number,
        CourageCost: number,
        LastCourageChange: number
    ) {}
}