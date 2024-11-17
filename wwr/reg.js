const groupPrice = 61.6;
const adultPrice = 81.32; // Price per adult
const childPrice = 60.32; // Price per child

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

    const lines = csvText.split('\n').map(line => line.trim()); // Trim each line
    const eventDetails = lines.slice(1).map(line => {
        const [date, time, event_name, event_id] = line.split(',').map(value => value.trim()); // Trim each value
        return { date, time, event_name, event_id };
    });

    const event = eventDetails.find(event => event.event_id === eventId);

    if (event) {
        const eventDate = new Date(event.date); // Parse the event's date
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Remove time portion for comparison

        if (eventDate <= today) {
            window.location.href = '/wwr/404.html';
            return;
        }
        const formattedDate = new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }).format(eventDate);

        document.getElementById('event-info').innerHTML = `
            <p><strong>Event Name:</strong> ${event.event_name}</p>
            <p><strong>Date:</strong> ${formattedDate}</p>
            <p><strong>Time:</strong> ${event.time}</p>
        `;
    } else {
        document.getElementById('event-info').innerHTML = '<p>Error: Event not found.</p>';
        window.location.href = '/wwr/404.html';
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
function calculateTotal() {
    const isGroup = document.querySelector('input[name="group"]:checked').value === 'yes';
    let subTotal = 0;

    if (isGroup) {
        const groupSize = parseInt(document.getElementById('group-size').value, 10) || 0;
        if (groupSize >= 12) {
            subTotal = groupPrice * groupSize
        } else {
            subTotal = 0; // Set to 0 if the group size is invalid
        }
    } else {
        const adults = parseInt(document.getElementById('adults').value, 10) || 0;
        const children = parseInt(document.getElementById('children').value, 10) || 0;
        subTotal = (adults * adultPrice) + (children * childPrice);
    }
    let tax = subTotal * .06
    let total = subTotal + tax
    document.getElementById('subtotal').textContent = subTotal > 0 
        ? `Subtotal: $${subTotal.toFixed(2)}` 
        : 'Please enter valid inputs.';
    document.getElementById('tax').textContent = subTotal > 0 
        ? `Tax: $${tax.toFixed(2)}` 
        : '';
    document.getElementById('total-price').textContent = subTotal > 0 
        ? `Total Price: $${total.toFixed(2)}`
        : '';
}


function attachAutoRecalculateListeners() {
    document.querySelectorAll('#reservation-form input').forEach(input => {
        input.addEventListener('input', calculateTotal);
        input.addEventListener('change', calculateTotal);
    });
}

// Load event details on page load
loadEventDetails();
attachAutoRecalculateListeners();