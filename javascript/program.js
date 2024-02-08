if (typeof window != "undefined" && window.document) {
  document.addEventListener("DOMContentLoaded", () => {
    fetchUser()
      .then((data) => {
        updateEnableDates(data.subscriptionDate);
        updateSessionStatus(
          data.subscriptionDate,
          data.sessionStatus,
          sessionLinks,
          noteLinks
        );
        updateSheetStatus();
        updateVideoTags(sessionLinks);
        updateNotesTags(noteLinks);
        hideQuizQuestions();
      })
      .catch((error) => {
        console.error("Error in initializePage:", error);
      });
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

  const sessionLinks = [
    "https://youtu.be/d6CthsFhnGc", // Intro
    "https://youtu.be/Us9gamEdnPY?si=rO6FOMKBs5t1DCs2", // Session 0
    "https://youtu.be/fX3OeP4K6is?si=wRoYhp4UA0rK0rzW", // Session 1
    "https://www.youtube.com/watch?v=GAwtTjl1Dc4", // Session 2
    "https://youtu.be/_GoRuJgWinA", // Session 3
    "https://youtu.be/J4IcyiWtmjo?si=xXe9PaONimYqajgT", // Session 4
    "https://youtu.be/C_t0bhBtWEw", // Session 5
    "https://youtu.be/dZAR-m74PCM", // Session 6
    "https://youtu.be/9rdQFmSPKQw?si=wfQE208nTK1X8SsN", //Session 7
    "https://youtu.be/mQ3uAcPxo3Q", // Session 8
    "https://youtu.be/K6XrlPpFRpY", // Session 9
    "https://www.youtube.com/watch?v=v48VHJ-AedI", // Outro
  ];

  const noteLinks = [
    "", // Intro
    "https://www.youtube.com/watch?v=Z4KuV9pQxU8", // Session 0
    "https://www.youtube.com/watch?v=dPuo_6eKQZM", // Session 1
    "https://youtu.be/o4otipOOhqE", // Session 2
    "https://youtu.be/Cq3t2NXYeLI", // Session 3
    "https://youtu.be/aNXR9d-18Q4", // Session 4
    "https://youtu.be/7vdi_vGMKwE", // Session 5
    "https://youtu.be/yS6oBOgveII", // Session 6
    "https://www.youtube.com/watch?v=iypVlPG2_b8", // Session 7
    "https://youtu.be/ae4z-rqbmG0", // Session 8
    "https://youtu.be/qoP_0lNxkEg", // Session 9
  ];

  async function fetchUser() {
    const userId = getCookie("userId");
    

    if (userId) {
      const url = `${getScriptUrl()}?functionName=verifyUserId&userId=${userId}&isCount=true`;
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
              document.getElementById("loading-message").style.display = "none";
              document.getElementById("content").style.display = "block";

              const subscriptionDate = new Date(
                responseObject.subscriptionDate
              );

              const formattedDate = subscriptionDate
                .toISOString()
                .split("T")[0];

              return {
                subscriptionDate: formattedDate,
                sessionStatus: responseObject.sessionStatus,
              };
            } else if (responseObject.status === "cantAccess") {
              window.location.href =
                "https://juanifernandez.com/freedom-academy/auth";
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
      window.location.href = "https://juanifernandez.com/freedom-academy/auth";
    }
  }

  function hideQuizQuestions() {
    const quizContainers = document.querySelectorAll(
      '[class^="quiz-container-"]'
    );
    quizContainers.forEach((quizContainer) => {
      quizContainer.style.display = "none";
    });
  }

  function toggleQuizQuestion(index) {
    const userId = getCookie("userId");


     

    if (userId) {
      const url = `${getScriptUrl()}?functionName=getQuizInformation&userId=${userId}&quizNumber=${index}`;

      const quizIcon = document.getElementById(`quizIcon-${index}`);
      const loader = document.getElementById(`loading-message-${index}`);

      quizIcon.style.display = "none";
      loader.style.display = "block";

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
              const quizResponse = responseObject.quiz;
              const answerQuizResponse = responseObject.answer;

              handleQuizVisibility(index, quizResponse, answerQuizResponse);
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
      // Redirect to a default URL if userId is not available
      window.location.href = "https://juanifernandez.com";
    }
  }

  function handleQuizVisibility(index, quizResponse, answerQuizResponse) {
    const quizIcon = document.getElementById(`quizIcon-${index}`);
    const loader = document.getElementById(`loading-message-${index}`);
    const failedQuizMessage = document.getElementById("failedQuiz");
    const passedQuizMessage = document.getElementById("passedQuiz");

    loader.style.display = "none";

    if (quizResponse === "hideQuiz") {
      quizIcon.style.display = "flex";

      if (answerQuizResponse === "FAILED") {
        failedQuizMessage.style.display = "block";
        setTimeout(() => {
          failedQuizMessage.style.display = "none";
        }, 5000);
      }

      if (answerQuizResponse === "PASSED") {
        passedQuizMessage.style.display = "block";
        setTimeout(() => {
          passedQuizMessage.style.display = "none";
        }, 5000);
      }
    } else {
      if (answerQuizResponse === "PASSED") {
        passedQuizMessage.style.display = "block";
        setTimeout(() => {
          passedQuizMessage.style.display = "none";
        }, 5000);
      } else {
        const quizContainer = document.querySelector(
          `.quiz-container-${index}`
        );
        if (quizContainer) {
          quizContainer.style.display =
            quizContainer.style.display === "none" ||
            quizContainer.style.display === ""
              ? "block"
              : "none";
        }
      }
      quizIcon.style.display = "flex";
    }
  }

  function getSessionResult(sessionStatus, sessionKey) {
    const sessionResult = sessionStatus.find((item) => item[sessionKey]);
    return sessionResult ? sessionResult[sessionKey] : "";
  }

  async function updateSessionStatus(
    baseDate,
    sessionStatus,
    sessionLinks,
    noteLinks
  ) {
    const currentDate = new Date();
    const oneDayInMillis = 24 * 60 * 60 * 1000; // Milliseconds in a day
    const daysSinceBaseDate = Math.floor(
      (currentDate - new Date(baseDate)) / oneDayInMillis
    );

    const sessionElements = document.querySelectorAll(".sessions-li");
    let doneSessions = 0; // Initialize the count of "done" sessions
    let lastSessionNode;
    let lastSessionNumber = "";
    sessionElements.forEach((session, index) => {
      if (index === 0) {
        const sessionResultValue = getSessionResult(sessionStatus, "intro");
        if (sessionResultValue === "CLICKED") {
          session.querySelector(".status-icon").textContent = "Passed";
          session.querySelector(".status-icon").classList.add("passed");
        } else {
          session.querySelector(".status-icon").textContent = "WATCH";
          session.querySelector(".status-icon").classList.add("done");
        }
      } else if (daysSinceBaseDate >= 7 * (index - 1)) {
        const sessionKey = `E01S${index - 1}`;
        const sessionResultValue = getSessionResult(sessionStatus, sessionKey);
        if (session.querySelector(".status-icon")) {
          if (sessionResultValue === "FAILED") {
            session.querySelector(".status-icon").textContent = "Retake";
            session.querySelector(".status-icon").classList.add("done");
          } else if (sessionResultValue === "PASSED") {
            session.querySelector(".status-icon").textContent = "Passed";
            session.querySelector(".status-icon").classList.add("passed");
          } else {
            session.querySelector(".status-icon").textContent = "Take Quiz";
            session.querySelector(".status-icon").classList.add("done");
          }
        }

        doneSessions++;

        if (sessionLinks && sessionLinks[index]) {
          const videoLink = session.querySelector(`#s${index}-video-href`);
          if (videoLink) {
            videoLink.href = sessionLinks[index];
          }
        }

        if (noteLinks && noteLinks[index]) {
          const noteLink = session.querySelector(`#s${index}-note-href`);
          if (noteLink) {
            noteLink.href = noteLinks[index];
          }
        }

        const quizIcon = session.querySelector(".quiz-icon");
        if (quizIcon) {
          quizIcon.style.pointerEvents = "auto"; // Enable the icon
        }
      } else if (index < 12) {
        session.querySelector(".status-icon").textContent = "Pending";
        session.querySelector(".status-icon").classList.add("pending");
        const videoIcon = session.querySelector(".video-icon");

        if (videoIcon) {
          videoIcon.style.pointerEvents = "none";
        }

        const notesIcon = session.querySelector(".notes-icon");

        if (notesIcon) {
          notesIcon.style.pointerEvents = "none";
        }

        const sessionTitle = session.querySelector(".session-title");
        sessionTitle.classList.add("pending");
        const sessionIconsContainer = session.querySelector(
          ".session-icons-container"
        );
        sessionIconsContainer.classList.add("pending");
        const videoLink = session.querySelector(`#s${index}-video-href`);
        if (videoLink) {
          videoLink.removeAttribute("href");
        }
        const noteLink = session.querySelector(`#s${index}-note-href`);
        if (noteLink) {
          noteLink.removeAttribute("href");
          noteLink.style.pointerEvents = "none";
        }

        const quizIcon = session.querySelector(".quiz-icon");
        if (quizIcon) {
          quizIcon.style.pointerEvents = "none";
        }
      }
      // if (index === 11) {
      //   const sessionIconsContainer = session.querySelector(
      //     ".session-icons-container"
      //   );
      //   sessionIconsContainer.classList.add("pending");
      // }
    });

    if (lastSessionNode) {
      const newSpan = document.createElement("span");
      newSpan.textContent = "NEW";
      newSpan.classList.add("newBadge");

      const sessionIconsContainer =
        lastSessionNode.querySelector(".session-title");
      if (sessionIconsContainer) {
        sessionIconsContainer.appendChild(newSpan);
      }
    }
    if (lastSessionNumber) {
      await sendNewSessionEmail(lastSessionNumber);
    }

    updateCompletionPercentage(doneSessions, sessionStatus);
  }

  const updateCompletionPercentage = async (doneSessions, sessionStatus) => {
    const totalSessions = document.querySelectorAll(".sessions-li").length;

    const completionPercentage =
      (doneSessions / 10) * 100 >= 100 ? 100 : (doneSessions / 10) * 100; //Hardcodeado para calcular solo 10 primeras sesiones

    const progressFillElement = document.getElementById("progressFill");
    progressFillElement.textContent = `${completionPercentage.toFixed(0)}%`;
    progressFillElement.style.width = `${completionPercentage}%`;

    if (completionPercentage === 100) {
      progressFillElement.style.backgroundColor = "var(--SuccessMessage)";
    }
    let doneQuizSessions = 0;
    sessionStatus.forEach((item) => {
      const [, value] = Object.entries(item)[0];
      if (value === "PASSED") {
        doneQuizSessions++;
      }
    });
    const totalQuizSessions = 10; // Harcodeado para calcular solo 10 primeros quizes sessionStatus.length;

    const quizCompletionPercentage =
      (doneQuizSessions / totalQuizSessions) * 100;

    const progressQuizFillElement = document.getElementById("progressFillQuiz");
    progressQuizFillElement.textContent = `${quizCompletionPercentage.toFixed(
      0
    )}%`;
    progressQuizFillElement.style.width = `${quizCompletionPercentage}%`;
    if (quizCompletionPercentage === 100) {
      progressQuizFillElement.style.backgroundColor = "var(--SuccessMessage)";
    }
    await sendQuizCompletion();
  };

  async function sendNewSessionEmail(sessionNumber) {
    const userId = getCookie("userId");


     

    if (userId) {
      const url = `${getScriptUrl()}?functionName=newSessionEmail&userId=${userId}&sessionNumber=${sessionNumber}`;

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
      window.location.href = "https://juanifernandez.com";
    }
  }

  function updateEnableDates(baseDate) {
    const sessionElements = document.querySelectorAll(".sessions-li");

    let currentDate = new Date(baseDate);

    sessionElements.forEach((session, index) => {
      const enableDateSpan = document.createElement("span");

      if (index === 0 || index === 1) {
        currentDate.setDate(new Date(baseDate).getDate() + 1);
      } else {
        currentDate.setDate(currentDate.getDate() + 7);
      }

      const formattedDate = currentDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      enableDateSpan.textContent = `${formattedDate}`;
      enableDateSpan.classList.add("session-enable-date");
      session.appendChild(enableDateSpan);
      if (index >= 12) {
        enableDateSpan.style.filter = "blur(5px)";
        // enableDateSpan.style.textShadow = '0 0 13px rgba(255, 255, 255, 0.7)';
      }
    });
  }

  function getYouTubeVideoId(url) {
    const videoIdMatch = url.match(
      /(?:youtu.be\/|youtube.com\/(?:embed\/|v\/|watch\?v=|watch\?feature=player_embedded&v=|embed\?listType=playlist&list=|user\/\S+\/U\/\S+|v=))([^?&"'>]+)/
    );
    if (videoIdMatch) {
      return videoIdMatch[1];
    }
    return null;
  }

  function updateVideoTags(sessionLinks) {
    const sessionIconsContainers = document?.querySelectorAll(
      ".session-icons-container"
    );
    const sessionVideos = document?.querySelectorAll(".session-video-player");
    const players = new Array(sessionLinks.length).fill(null); // Array to store YouTube players

    // Function to create a new YouTube player with a given video ID
    function createYouTubePlayer(videoId, index) {
      if (!players[index]) {
        players[index] = new YT.Player(`videoPlayer${index}`, {
          height: "600px",
          width: "80%",
          videoId: videoId,
          playerVars: {
            showinfo: 0, // Hide video title and uploader
            modestbranding: 1, // Minimal YouTube branding
            rel: 0, // Hide related videos at the end
          },
          events: {
            onReady: onPlayerReady,
          },
        });
      }
    }

    // Function to handle the "onReady" event for the YouTube player
    function onPlayerReady(event) {
      // Player is ready, but pause the video immediately
      event.target.pauseVideo();
    }

    sessionIconsContainers.forEach((container, index) => {
      const videoLink = container.querySelector(".video-icon");
      const statusIcon = container.querySelector(".status-icon");

      const isPending = statusIcon?.textContent?.trim() === "Pending";
      if (videoLink) {
        videoLink?.addEventListener("click", function (e) {
          e.preventDefault();

          // Check if the session is pending, and if so, do not update the video link
          if (!isPending) {
            // Set the YouTube video ID based on the sessionLinks array
            const videoId = getYouTubeVideoId(sessionLinks[index]);
            if (videoId) {
              createYouTubePlayer(videoId, index);
            }
            // Toggle the visibility and play/pause of the video
            const sessionVideo = sessionVideos[index];
            if (sessionVideo.style.display === "block") {
              sessionVideo.style.display = "none";
              players[index].stopVideo();
              players[index].clearVideo();
            } else {
              sessionVideo.style.display = "block";
              players[index]?.playVideo();
            }
          }
        });
      }
    });
  }

  function updateNotesTags(noteLinks) {
    const sessionIconsContainers = document.querySelectorAll(
      ".session-icons-container"
    );
    const sessionVideos = document.querySelectorAll(".session-notes-player");
    const players = new Array(noteLinks.length).fill(null); // Array to store YouTube players

    // Function to create a new YouTube player with a given video ID
    function createYouTubePlayer(videoId, index) {
      if (!players[index]) {
        players[index] = new YT.Player(`notesPlayer${index}`, {
          height: "600px",
          width: "80%",
          videoId: videoId,
          playerVars: {
            showinfo: 0, // Hide video title and uploader
            modestbranding: 1, // Minimal YouTube branding
            rel: 0, // Hide related videos at the end
          },
          events: {
            onReady: onPlayerReady,
          },
        });
      }
    }

    // Function to handle the "onReady" event for the YouTube player
    function onPlayerReady(event) {
      // Player is ready, but pause the video immediately
      event.target.pauseVideo();
    }

    sessionIconsContainers.forEach((container, index) => {
      const videoLink = container.querySelector(".notes-icon");
      const statusIcon = container.querySelector(".status-icon");
      const isPending = statusIcon?.textContent.trim() === "Pending";
      if (videoLink) {
        videoLink?.addEventListener("click", function (e) {
          e.preventDefault();

          // Set the YouTube video ID based on the sessionLinks array
          if (!isPending) {
            const videoId = getYouTubeVideoId(noteLinks[index]);
            if (videoId) {
              createYouTubePlayer(videoId, index);
            }

            // Toggle the visibility and play/pause of the video
            const sessionVideo = sessionVideos[index];
            if (sessionVideo.style.display === "block") {
              sessionVideo.style.display = "none";
              players[index].stopVideo();
              players[index].clearVideo();
            } else {
              sessionVideo.style.display = "block";
              players[index].playVideo();
            }
          }
        });
      }
    });
  }
}
function updateSheetStatus() {
  const userId = getCookie("userId");


   

  if (userId) {
    const url = `${getScriptUrl()}?functionName=getPlanillaIfExists&userId=${userId}`;
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
          if (responseObject.data.id) {
            const sheetLink = document.getElementById("sheetLink");
            sheetLink.href = `https://docs.google.com/spreadsheets/d/${responseObject.data.id}/edit#gid=0`;
            sheetLink.style.display = "flex";
          } else {
            const typewriter = document.getElementById("typewriter");
            const subject = document.getElementById("subject");
            subject.innerHTML = `Subject: ${responseObject.data.lastName}`;
            subject.style.width = subject.innerHTML.length * 8 + "px";
            typewriter.style.display = "block";
            typewriter.classList.add("css-typing");
          }
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
function shareOpinionForm() {
  const url = "https://forms.gle/WM2Y798Tdn1S2tGF7";
  window.open(url, "_blank");
}

async function userClickCount(clickName) {
  const userId = getCookie("userId");


   
  const url = `${getScriptUrl()}?functionName=clickCount&clickName=${clickName}&userId=${userId}`;

  const introSessionElement = document.querySelector(
    ".sessions-li:first-child"
  );
  introSessionElement.querySelector(".status-icon").textContent = "Passed";
  introSessionElement.querySelector(".status-icon").classList.add("passed");

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
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

async function sendQuiz(quizNumber, quizAnswer) {
  const userId = getCookie("userId");


   

  if (userId) {
    const url = `${getScriptUrl()}?functionName=submitQuiz&userId=${userId}&quizNumber=${quizNumber}&quizAnswer=${quizAnswer}`;

    const quizContainer = document.querySelector(
      `.quiz-container-${quizNumber}`
    );
    if (quizContainer) {
      quizContainer.style.display =
        quizContainer.style.display === "none" ||
        quizContainer.style.display === ""
          ? "block"
          : "none";
    }

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
    window.location.href = "https://juanifernandez.com";
  }
}

async function submitQuiz(session) {
  const answers = {};
  let questionNumber = 1;
  let allCorrect = true; // Assume all answers are correct initially

  while (true) {
    const question = document.getElementById(
      `question${questionNumber}-${session}`
    );

    if (!question) {
      break; // Exit the loop when no more questions are found
    }

    const sessionIdentifier = question.dataset.session;

    if (sessionIdentifier === session) {
      const radioButtons = question.querySelectorAll('input[type="radio"]');
      const questionId = question.id;

      const userAnswer =
        Array.from(radioButtons).find((rb) => rb.checked)?.value || null;
      const correctAnswer =
        Array.from(radioButtons).find((rb) => rb.value.includes("*"))?.value ||
        null;

      // Check if the user answer matches the correct answer
      if (userAnswer !== correctAnswer) {
        allCorrect = false; // At least one answer is incorrect
      }

      answers[questionId] = userAnswer;
    }

    questionNumber++;
  }

  const result = allCorrect ? "PASSED" : "FAILED";

  const lastPartOfSession = Number(session.slice(-1)) + 1;

  if (result === "PASSED") {
    const passedQuizMessage = document.getElementById("passedQuiz");
    passedQuizMessage.style.display = "block";
    await sendQuizCompletion();
    const li = getLiContainerByIndex(lastPartOfSession);

    if (li) {
      const statusIcon = li.querySelector('[class^="status-icon"]');
      statusIcon.textContent = "Passed";
      statusIcon.classList.add("passed");
    }

    setTimeout(() => {
      passedQuizMessage.style.display = "none";
    }, 5000);
  }

  if (result === "FAILED") {
    const failedQuizMessage = document.getElementById("failedQuiz");
    failedQuizMessage.style.display = "block";

    const li = getLiContainerByIndex(lastPartOfSession);

    if (li) {
      const statusIcon = li.querySelector('[class^="status-icon"]');
      statusIcon.textContent = "Retake";
      statusIcon.classList.add("retake");
    }
    setTimeout(() => {
      failedQuizMessage.style.display = "none";
    }, 5000);
  }

  await sendQuiz(session, result);
}

const getLiContainerByIndex = (index) => {
  return Array.from(document.querySelectorAll(".sessions-li")).find(
    (_, idx) => {
      return idx.toString() === index.toString();
    }
  );
};
async function sendQuizCompletion() {
  const userId = getCookie("userId");


   

  if (userId) {
    const url = `${getScriptUrl()}?functionName=setQuizCompletion&userId=${userId}`;
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
