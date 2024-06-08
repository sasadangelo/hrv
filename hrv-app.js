import { HRVChart } from './hrv-chart.js';
import { HRVData } from './hrv-data.js';
import { HRVUtils } from './hrv-utils.js';

export class HRVApp {
    constructor() {
        this.allData = [];
        this.chart = new HRVChart(document.getElementById('hrvChart').getContext('2d'));

        Papa.parse('https://raw.githubusercontent.com/sasadangelo/hrv/main/hrv_data.csv', {
            download: true,
            header: true,
            complete: results => {
                this.allData = new HRVData(results.data);
                this.setDefaultDates();
                this.processData();
            }
        });

        document.getElementById('startDate').addEventListener('change', () => this.processData());
        document.getElementById('endDate').addEventListener('change', () => this.processData());
    }

    setDefaultDates() {
        const today = new Date().toISOString().split('T')[0];
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 30);
        const defaultStartDate = pastDate.toISOString().split('T')[0];

        document.getElementById('startDate').value = defaultStartDate;
        document.getElementById('endDate').value = today;
    }

    processData() {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;

        const filteredData = this.allData.filterByDateRange(startDate, endDate);
        const dates = filteredData.map(row => row.date);
        const rmssdValues = filteredData.map(row => parseFloat(row.rmssd));

        const utils = new HRVUtils(rmssdValues);
        const movingAvg7 = utils.movingAverage(7);
        const movingAvg30 = utils.movingAverage(30);
        const movingStdDev30 = utils.movingStandardDeviation(30);

        const upperLimits = movingAvg30.map((avg, index) => {
            const stdDev = movingStdDev30[index];
            return avg !== null && stdDev !== null ? avg + stdDev : null;
        });

        const lowerLimits = movingAvg30.map((avg, index) => {
            const stdDev = movingStdDev30[index];
            return avg !== null && stdDev !== null ? avg - stdDev : null;
        });

        this.chart.createChart(dates, rmssdValues, upperLimits, lowerLimits, movingAvg7);
    }

    updateChart() {
        this.processData();
    }
}
