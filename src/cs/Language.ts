// deno-lint-ignore-file no-explicit-any
import { Section } from "../enums/Section.ts";
import { EnglishZones, EnglishSkilltypes } from "../enums/Languages/English.ts";
import { GermanZones, GermanSkilltypes } from "../enums/Languages/German.ts";


export default class Language {
    private language: Languages;
    private text: Record<Section, any>;
    
    constructor(Language: string) {
        //default
        this.language = Languages.en;
        this.text = {
            [Section.Missions] : EnglishZones,
            [Section.Workouts] : EnglishSkilltypes
        }
        //actual setting
        this.SetLanguage(Language);
    }

    get Language(): Languages {
        return this.language;
    }
    private set Language(Language: Languages) {
        this.language = Language;
        switch(this.language) {
            case Languages.de: {
                this.text = {
                    [Section.Missions] : GermanZones,
                    [Section.Workouts] : GermanSkilltypes
                }
                break;
            }
            default: {
                this.text = {
                    [Section.Missions] : EnglishZones,
                    [Section.Workouts] : EnglishSkilltypes
                }
                break;
            }
        }
    }
    get Text() {
        return this.text;
    }
    private set Text(text: any) {
        this.text = text;
    }

    SetLanguage(lang: string) {
        switch(lang) {
            case "de":
                this.Language = Languages.de;
                return;
            default:
                this.Language = Languages.en;
                return;
        }
    }
}


enum Languages {
    "en" = 0,
    "de" = 1
}