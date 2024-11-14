// script.js

const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

let date = new Date();
let currentMonth = date.getMonth();
let currentYear = date.getFullYear();
let events = [];  // To store events from the CSV

const monthNameEl = document.querySelector(".month-name");
const calendarGridEl = document.querySelector(".calendar-grid");
const eventDropdownEl = document.querySelector("#event-dropdown");
const reserveButton = document.querySelector("#reserve-button");

document.querySelector(".prev-month").addEventListener("click", () => {
    changeMonth(-1);
});
document.querySelector(".next-month").addEventListener("click", () => {
    changeMonth(1);
});

function changeMonth(offset) {
    currentMonth += offset;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    } else if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
}

function renderCalendar() {
    monthNameEl.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    calendarGridEl.innerHTML = "";

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        calendarGridEl.innerHTML += `<div></div>`;
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayEl = document.createElement("div");
        dayEl.classList.add("calendar-day");
        dayEl.textContent = day;

        if (day === date.getDate() && currentMonth === date.getMonth() && currentYear === date.getFullYear()) {
            dayEl.classList.add("today");
        }

        // Get events for this day
        const selectedDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayEvents = events.filter(event => event.date === selectedDate);

        // Display events inside the calendar day
        dayEvents.forEach(event => {
            const eventEl = document.createElement("div");
            eventEl.classList.add("event");
            eventEl.textContent = `${event.time} - ${event.event_name}`;
            dayEl.appendChild(eventEl);
        });

        dayEl.addEventListener("click", () => {
            selectDate(day);
        });

        calendarGridEl.appendChild(dayEl);
    }
}


// Load events from CSV file
async function loadEvents() {
    const response = await fetch('events.csv');
    const csvText = await response.text();
    events = csvText.split('\n').slice(1).map(line => {
        const [date, time, event_name, event_id] = line.split(',');
        return { date, time, event_name, event_id };
    });
}

// Populate event dropdown for a selected date
function selectDate(day) {
    const selectedDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const filteredEvents = events.filter(event => event.date === selectedDate);

    eventDropdownEl.innerHTML = "";  // Clear previous options
    if (filteredEvents.length > 0) {
        filteredEvents.forEach(event => {
            const option = document.createElement("option");
            option.value = event.event_id;
            option.textContent = `${event.time} - ${event.event_name}`;
            eventDropdownEl.appendChild(option);
        });
    } else {
        const noEventOption = document.createElement("option");
        noEventOption.textContent = "No events";
        eventDropdownEl.appendChild(noEventOption);
    }
}

// Redirect to reservation page with event ID as a parameter
reserveButton.addEventListener("click", () => {
    const selectedEventId = eventDropdownEl.value;
    if (selectedEventId) {
        window.location.href = `reserve.html?event_id=${selectedEventId}`;
    }
});

// Load events and render the calendar
loadEvents().then(renderCalendar);
