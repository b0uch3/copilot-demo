// This file is used to write custom JavaScript code for the project
// Add your JavaScript code here

// input with id "username" on change
document.getElementById('username').addEventListener('input', () => {
  // get the value of the input field
  const username = document.getElementById('username').value;
  // regex to check if username has at least 1 capital letter, 1 special character, 1 number and is at least 8 characters long
  const regex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
  // check if the username matches the regex
  document.getElementById('username').style.borderColor = regex.test(username) ? 'green' : 'red';
});

document.addEventListener('DOMContentLoaded', () => {
  const getIncomeValues = () => [
    document.getElementById('january-income').value || 0,
    document.getElementById('february-income').value || 0,
    document.getElementById('march-income').value || 0,
    document.getElementById('april-income').value || 0,
    document.getElementById('may-income').value || 0,
    document.getElementById('june-income').value || 0,
    document.getElementById('july-income').value || 0,
    document.getElementById('august-income').value || 0,
    document.getElementById('september-income').value || 0,
    document.getElementById('october-income').value || 0,
    document.getElementById('november-income').value || 0,
    document.getElementById('december-income').value || 0
  ].map(Number); // Convert values to numbers

  const getExpensesValues = () => [
    document.getElementById('january-expenses').value || 0,
    document.getElementById('february-expenses').value || 0,
    document.getElementById('march-expenses').value || 0,
    document.getElementById('april-expenses').value || 0,
    document.getElementById('may-expenses').value || 0,
    document.getElementById('june-expenses').value || 0,
    document.getElementById('july-expenses').value || 0,
    document.getElementById('august-expenses').value || 0,
    document.getElementById('september-expenses').value || 0,
    document.getElementById('october-expenses').value || 0,
    document.getElementById('november-expenses').value || 0,
    document.getElementById('december-expenses').value || 0
  ].map(Number); // Convert values to numbers

  const ctx = document.getElementById('myChart').getContext('2d');
  const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      datasets: [{
        label: 'Income',
        data: getIncomeValues(),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }, {
        label: 'Expenses',
        data: getExpensesValues(),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
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

  
  async function sendEmailWithChart() {
    const chartImage = myChart.toBase64Image(); 
    const emailParams = {
      to: document.getElementById('email-address').value,
      subject: 'Your Chart Image',
      text: 'Here is your chart image:',
      chartImage: chartImage
    };

    try {
      
      const response = await fetch('http://localhost:3000/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailParams)
      });

      if (response.ok) {
        console.log('Email sent successfully!');
      } else {
        console.error('Failed to send email:', await response.text());
      }
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  }

  document.getElementById('send-email').addEventListener('click', sendEmailWithChart);


  // Update chart data when input values change
  document.querySelectorAll('input[id$="-income"], input[id$="-expenses"]').forEach(input => {
    input.addEventListener('input', () => {
      myChart.data.datasets[0].data = getIncomeValues();
      myChart.data.datasets[1].data = getExpensesValues();
      myChart.update();
    });
  });

  // Download the chart as an image
  document.getElementById('download').addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = myChart.toBase64Image();
    link.download = 'chart.png';
    link.click();
  });
});

