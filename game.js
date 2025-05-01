let balance = parseInt(localStorage.getItem("coins")) || 100;
    let earned = parseInt(localStorage.getItem("earned")) || 0;
    let lost = parseInt(localStorage.getItem("lost")) || 0;
    document.getElementById("balance").textContent = balance;

    function playGame() {
      const input = document.getElementById("guess");
      const guess = parseInt(input.value);
      const random = Math.floor(Math.random() * 20) + 1;

      if (isNaN(guess) || guess < 1 || guess > 20) {
        alert("Введи число від 1 до 20!");
        return;
      }

      if (balance < 5) {
        alert("Недостатньо монет!");
        return;
      }

      balance -= 5;
      if (guess === random) {
        balance += 10;
        earned += 10;
        document.getElementById("result").textContent = `Ти вгадав! Число: ${random}`;
      } else {
        lost += 5;
        document.getElementById("result").textContent = `Не вгадав. Було: ${random}`;
      }

      localStorage.setItem("coins", balance);
      localStorage.setItem("earned", earned);
      localStorage.setItem("lost", lost);
      document.getElementById("balance").textContent = balance;
    }