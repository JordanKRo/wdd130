// script.js

const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

let date = new Date();
let currentMonth = date.getMonth();
let currentYear = date.getFullYear();
let events = [];  // To store events from the CSV

let selectedDayEl = null; // Keep track of the currently selected day element

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
        
        // Get events and check if any are in the past
        const dayEvents = events.filter(event => event.date === selectedDate);
        const isPastDate = dayEvents.some(event => event.isPast);

        if (isPastDate) {
            dayEl.classList.add("past-day"); // Custom style for past days
            dayEl.classList.add("disabled"); // Optional: disable click for past days
        }

        dayEvents.forEach(event => {
            const eventEl = document.createElement("div");
            eventEl.classList.add("event");
            eventEl.textContent = `${event.time} - ${event.event_name}`;
            dayEl.appendChild(eventEl);
        });

        dayEl.addEventListener("click", () => {
            if (!isPastDate) {  // Prevent selecting past dates
                selectDate(dayEl, day);
            }
        });

        calendarGridEl.appendChild(dayEl);
    }
}


// Load events from CSV file
async function loadEvents() {
    const response = await fetch('events.csv');
    const csvText = await response.text();

    // Current date for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);  // Midnight to ignore time part

    events = csvText.split('\n').slice(1).map(line => {
        const [date, time, event_name, event_id] = line.split(',');

        return { 
            date, 
            time, 
            event_name, 
            event_id, 
            isPast: new Date(date) < today // Check if event date is in the past
        };
    });
}

// Populate event dropdown for a selected date
function selectDate(dayEl, day) {
    const selectedDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const filteredEvents = events.filter(event => event.date === selectedDate);

    // Clear previous selection
    if (selectedDayEl) {
        selectedDayEl.classList.remove("selected");
    }

    // Highlight the clicked day
    dayEl.classList.add("selected");
    selectedDayEl = dayEl;

    // Populate the event dropdown
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
        noEventOption.textContent = "No Excursions";
        eventDropdownEl.appendChild(noEventOption);
    }
}

// Redirect to reservation page with event ID as a parameter
reserveButton.addEventListener("click", () => {
    const selectedEventId = eventDropdownEl.value;

    if (selectedEventId && selectedDayEl) {
        // Parse the selected date manually to avoid time zone issues
        const selectedYear = currentYear;
        const selectedMonth = currentMonth; // Month is 0-based
        const selectedDay = parseInt(selectedDayEl.textContent, 10);

        // Create a new Date object using local time by setting year, month, and day directly
        const selectedEventDate = new Date(selectedYear, selectedMonth, selectedDay);
        // console.log(currentMonth)
        // console.log(currentYear)
        // console.log(selectedDayEl.textContent)
        console.log(selectedEventDate)
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to midnight for accurate comparison

        // Log dates to check for accuracy
        // console.log("Today's Date:", today);
        console.log("Selected Event Date:", selectedEventDate);
        console.log(selectedEventId)

        // Check if the selected date is strictly in the future
        if (selectedEventDate > today && selectedEventId != "No Excursions") {
            // Proceed if the date is in the future
            window.location.href = `reserve.html?event_id=${selectedEventId}`;
        } else if (selectedEventDate > today){
            alert("There are no tours on this day.");
        }else{
            // Block reservation if the date is today or in the past
            alert("You cannot reserve an event for today or a past date.");
        }
    }
});


// Load events and render the calendar
loadEvents().then(renderCalendar);
