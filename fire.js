const coins = localStorage.getItem("coins") || 100;
const earned = localStorage.getItem("earned") || 0;
const lost = localStorage.getItem("lost") || 0;

document.getElementById("coins").textContent = coins;
document.getElementById("earned").textContent = earned;
document.getElementById("lost").textContent = lost;