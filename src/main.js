import "./style.scss";

const donationForm = document.getElementById("donation-form");

const costPerSqFt = 250.0;

// watch for sq_ft input changes and update donation amount
const sqFeetInput = document.getElementById("sq_feet");
const donationCount = document.getElementById("donation-count");
const donationAmountDisplay = document.getElementById("donation-amount");
const progressBox = document.getElementById("progress-display");
const testProgressInput = document.getElementById("test-progress");

testProgressInput.addEventListener("input", function () {
  const progressValue = Number.parseInt(testProgressInput.value, 10) || 0;
  const clampedValue = Math.min(100, Math.max(0, progressValue));
  progressBox.style.setProperty("--progress", `${clampedValue}%`);
});

// Create 250,000 divs in the progress box
for (let i = 0; i < 250; i++) {
  const div = document.createElement("div");
  div.classList.add("block");
  progressBox.appendChild(div);
}

sqFeetInput.addEventListener("input", function () {
  const sqFeet = Number.parseInt(sqFeetInput.value, 10) || 0;
  const donationAmount = sqFeet * costPerSqFt;
  donationCount.textContent = `${sqFeetInput.value} square ${
    sqFeet === 1 ? "foot" : "feet"
  }`;
  donationAmountDisplay.textContent = `$${donationAmount.toFixed(2)}`;
});
donationForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const formData = new FormData(donationForm);
  const data = Object.fromEntries(formData.entries());
  const sqFeet = Number.parseInt(data.sq_feet, 10);
  const donationAmount = sqFeet * costPerSqFt;

  console.log(`Donation Amount: $${donationAmount.toFixed(2)}`);
  return false;
});

