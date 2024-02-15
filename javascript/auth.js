document.addEventListener("DOMContentLoaded", async () => {
  await verifyUserId();
});

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

async function verifyUserId() {
  const userIdCookieName = "userId";
  const userId = getIdOrGetCookie();
  if (userId) {
    const url = `${getScriptUrl()}?functionName=verifyUserId&userId=${userId}`;

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
          if (responseObject.status === "success") {
            window.location.href = `https://juanifernandez.com/freedom-academy/program`;
          } else if (responseObject.status === "cantAccess") {
            window.location.href = "https://juanifernandez.com";
          } else {
            console.error("Server response status:", responseObject.status);
          }
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  } else {
    document.getElementById("loading-message").style.display = "none";
    document.getElementById("content").style.display = "block";
  }

  if (userId) {
    return userId;
  }
}
