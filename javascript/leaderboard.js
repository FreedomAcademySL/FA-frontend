function getTableData() {
  const userIdCookieName = "userId";
  const userId = getCookie(userIdCookieName);
  if (userId) {
    const url = `${getScriptUrl()}?functionName=getListQuizCompletion`;
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((data) => {
        try {
          const responseObject = JSON.parse(data);
          document.getElementById("loading-message").style.display = "none";
          document.getElementById("content").style.display = "block";

          return responseObject.data;
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  } else {
    window.location.href = "https://juanifernandez.com";
  }
}

async function setData() {
  const data = (await getTableData()) || [];

  const leaderboard = data.sort((a, b) => {
    return b.quiz - a.quiz;
  });

  const table = document.querySelector("table");

  leaderboard.map((item, index) => {
    if (item.quiz === undefined) return;
    if (item.quiz === null) return;

    if (index < 4) return;

    const tdName = document.createElement("td");
    tdName.textContent = item.name;
    const rank = document.createElement("td");
    rank.textContent = index;
    const tdProgress = document.createElement("td");
    const tdProgressText = document.createElement("td");

    tdProgressText.innerText = item.quiz + "%";
    const divTableProgressbar = document.createElement("div");
    divTableProgressbar.className = "table__progressbar";
    const divProgressBar = document.createElement("div");
    divProgressBar.className = "progress-bar";
    const divProgressFill = document.createElement("div");
    divProgressFill.className = "progress-fill";
    divProgressFill.style.width = item.quiz + "%";
    divProgressBar.appendChild(divProgressFill);
    divTableProgressbar.appendChild(divProgressBar);
    tdProgress.appendChild(divTableProgressbar);

    const tr = document.createElement("tr");
    tr.appendChild(rank);
    tr.appendChild(tdName);
    tr.appendChild(tdProgressText);
    tr.appendChild(tdProgress);
    table.appendChild(tr);
  });

  document.querySelector("#first_name").innerHTML = leaderboard[0].name;
  document.querySelector("#first_quiz").innerHTML = leaderboard[0].quiz + "%";
  document.querySelector("#second_name").innerHTML = leaderboard[1].name;
  document.querySelector("#second_quiz").innerHTML = leaderboard[1].quiz + "%";
  document.querySelector("#third_name").innerHTML = leaderboard[2].name;
  document.querySelector("#third_quiz").innerHTML = leaderboard[2].quiz + "%";
}
function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}
setData();