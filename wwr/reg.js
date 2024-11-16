const groupPrice = 100; // Flat rate for groups of 12 or more
const adultPrice = 15; // Price per adult
const childPrice = 10; // Price per child

// Load the event details from the CSV file based on the event_id in the URL
async function loadEventDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('event_id');

    if (!eventId) {
        document.getElementById('event-info').innerHTML = '<p>Error: No event selected.</p>';
        return;
    }

    const response = await fetch('events.csv');
    const csvText = await response.text();
    const events = csvText.split('\n').slice(1).map(line => {
        const [date, time, event_name, id] = line.split(',');
        return { date, time, event_name, event_id: id };
    });
    console.log(events[7])

    const event = events.find(e => e.event_id === eventId);

    if (event) {
        document.getElementById('event-info').innerHTML = `
            <p><strong>Event Name:</strong> ${event.event_name}</p>
            <p><strong>Date:</strong> ${event.date}</p>
            <p><strong>Time:</strong> ${event.time}</p>
        `;
    } else {
        document.getElementById('event-info').innerHTML = '<p>Error: Event not found.</p>';
    }
}

// Show/hide sections based on group selection
document.querySelectorAll('input[name="group"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        if (e.target.value === 'yes') {
            document.getElementById('group-size-section').style.display = 'block';
            document.getElementById('individual-section').style.display = 'none';
        } else {
            document.getElementById('group-size-section').style.display = 'none';
            document.getElementById('individual-section').style.display = 'block';
        }
    });
});

// Calculate total cost
document.getElementById('calculate-button').addEventListener('click', () => {
    const isGroup = document.querySelector('input[name="group"]:checked').value === 'yes';
    let total = 0;

    if (isGroup) {
        const groupSize = parseInt(document.getElementById('group-size').value, 10);
        if (groupSize >= 12) {
            total = groupPrice * Math.ceil(groupSize / 12); // Adjust group price based on multiple groups
        } else {
            alert("Group size must be 12 or more!");
            return;
        }
    } else {
        const adults = parseInt(document.getElementById('adults').value, 10);
        const children = parseInt(document.getElementById('children').value, 10);
        total = (adults * adultPrice) + (children * childPrice);
    }

    document.getElementById('total-price').textContent = `Total Price: $${total}`;
});

function attachAutoRecalculateListeners() {
    document.querySelectorAll('#reservation-form input').forEach(input => {
        input.addEventListener('input', calculateTotal);
        input.addEventListener('change', calculateTotal);
    });
}

// Load event details on page load
loadEventDetails();
attachAutoRecalculateListeners();