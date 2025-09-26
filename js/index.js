document.addEventListener("DOMContentLoaded", () => {
  let eventsData = [];
  let filteredEvents = [];

  const eventsList = document.getElementById("events-list");
  const detailsContainer = document.getElementById("details-container");
  const searchInput = document.getElementById("search");
  const filterSelect = document.getElementById("filter");
  const sortSelect = document.getElementById("sort");

  async function loadEvents() {
    try {
      const response = await fetch("http://localhost:3000/events");
      if (!response.ok) throw new Error("Network response was not ok");
      eventsData = await response.json();
      filteredEvents = [...eventsData];
      applyFiltersAndSort();
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  }

  loadEvents();

  function renderEvents(events) {
    eventsList.innerHTML = "";
    if (events.length === 0) {
      eventsList.innerHTML = "<p>No events found.</p>";
      return;
    }
    events.forEach(event => {
      const li = document.createElement("li");
      li.classList.add("event-card");
      li.innerHTML = `
        <img src="${event.image}" alt="${event.title}">
        <div class="event-info">
          <h3>${event.title}</h3>
          <p><strong>Date:</strong> ${event.date}</p>
          <p><strong>Location:</strong> ${event.location}</p>
        </div>
      `;
      li.addEventListener("click", () => showEventDetails(event));
      eventsList.appendChild(li);
    });
  }

  function showEventDetails(event) {
    detailsContainer.innerHTML = `
      <img src="${event.image}" alt="${event.title}">
      <h3>${event.title}</h3>
      <p><strong>Date:</strong> ${event.date}</p>
      <p><strong>Location:</strong> ${event.location}</p>
      <p>${event.description}</p>
    `;
  }

  function handleSearch(e) {
    const query = e.target.value.toLowerCase();
    filteredEvents = eventsData.filter(event =>
      event.title.toLowerCase().includes(query)
    );
    applyFiltersAndSort();
  }
  searchInput.addEventListener("input", handleSearch);

  function handleFilterOrSortChange() {
    applyFiltersAndSort();
  }
  filterSelect.addEventListener("change", handleFilterOrSortChange);
  sortSelect.addEventListener("change", handleFilterOrSortChange);

  function applyFiltersAndSort() {
    let events = [...eventsData];
    const filterBy = filterSelect.value;
    const now = new Date();

    if (filterBy === "month") {
      events = events.filter(event => {
        const [day, month, year] = event.date.split("/"); 
        const eventDate = new Date(`${year}-${month}-${day}`);
        return (
          eventDate.getMonth() === now.getMonth() &&
          eventDate.getFullYear() === now.getFullYear()
        );
      });
    } else if (filterBy === "year") {
      events = events.filter(event => {
        const [day, month, year] = event.date.split("/");
        const eventDate = new Date(`${year}-${month}-${day}`);
        return eventDate.getFullYear() === now.getFullYear();
      });
    }

    const sortBy = sortSelect.value;

    if (sortBy === "date-asc") {
      events.sort((a, b) => {
        const [dayA, monthA, yearA] = a.date.split("/");
        const [dayB, monthB, yearB] = b.date.split("/");
        return new Date(`${yearA}-${monthA}-${dayA}`) - new Date(`${yearB}-${monthB}-${dayB}`);
      });
    } else if (sortBy === "date-desc") {
      events.sort((a, b) => {
        const [dayA, monthA, yearA] = a.date.split("/");
        const [dayB, monthB, yearB] = b.date.split("/");
        return new Date(`${yearB}-${monthB}-${dayB}`) - new Date(`${yearA}-${monthA}-${dayA}`);
      });
    }

    filteredEvents = events;
    renderEvents(events);
  }

  sortSelect.value = "all";
});