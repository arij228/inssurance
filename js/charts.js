// ==========================================================================
// Globatech — model page charts (Chart.js)
// Replace the sample data arrays with real notebook output when ready.
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  if (typeof Chart === 'undefined') return;

  Chart.defaults.color = '#A6AAAD';
  Chart.defaults.font.family = "'IBM Plex Mono', monospace";
  Chart.defaults.font.size = 10;

  const gridColor = 'rgba(236,236,234,0.06)';

  const regEl = document.getElementById('chartReg');
  if (regEl) {
    new Chart(regEl, {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: 'Predicted vs actual',
            data: [[1,1.2],[2,2.6],[2.5,2.3],[3,3.8],[4,3.6],[4.5,5.1],[5,4.7],[6,6.3],[6.5,6.0],[7,7.4],[8,7.9],[9,8.6]],
            backgroundColor: '#B7A98F',
            pointRadius: 4
          },
          {
            type: 'line',
            label: 'Ideal fit',
            data: [{x:1,y:1.1},{x:9,y:8.9}],
            borderColor: '#93A5AF',
            borderWidth: 1.5,
            pointRadius: 0,
            borderDash: [4,3]
          }
        ]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: gridColor }, title: { display: true, text: 'Actual (K TND)' } },
          y: { grid: { color: gridColor }, title: { display: true, text: 'Predicted' } }
        }
      }
    });
  }

  const clfEl = document.getElementById('chartClf');
  if (clfEl) {
    new Chart(clfEl, {
      type: 'bar',
      data: {
        labels: ['Coverage', 'Region', 'Prior claims', 'Vehicle age', 'Policy tenure'],
        datasets: [{
          data: [0.31, 0.24, 0.19, 0.14, 0.09],
          backgroundColor: '#93A5AF',
          borderRadius: 2
        }]
      },
      options: {
        indexAxis: 'y',
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: gridColor }, title: { display: true, text: 'Feature importance' } },
          y: { grid: { display: false } }
        }
      }
    });
  }

  const tsEl = document.getElementById('chartTs');
  if (tsEl) {
    new Chart(tsEl, {
      type: 'line',
      data: {
        labels: ['J','F','M','A','M','J','J','A','S','O','N','D'],
        datasets: [
          {
            label: 'Actual',
            data: [40,42,45,48,50,55,60,58,62,74,80,70],
            borderColor: '#74787B',
            backgroundColor: 'transparent',
            borderWidth: 1.5,
            pointRadius: 0,
            borderDash: [3,3]
          },
          {
            label: 'Forecast',
            data: [41,43,44,49,52,54,61,59,63,72,79,72],
            borderColor: '#B7A98F',
            backgroundColor: 'rgba(183,169,143,0.08)',
            borderWidth: 2,
            pointRadius: 0,
            fill: true
          }
        ]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: gridColor } }
        }
      }
    });
  }
});
