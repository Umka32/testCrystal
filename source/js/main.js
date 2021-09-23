"use strict";

const crystal = document.querySelector(".crystal");
const page = document.querySelector(".page");

crystal.onmouseover = () => {
  page.classList.add("fill");
}

crystal.onmouseout = () => {
  page.classList.remove("fill");
}

function crystalnterval() {
  const counter = document.querySelector(".crystal__text")
  let item = 0;

  let countText = setInterval(() => {
    item++;
    if (item === 4) {
      clearInterval(countText);
      return counter.innerHTML = "Go!";
    }
    return counter.innerHTML = item;
  }, 500);
}

crystal.addEventListener("click", crystalnterval);
window.onresize = crystalnterval;