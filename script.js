import './hrv-utils.js';
import './hrv-data.js';
import './hrv-chart.js';
import { HRVApp } from './hrv-app.js';

document.addEventListener('DOMContentLoaded', () => {
    window.app = new HRVApp();
});
