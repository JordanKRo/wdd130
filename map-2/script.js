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
        
        // Track initial image dimensions
        this.originalWidth = 0;
        this.originalHeight = 0;
        
        // Bind methods
        this.initializeImage();
        this.initEventListeners();
    }

    initializeImage() {
        // Ensure image is loaded before getting dimensions
        if (this.image.complete) {
            this.originalWidth = this.image.naturalWidth;
            this.originalHeight = this.image.naturalHeight;
        } else {
            this.image.onload = () => {
                this.originalWidth = this.image.naturalWidth;
                this.originalHeight = this.image.naturalHeight;
            };
        }
    }

    initEventListeners() {
        // Mouse events for panning
        let isDragging = false;
        let startX, startY;

        this.container.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX - this.translateX;
            startY = e.clientY - this.translateY;
            this.container.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            this.translateX = e.clientX - startX;
            this.translateY = e.clientY - startY;
            
            // Constrain panning within image bounds
            this.constrainPan();
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
                this.zoomIn();
            } else {
                this.zoomOut();
            }
        });

        // Prevent default drag behavior
        this.image.addEventListener('dragstart', (e) => e.preventDefault());
    }

    zoomIn() {
        this.scale = Math.min(this.scale + this.zoomStep, this.maxScale);
        this.constrainPan(); // Adjust pan after zooming
        this.updateTransform();
    }

    zoomOut() {
        this.scale = Math.max(this.scale - this.zoomStep, this.minScale);
        this.constrainPan(); // Adjust pan after zooming
        this.updateTransform();
    }

    resetZoom() {
        this.scale = 1;
        this.translateX = 0;
        this.translateY = 0;
        this.updateTransform();
    }

    constrainPan() {
        // If image is not zoomed, keep it centered
        if (this.scale <= 1) {
            this.translateX = 0;
            this.translateY = 0;
            return;
        }

        // Calculate scaled image dimensions
        const scaledWidth = this.originalWidth * this.scale;
        const scaledHeight = this.originalHeight * this.scale;

        // Calculate container dimensions
        const containerWidth = this.container.clientWidth;
        const containerHeight = this.container.clientHeight;

        // Calculate maximum translation limits
        const maxTranslateX = Math.abs((scaledWidth - containerWidth) / 2);
        const maxTranslateY = Math.abs((scaledHeight - containerHeight) / 2);

        // Constrain X translation
        this.translateX = Math.min(
            Math.max(this.translateX, -maxTranslateX), 
            maxTranslateX
        );

        // Constrain Y translation
        this.translateY = Math.min(
            Math.max(this.translateY, -maxTranslateY), 
            maxTranslateY
        );
    }

    updateTransform() {
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
    zoomInBtn.addEventListener('click', () => viewer.zoomIn());
    zoomOutBtn.addEventListener('click', () => viewer.zoomOut());
    zoomResetBtn.addEventListener('click', () => viewer.resetZoom());
});