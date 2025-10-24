import { getProgress } from "./api/getProgress";
import "./style.scss";
import "./override-ss.scss";
document.documentElement.setAttribute("data-theme", "light");

// Currency formatter using browser API
const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const formatCurrency = (amount) => {
  if (amount >= 1000000) {
    return `$${Math.round(amount / 1000000)}M`;
  }
  return currencyFormatter.format(Math.round(amount));
};

const progressBox = document.getElementById("progress-completed");
const testProgressInput = document.getElementById("test-progress");
const givingAmountButtons = document.querySelectorAll(".giving-amounts button");
const givingSelection = document.querySelector(".giving-selection");
const otherAmount = document.querySelector(".other-amount");
const submitButton = document.querySelector("#giving-form #give-button");
const updateGivingURL = () => {
  const amount = givingSelection.value;
  const existingURL = new URL(submitButton.getAttribute("href"));
  const query = new URLSearchParams(existingURL.search);
  query.set("default_amount", amount);
  existingURL.search = query.toString();
  submitButton.setAttribute("href", existingURL.toString());
};
givingAmountButtons.forEach((button) =>
  button.addEventListener("click", (e) => {
    const val = e.target.value;
    givingSelection.value = val == "other" ? otherAmount.value : val;
    givingAmountButtons.forEach((otherButton) =>
      otherButton.classList.remove("selected-amount")
    );
    button.classList.add("selected-amount");
    if (val == "other") {
      otherAmount.removeAttribute("disabled");
      otherAmount.focus();
      submitButton.innerHTML =
        otherAmount.value != "" ? `Give $${otherAmount.value}` : "Give";
    } else {
      otherAmount.setAttribute("disabled", "disabled");
      submitButton.innerText = `Give $${val}`;
    }
    updateGivingURL();
  })
);

otherAmount.addEventListener("keyup", (e) => {
  submitButton.innerText = `Give $${e.target.value}`;
  givingSelection.value = e.target.value;
  updateGivingURL();
});

const updateProgressOnPage = ({ goal, raised }) => {
  const trackingTotal = document.getElementById("tracking-progress");
  const trackingGoal = document.getElementById("tracking-total");
  if (trackingTotal) {
    trackingTotal.innerText = formatCurrency(raised / 100);
  }
  if (trackingGoal) {
    trackingGoal.innerText = formatCurrency(goal / 100);
  }
  progressBox.style.setProperty("height", `${(raised / goal) * 100}%`);
};

let progressData = {};
if (testProgressInput) {
  testProgressInput.addEventListener("input", function () {
    const progressValue = Number.parseInt(testProgressInput.value, 10) || 0;
    updateProgressOnPage({
      raised: progressValue * 100,
      goal: progressData.data.attributes.goal_cents,
    });
  });
}

window.addEventListener("DOMContentLoaded", async () => {
  progressData = await getProgress();
  updateProgressOnPage({
    goal: progressData.data.attributes.goal_cents,
    raised:
      progressData.data.attributes.received_total_from_pledges_cents +
      progressData.data.attributes.received_total_outside_of_pledges_cents,
  });
});

