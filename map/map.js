const mapContainer = document.getElementById('mapContainer');
const mapWrapper = document.getElementById('mapWrapper');
const mapImage = document.getElementById('mapImage');
const zoomInBtn = document.getElementById('zoomIn');
const zoomOutBtn = document.getElementById('zoomOut');

let isDragging = false;
let currentX = 0;
let currentY = 0;
let initialX = 0;
let initialY = 0;
let xOffset = 0;
let yOffset = 0;
let scale = 1;

// Wait for image to load
mapImage.onload = function() {
    // Initial position at center
    centerImage();
};

function centerImage() {
    currentX = 0;
    currentY = 0;
    xOffset = 0;
    yOffset = 0;
    scale = 1;
    updateMapTransform();
}

function updateMapTransform() {
    mapWrapper.style.transform = `translate(-50%, -50%) translate(${currentX}px, ${currentY}px) scale(${scale})`;
}

function dragStart(e) {
    if (e.type === "mousedown") {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
    }
    isDragging = true;
}

function drag(e) {
    if (isDragging) {
        e.preventDefault();
        if (e.type === "mousemove") {
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
        }
        xOffset = currentX;
        yOffset = currentY;
        updateMapTransform();
    }
}

function dragEnd(e) {
    initialX = currentX;
    initialY = currentY;
    isDragging = false;
}

function handleWheel(e) {
    e.preventDefault();
    const delta = e.deltaY;
    const scaleChange = delta > 0 ? 0.9 : 1.1;
    const newScale = scale * scaleChange;

    // Limit zoom level
    if (newScale >= 1 && newScale <= 5) {
        // Get mouse position relative to container
        const rect = mapContainer.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Calculate new position to zoom towards mouse
        currentX = mouseX - (mouseX - currentX) * scaleChange;
        currentY = mouseY - (mouseY - currentY) * scaleChange;
        
        xOffset = currentX;
        yOffset = currentY;
        scale = newScale;
        updateMapTransform();
    }
}

function handleZoomClick(zoomIn) {
    const scaleChange = zoomIn ? 1.2 : 0.8;
    const newScale = scale * scaleChange;
    
    if (newScale >= 0.5 && newScale <= 10) {
        scale = newScale;
        updateMapTransform();
    }
}

// Event Listeners
mapContainer.addEventListener('mousedown', dragStart);
mapContainer.addEventListener('mousemove', drag);
mapContainer.addEventListener('mouseup', dragEnd);
mapContainer.addEventListener('mouseleave', dragEnd);
mapContainer.addEventListener('wheel', handleWheel, { passive: false });

zoomInBtn.addEventListener('click', () => handleZoomClick(true));
zoomOutBtn.addEventListener('click', () => handleZoomClick(false));

// Handle window resize
window.addEventListener('resize', centerImage);