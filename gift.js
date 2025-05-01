const coins = localStorage.getItem("coins") || 100;
    document.getElementById("balance").textContent = coins;