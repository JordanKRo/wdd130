class PanZoomViewer {
    constructor(containerElement, imageElement) {
        this.container = containerElement;
        this.image = imageElement;

        // Initial state
        this.scale = 1;
        this.translateX = 0;
        this.translateY = 0;

        // Zoom and pan parameters
        this.minScale = 1;
        this.maxScale = 5;
        this.zoomStep = 0.2;

        // Bind methods
        this.initializeImage();
        this.initEventListeners();
    }

    initializeImage() {
        // Ensure image is loaded before getting dimensions
        const initDimensions = () => {
            // Store original image dimensions
            this.originalWidth = this.image.naturalWidth;
            this.originalHeight = this.image.naturalHeight;

            // Initially center the image
            this.centerImage();

            // Set initial image state
            this.updateTransform();
        };

        if (this.image.complete) {
            initDimensions();
        } else {
            this.image.onload = initDimensions;
        }
    }

    initEventListeners() {
        // Mouse events for panning
        let isDragging = false;
        let startX, startY;

        this.container.addEventListener('mousedown', (e) => {
            if (this.scale <= 1) return; // Prevent dragging when not zoomed

            isDragging = true;
            startX = e.clientX - this.translateX;
            startY = e.clientY - this.translateY;
            this.container.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            // Calculate new translation
            const newTranslateX = e.clientX - startX;
            const newTranslateY = e.clientY - startY;

            // Update and constrain translation
            this.translateX = this.constrainTranslate(
                newTranslateX,
                this.originalWidth * this.scale,
                this.container.clientWidth
            );

            this.translateY = this.constrainTranslate(
                newTranslateY,
                this.originalHeight * this.scale,
                this.container.clientHeight
            );

            this.updateTransform();
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            this.container.style.cursor = 'move';
        });

        // Scroll wheel zoom
        this.container.addEventListener('wheel', (e) => {
            e.preventDefault(); // Prevent page scroll

            // Determine zoom direction
            const delta = e.deltaY;
            if (delta < 0) {
                this.zoomIn(e);
            } else {
                this.zoomOut(e);
            }
        });

        // Prevent default drag behavior
        this.image.addEventListener('dragstart', (e) => e.preventDefault());
    }

    zoomIn(e) {
        // Zoom in on mouse position
        this.scale = Math.min(this.scale + this.zoomStep, this.maxScale);
        this.zoom(e);
    }

    zoomOut(e) {
        // Zoom out on mouse position
        this.scale = Math.max(this.scale - this.zoomStep, this.minScale);
        this.zoom(e);
    }

    zoom(e) {
        const rect = this.image.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;

        // Adjust the translation based on the zoom
        this.translateX -= (offsetX * this.zoomStep);
        this.translateY -= (offsetY * this.zoomStep);

        this.constrainPosition();
        this.updateTransform();
    }

    resetZoom() {
        this.scale = 1;
        this.translateX = 0;
        this.translateY = 0;
        this.updateTransform();
    }

    constrainTranslate(translate, scaledDimension, containerDimension) {
        // If scaled dimension is smaller than container, keep centered
        if (scaledDimension <= containerDimension) {
            return 0;
        }

        // Calculate max translation
        const maxTranslate = (scaledDimension - containerDimension) / 2;

        // Constrain translation
        return Math.min(
            Math.max(translate, -maxTranslate),
            maxTranslate
        );
    }

    constrainPosition() {
        // Constrain X and Y translations when scale changes
        if (this.scale <= 1) {
            this.translateX = 0;
            this.translateY = 0;
            return;
        }

        this.translateX = this.constrainTranslate(
            this.translateX,
            this.originalWidth * this.scale,
            this.container.clientWidth
        );

        this.translateY = this.constrainTranslate(
            this.translateY,
            this.originalHeight * this.scale,
            this.container.clientHeight
        );
    }

    centerImage() {
        // Center the image in the container initially
        const containerWidth = this.container.clientWidth;
        const containerHeight = this.container.clientHeight;
        const imageWidth = this.originalWidth;
        const imageHeight = this.originalHeight;

        // Calculate translate to center image
        this.translateX = (containerWidth - imageWidth) / 2;
        this.translateY = (containerHeight - imageHeight) / 2;
    }

    updateTransform() {
        // Use scale and translate to position the image with center as reference point
        this.image.style.transform = `translate(-50%, -50%) scale(${this.scale}) translate(${this.translateX}px, ${this.translateY}px)`;
    }
}

// Initialize the Pan and Zoom Viewer
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('panZoomContainer');
    const image = document.getElementById('zoomImage');
    const zoomInBtn = document.getElementById('zoomInBtn');
    const zoomOutBtn = document.getElementById('zoomOutBtn');
    const zoomResetBtn = document.getElementById('zoomResetBtn');

    const viewer = new PanZoomViewer(container, image);

    // Add zoom control event listeners
    zoomInBtn.addEventListener('click', () => viewer.zoomIn(event));
    zoomOutBtn.addEventListener('click', () => viewer.zoomOut(event));
    zoomResetBtn.addEventListener('click', () => viewer.resetZoom());
});
