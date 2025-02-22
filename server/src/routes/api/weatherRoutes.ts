import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService';
import WeatherService from '../../service/weatherService';

// POST Request with city name to retrieve weather data
router.post('/', (req: Request, res: Response) => {
  const city = req.body.cityName
  // GET weather data from city name
  new WeatherService('openweathermap.org', 'e0f2a8b6cdfb676ec11d04660c9d6835', city)
  // Save city to search history
  HistoryService.addCity(city)
  // Send weather data to client
  res.json({message: "City added to history"});
});

// GET search history
router.get('/history', async (req: Request, res: Response) => {
  const cities = await HistoryService.getCities()
  res.send(cities)
  console.log(req);
});

// * BONUS - DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  HistoryService.removeCity(req.params.id)
  res.send(`search deleted`)
});

// export router
export default router;
