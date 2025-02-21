import { Router } from 'express';
import historyService from '../../service/historyService';
const router = Router();
import HistoryService from '../../service/historyService.js'; // TO DO UNCOMMENT
import WeatherService from '../../service/weatherService.js'; // TO DO UNCOMMENT
// POST Request with city name to retrieve weather data
router.post('/', (req, res) => {
    const city = req.body.cityName;
    // GET weather data from city name
    const weather = new WeatherService(city);
    res.send(await weather.getWeatherForCity());
    // save city to search history
    historyService.addCity(city);
    res.json({ message: 'City added to search history' });
});
// TODO: GET search history
router.get('/history', async (req, res) => {
    const cities = await historyService.getCities();
    res.send(cities);
});
// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
    HistoryService.removeCity(req.params.id);
    res.send(`search deleted`);
});
export default router;
