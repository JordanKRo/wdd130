// script.js
const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  
  let date = new Date();
  let currentMonth = date.getMonth();
  let currentYear = date.getFullYear();
  
  const monthNameEl = document.querySelector(".month-name");
  const calendarGridEl = document.querySelector(".calendar-grid");
  
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
  
      // Get the first day and number of days in the month
      const firstDay = new Date(currentYear, currentMonth, 1).getDay();
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
      // Fill initial empty cells for the start of the month
      for (let i = 0; i < firstDay; i++) {
          calendarGridEl.innerHTML += `<div></div>`;
      }
  
      // Fill the actual days
      for (let day = 1; day <= daysInMonth; day++) {
          const dayEl = document.createElement("div");
          dayEl.textContent = day;
  
          // Highlight today's date
          if (day === date.getDate() && currentMonth === date.getMonth() && currentYear === date.getFullYear()) {
              dayEl.classList.add("today");
          }
  
          calendarGridEl.appendChild(dayEl);
      }
  }
  
  renderCalendar();
  