import { getProgress } from "./api/getProgress";
import "./style.scss";

// Currency formatter using browser API
const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const progressBox = document.getElementById("progress-completed");
const testProgressInput = document.getElementById("test-progress");

const updateProgressOnPage = ({ goal, raised }) => {
  const trackingTotal = document.getElementById("tracking-progress");
  const trackingGoal = document.getElementById("tracking-total");
  if (trackingTotal) {
    trackingTotal.innerText = currencyFormatter.format(raised / 100);
  }
  if (trackingGoal) {
    trackingGoal.innerText = currencyFormatter.format(goal / 100);
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

