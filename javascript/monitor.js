let labels = JSON.parse(localStorage.getItem("labels")) || [];
let data = JSON.parse(localStorage.getItem("data")) || [];

let ctx = document.getElementById("myChart").getContext("2d");
let chart = new Chart(ctx, {
  maintainAspectRatio: false,
  type: "line",
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        suggestedMin: 0,
        suggestedMax: 10,
      },
    },
  },
  data: {
    labels: labels,
    datasets: [
      {
        label: "Milestones acumulados",
        data: data,
        fill: false,
        borderColor: "rgb(153, 135, 80)",
        tension: 0,
        stepped: true,
      },
    ],
  },
});

function updateData() {
  let checkboxes = document.getElementsByClassName("mileston__checkbox");
  let totalChecked = 0;
  for (let i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      totalChecked++;
    }
  }

  let currentDate = new Date().toLocaleDateString();

  if (chart.data.labels.length > 0) {
    let lastDate = chart.data.labels[chart.data.labels.length - 1];
    if (lastDate === currentDate) {
      chart.data.datasets[0].data[chart.data.datasets[0].data.length - 1] =
        totalChecked;
    } else {
      chart.data.labels.push(currentDate);
      chart.data.datasets[0].data.push(totalChecked);
    }
  } else {
    // If the labels array is empty, add the current date
    chart.data.labels.push(currentDate);
    // Add data for the new date
    chart.data.datasets[0].data.push(totalChecked);
  }

  localStorage.setItem("labels", JSON.stringify(chart.data.labels));
  localStorage.setItem("data", JSON.stringify(chart.data.datasets[0].data));
  chart.update();
}

function storeCheckboxStates() {
  let checkboxes = document.getElementsByClassName("mileston__checkbox");
  let checkboxStates = {};

  for (let i = 0; i < checkboxes.length; i++) {
    checkboxStates[i] = checkboxes[i].checked;
  }

  // Store the states in local storage
  localStorage.setItem("checkboxStates", JSON.stringify(checkboxStates));
}

function retrieveCheckboxStates() {
  // Retrieve the states from local storage
  let storedStates = localStorage.getItem("checkboxStates");

  if (storedStates) {
    let checkboxStates = JSON.parse(storedStates);
    let checkboxes = document.getElementsByClassName("mileston__checkbox");

    for (let i = 0; i < checkboxes.length; i++) {
      // Set the checked state of each checkbox
      checkboxes[i].checked = checkboxStates[i] || false;
    }
  }
}

// Store the states whenever a checkbox changes
let checkboxes = document.getElementsByClassName("mileston__checkbox");
for (let i = 0; i < checkboxes.length; i++) {
  checkboxes[i].addEventListener("change", storeCheckboxStates);
}

// Retrieve the states when the page loads
window.addEventListener("load", retrieveCheckboxStates);
