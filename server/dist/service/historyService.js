// City class with name and id properties
class City {
    constructor(name) {
        this.name = name,
            this.id = uuidv4();
    }
}
// HistoryService class
class HistoryService {
    constructor() {
    }
    // reads from the searchHistory.json file
    // private async read() {}
    async read() {
        const history = await fstat.readFile(`db/searchHistory.json`, 'utf8');
        return history;
    }
    // writes the updated cities array to the searchHistory.json file
    // private async write(cities: City[]) {}
    async write(cities) {
        await fs.writeFile(`db/searchHistory.json`, JSON.stringify(cities));
        return;
    }
    // getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
    // async getCities() {}
    async getCities() {
        try {
            const history = await JSON.parse(await this.read());
            return history;
        }
        catch (error) {
            console.error(`there was an error reading the json`);
            const history = [];
            return history;
        }
    }
    // addCity method that adds a city to the searchHistory.json file
    // async addCity(city: string) {}
    async addCity(city) {
        const cities = await this.getCities();
        const index = cities.findIndex((cities) => cities.name.toLowerCase() === city.toLowerCase());
        if (index === -1) {
            const newCity = new City(city);
            cities.push(newCity);
            this.write(cities);
        }
        return;
    }
    // * BONUS / removeCity method that removes a city from the searchHistory.json file
    // async removeCity(id: string) {}
    async removeCity(id) {
        const cities = await this.getCities();
        const index = cities.findIndex((city) => city.id === id);
        if (index !== -1) {
            cities.splice(index, 1);
        }
        console.log(`city deleted`);
        await this.write(cities);
        return;
    }
}
// Export an instance of HistoryService
export default new HistoryService();
