import './data-utils.js';
import './data.js';
import './pmc-chart.js';
import { PMCApp } from './pmc-app.js';
import './tss-chart.js';
import { TSSApp } from './tss-app.js';

document.addEventListener('DOMContentLoaded', () => {
    window.pmcApp = new PMCApp();
    window.tssApp = new TSSApp();
});
