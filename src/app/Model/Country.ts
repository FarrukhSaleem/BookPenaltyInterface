export class Country {
    public ID: Number;
    public Name: string;

    constructor(jsonData: any) {
        this.ID = jsonData.ID;
        this.Name = jsonData.Name;
    }
}