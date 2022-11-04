// @deno-types="../../../../../node_modules/@types/webextension-polyfill/index.d.ts"
import browser from "../../../../../node_modules/webextension-polyfill/dist/browser-polyfill.js"
import { Section }  from "../enums/Section.ts";
import { IdentifierSet } from "../enums/IdentifierSet.ts";


export default class Settings {
    constructor(
        public Language: string,
        public DoesItemIncreaseCoins: boolean,
        public IdentifierSet: string[],
        public OrderByColum: Record<Section, number>,
        public CustomColums: Record<Section, CustomColum | undefined>
    ) { }
    
    public static Of(Language: string) {
        const orderByColum: Record<Section, number> = {
            [Section.Missions] : 0,
            [Section.Workouts] : 0
        };
        const customColums: Record<Section, undefined> = {
            [Section.Missions] : undefined,
            [Section.Workouts] : undefined
        }
        return new Settings(Language, true, JSON.parse(IdentifierSet.CircledNumbers), orderByColum, customColums)
    }


    public static async Load(): Promise<Settings> {
        const settings = (await browser.storage.local.get("settings")).settings;
        if(settings == undefined) return Settings.Of("de"); 
        return settings;
    }

    public static async Save() {
        await browser.storage.local.set({"settings" : this })
    }
}


class CustomColum {
    constructor(
        Name: string
    ) {}
}