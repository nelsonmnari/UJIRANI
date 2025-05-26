const locationInput = document.getElementById("location");
const reportForm = document.getElementById("reportForm");

const geoDisplay = document.createElement("p");
geoDisplay.style.fontStyle = "italic";
geoDisplay.style.fontSize = "14px";
geoDisplay.style.color = "#555";
reportForm.insertBefore(geoDisplay, reportForm.querySelector("button"));

navigator.geolocation.getCurrentPosition(
  (position) => {
    const coords = `${position.coords.latitude}, ${position.coords.longitude}`;
    locationInput.value = coords;
    geoDisplay.textContent = `📍 Location: ${coords}`;
  },
  (error) => {
    geoDisplay.textContent = "⚠️ Location not available. Please enable GPS.";
  }
);

reportForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!locationInput.value) {
    alert("Waiting for location. Please allow location access.");
    return;
  }

  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const location = locationInput.value;

  const response = await fetch(
    "https://ujirani-backend.onrender.com/api/issues",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, location }),
    }
  );

  const result = await response.json();
  if (result.success) {
    reportForm.reset();
    geoDisplay.textContent = "";
    locationInput.value = "";
    navigator.geolocation.getCurrentPosition((position) => {
      const coords = `${position.coords.latitude}, ${position.coords.longitude}`;
      locationInput.value = coords;
      geoDisplay.textContent = `📍 Location: ${coords}`;
    });
    loadIssues();
  }
});

async function loadIssues() {
  const response = await fetch(
    "https://ujirani-backend.onrender.com/api/issues"
  );
  const data = await response.json();
  const container = document.getElementById("issuesContainer");
  container.innerHTML = "";
  data.forEach((issue) => {
    const div = document.createElement("div");
    div.className = "issue-card";
    div.innerHTML = `<strong>${issue.title}</strong><br/>${issue.description}<br/><small>${issue.location}</small>`;
    container.appendChild(div);
  });
}

loadIssues();
