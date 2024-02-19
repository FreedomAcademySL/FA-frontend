const modal = document.getElementById("myModal");
const btn = document.getElementById("openModal");
const span = document.querySelector(".close");
const tyc = document.querySelector("#tyccheckbox");

tyc.addEventListener("change", function () {
  if (tyc.checked) {
    span.style.display = "block";
    console.log("checked");
  } else {
    span.style.display = "none";
  }
});

span.onclick = function () {
  modal.style.display = "none";
  localStorage.setItem("tyc", JSON.stringify(true));
};
