export default class Stats {
    constructor(
    public Strength: number,
    public Stamina: number,
    public Brains: number,
    public Intuition: number
    ) {}

    public Subtract(other: Stats): Stats {
        return new Stats(this.Strength - other.Strength, this.Stamina - other.Stamina, this.Brains - other.Brains, this.Intuition - other.Intuition);
    }
}