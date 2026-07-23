// Find our date picker inputs on the page
const startInput = document.getElementById("startDate");
const endInput = document.getElementById("endDate");
const button = document.querySelector("button");
const gallery = document.getElementById("gallery");

// Random space fact
const spaceFact = document.getElementById("spaceFact");

// Modal elements
const modal = document.getElementById("modal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalDate = document.getElementById("modalDate");
const modalExplanation = document.getElementById("modalExplanation");
const closeModal = document.getElementById("closeModal");

// Call the setupDateInputs function from dateRange.js
setupDateInputs(startInput, endInput);

// NASA API Key
const API_KEY = "DEMO_KEY";

// Space facts
const facts = [
  "🌎 One day on Venus is longer than one year on Venus.",
  "☀️ Light from the Sun takes about 8 minutes to reach Earth.",
  "🪐 Saturn could float in water because it's less dense than water.",
  "🚀 The footprints left on the Moon may remain for millions of years.",
  "🌕 The Moon moves about 3.8 centimeters away from Earth every year.",
  "🌌 The Milky Way contains over 100 billion stars.",
  "⭐ There are more stars in the universe than grains of sand on Earth.",
  "🛰️ The International Space Station travels around Earth at about 17,500 mph."
];

// Display a random fact when the page loads
const randomFact = facts[Math.floor(Math.random() * facts.length)];
spaceFact.textContent = "Did You Know? " + randomFact;

// Fetch images when button is clicked
button.addEventListener("click", getSpaceImages);

// Close modal when X is clicked
closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

// Close modal when clicking outside
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

// Fetch NASA images
async function getSpaceImages() {
  const startDate = startInput.value;
  const endDate = endInput.value;

  // Loading message
  gallery.innerHTML = "<h2>🔄 Loading space photos...</h2>";

  try {
    const response = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&start_date=${startDate}&end_date=${endDate}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch NASA images.");
    }

    const data = await response.json();

    // Show newest first
    data.reverse();

    gallery.innerHTML = "";

    data.forEach((item) => {
      const card = document.createElement("div");
      card.className = "card";

      if (item.media_type === "image") {

        card.innerHTML = `
          <img src="${item.url}" alt="${item.title}">
          <h3>${item.title}</h3>
          <p>${item.date}</p>
        `;

        // Open modal
        card.addEventListener("click", () => {
          modal.style.display = "flex";
          modalImage.src = item.hdurl || item.url;
          modalImage.alt = item.title;
          modalTitle.textContent = item.title;
          modalDate.textContent = item.date;
          modalExplanation.textContent = item.explanation;
        });

      } else {

        // Handle videos
        card.innerHTML = `
          <div style="padding:20px; text-align:center;">
            <h3>${item.title}</h3>
            <p>${item.date}</p>
            <p>🎥 This Astronomy Picture of the Day is a video.</p>
            <a href="${item.url}" target="_blank">▶ Watch Video</a>
          </div>
        `;

      }

      gallery.appendChild(card);
    });

  } catch (error) {

    gallery.innerHTML = `
      <p style="color:red; text-align:center;">
        Error: ${error.message}
      </p>
    `;

  }
}