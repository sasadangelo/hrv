// Funzione per calcolare la media di un array
function mean(arr) {
    return arr.reduce((a, b) => a + b, 0) / arr.length;
}

// Funzione per calcolare la deviazione standard di un array
function standardDeviation(arr) {
    const avg = mean(arr);
    const squareDiffs = arr.map(value => Math.pow(value - avg, 2));
    const avgSquareDiff = mean(squareDiffs);
    return Math.sqrt(avgSquareDiff);
}

// Funzione per calcolare la media mobile
function movingAverage(arr, windowSize) {
    return arr.map((val, idx, array) => {
        if (idx < windowSize - 1) return null;
        const window = array.slice(idx - windowSize + 1, idx + 1);
        return mean(window);
    });
}

// Funzione per calcolare la deviazione standard mobile
function movingStandardDeviation(arr, windowSize) {
    return arr.map((val, idx, array) => {
        if (idx < windowSize - 1) return null;
        const window = array.slice(idx - windowSize + 1, idx + 1);
        return standardDeviation(window);
    });
}

let allData = [];

// Funzione per leggere il CSV
Papa.parse('hrv_data.csv', {
    download: true,
    header: true,
    complete: function(results) {
        allData = results.data;
        setDefaultDates();
        processData();
    }
});

function setDefaultDates() {
    console.log("1111111")
    const today = new Date().toISOString().split('T')[0];
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 30);
    const defaultStartDate = pastDate.toISOString().split('T')[0];

    document.getElementById('startDate').value = defaultStartDate;
    document.getElementById('endDate').value = today;
}

// Funzione per filtrare i dati in base all'intervallo di date
function filterDataByDateRange(data, startDate, endDate) {
    return data.filter(row => {
        const date = new Date(row.date);
        return date >= new Date(startDate) && date <= new Date(endDate);
    });
}

function processData() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    const filteredData = filterDataByDateRange(allData, startDate, endDate);

    const dates = filteredData.map(row => row.date);
    const rmssdValues = filteredData.map(row => parseFloat(row.rmssd));
    const lnRmssdValues = rmssdValues.map(value => Math.log(value));

    const movingAvg7 = movingAverage(lnRmssdValues, 7);
    const movingAvg30 = movingAverage(lnRmssdValues, 30);
    const movingStdDev30 = movingStandardDeviation(lnRmssdValues, 30);

    const upperLimits = movingAvg30.map((avg, index) => {
        const stdDev = movingStdDev30[index];
        return avg !== null && stdDev !== null ? avg + (stdDev / 2) : null;
    });

    const lowerLimits = movingAvg30.map((avg, index) => {
        const stdDev = movingStdDev30[index];
        return avg !== null && stdDev !== null ? avg - (stdDev / 2) : null;
    });

    const currentValue = lnRmssdValues[lnRmssdValues.length - 1];
    const avg7Day = movingAvg7[movingAvg7.length - 1];
    const upperLimit = upperLimits[upperLimits.length - 1];
    const lowerLimit = lowerLimits[lowerLimits.length - 1];

    document.getElementById('currentValue').textContent = currentValue ? currentValue.toFixed(2) : 'N/A';
    document.getElementById('avg7Day').textContent = avg7Day ? avg7Day.toFixed(2) : 'N/A';
    document.getElementById('upperLimit').textContent = upperLimit ? upperLimit.toFixed(2) : 'N/A';
    document.getElementById('lowerLimit').textContent = lowerLimit ? lowerLimit.toFixed(2) : 'N/A';

    createChart(dates, lnRmssdValues, upperLimits, lowerLimits);
}

let chart;

// Funzione per creare il grafico
function createChart(dates, lnRmssdValues, upperLimits, lowerLimits) {
    const ctx = document.getElementById('hrvChart').getContext('2d');

    const backgroundColors = lnRmssdValues.map((value, index) => {
        const upperLimit = upperLimits[index];
        const lowerLimit = lowerLimits[index];
        if (value !== null && upperLimit !== null && lowerLimit !== null) {
            if (value > upperLimit) {
                return 'green';
            } else if (value < lowerLimit) {
                return 'red';
            } else {
                return 'yellow';
            }
        } else {
            return 'gray'; // Per valori iniziali dove la media mobile non è calcolabile
        }
    });

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dates,
            datasets: [{
                label: 'LN(RMSSD)',
                data: lnRmssdValues,
                backgroundColor: backgroundColors
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Funzione per aggiornare il grafico
function updateChart() {
    processData();
}
