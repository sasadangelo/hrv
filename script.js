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
Papa.parse('https://raw.githubusercontent.com/sasadangelo/hrv/main/hrv_data.csv', {
    download: true,
    header: true,
    complete: function(results) {
        allData = results.data;
        setDefaultDates();
        processData();
    }
});

function setDefaultDates() {
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
    console.log("RMSSD: ", rmssdValues)
    const lnRmssdValues = rmssdValues.map(value => Math.log(value));
    console.log("ln(RMSSD): ", lnRmssdValues)

    const movingAvg7 = movingAverage(lnRmssdValues, 7);
    const movingAvg30 = movingAverage(lnRmssdValues, 30);
    const movingStdDev30 = movingStandardDeviation(lnRmssdValues, 30);
    console.log("Media mobile 7gg: ", movingAvg7)
    console.log("Media mobile 30gg: ", movingAvg30)
    console.log("Dev Standard 30gg: ", movingStdDev30)

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

    createChart(dates, lnRmssdValues, upperLimits, lowerLimits, movingAvg7);
}

let chart;

// Funzione per creare il grafico
function createChart(dates, lnRmssdValues, upperLimits, lowerLimits, movingAvg7) {
    const ctx = document.getElementById('hrvChart').getContext('2d');

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [
                {
                    label: 'LN(RMSSD)',
                    data: lnRmssdValues,
                    borderColor: 'black',
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    borderWidth: 1
                },
                {
                    label: 'Upper Limit',
                    data: upperLimits,
                    borderColor: 'green',
                    borderWidth: 1,
                    fill: false
                },
                {
                    label: 'Lower Limit',
                    data: lowerLimits,
                    borderColor: 'red',
                    borderWidth: 1,
                    fill: false
                },
                {
                    label: '7-Day Moving Average',
                    data: movingAvg7,
                    borderColor: 'blue',
                    borderWidth: 1,
                    fill: false
                }
            ]
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
