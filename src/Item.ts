// deno-lint-ignore-file no-explicit-any
export default class Item {
    public static All: Item[];
    
    constructor(
    public ID: number,
    public Name: string,
    public Type: number,
    public Quality: number,
    public SellValue: number,
    public Stats: Stats,
    public Damage: number,
    public ItemLevel: number
    ) {}

    public static GetItemByID(id: number): Item | null {
        if(id == 0) return null;
        Item.All.forEach(item => {
            if(item.ID == id) return item;
        });
        return null;
    }
    public static SetAll(items: any) {
        Item.All = new Array<Item>(items.length)
        for(let i = 0; i < items.length; i++) {
            Item.All[i] = new Item(items[i].id, items[i].identifier, items[i].type, items[i].quality, items[i].sell_price, 
                new Stats(items[i].stat_strength, items[i].stat_stamina, items[i].stat_critical_rating, items[i].stat_dodge_rating),
                items[i].stat_weapon_damage, items[i].item_level);
        }
    }
}

export class Stats {
    constructor(
    public Strength: number,
    public Stamina: number,
    public Brains: number,
    public Intuition: number
    ) {}
}