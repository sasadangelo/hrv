import './data-utils.js';
import './data.js';
import './pmc-chart.js';
import { PMCApp } from './pmc-app.js';
import './tss-chart.js';
import { TSSApp } from './tss-app.js';
import './tss-weekly-chart.js';
import { TSSWeeklyApp } from './tss-weekly-app.js';
import './tl-chart.js';
import { TLApp } from './tl-app.js';
import './distance-weekly-chart.js';
import { DistanceWeeklyApp } from './distance-weekly-app.js';

document.addEventListener('DOMContentLoaded', () => {
    window.pmcApp = new PMCApp();
    window.tssApp = new TSSApp();
    window.tssWeeklyApp = new TSSWeeklyApp();
    window.tlApp = new TLApp();
    window.distanceWeeklyApp = new DistanceWeeklyApp();
});
