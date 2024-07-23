// Funcion para ejecutar las tareas programadas
import { scrapeJobsUtp } from './src/scraper/utpjobs/utp-jobs.js';
import { scrapeJobsLinkedin } from './src/scraper/linkedin/linkedin.js';

scrapeJobsUtp();
scrapeJobsLinkedin()