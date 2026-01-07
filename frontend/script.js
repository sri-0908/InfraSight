// script.js — connects UI to FastAPI backend

const runButton = document.querySelector(".secondary-btn");
const fileInput = document.querySelector("input[type='file']");
const riskText = document.querySelector(".risk");
const trendText = document.querySelectorAll(".card p")[2];

const API_URL = "http://127.0.0.1:8000/analyze";

// Helper: set risk color text
function updateRiskUI(risk, trend) {
  riskText.textContent = risk;
  riskText.className = "risk " + risk.toLowerCase();
  trendText.textContent = trend;
}

// Click handler
runButton.addEventListener("click", async () => {
  if (!fileInput.files.length) {
    alert("Please upload a CSV file to analyze.");
    return;
  }

  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append("file", file);

  // Loading state
  runButton.textContent = "Analyzing…";
  runButton.disabled = true;
  updateRiskUI("—", "Processing data…");

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      throw new Error("Server error");
    }

    const result = await response.json();
    // Expected result: { risk: "Low|Medium|High", trend: "..." }

    updateRiskUI(result.risk, result.trend);
  } catch (err) {
    console.error(err);
    updateRiskUI("—", "Analysis failed. Check backend.");
    alert("Could not reach backend. Is FastAPI running?");
  } finally {
    runButton.textContent = "Run Analysis";
    runButton.disabled = false;
  }
});
