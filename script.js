import './data-utils.js';
import './data.js';
import './hrv-chart.js';
import { HRVApp } from './hrv-app.js';
import './fcr-chart.js';
import { FCRApp } from './fcr-app.js';

document.addEventListener('DOMContentLoaded', () => {
    window.app = new HRVApp();
    window.fcrApp = new FCRApp();
});
