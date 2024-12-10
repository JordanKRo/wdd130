
class PanZoomViewer {
    constructor(containerElement, imageElement) {
        this.container = containerElement;
        this.image = imageElement;
        
        // Simple state
        this.translateX = 0;
        this.translateY = 0;
        this.max_scale = 3;

        // Calculate minimum scale to ensure image fills either width or height
        this.calculateMinScale();
        this.scale = this.min_scale;  // Start at minimum scale
        
        this.initEventListeners();
        this.updateTransform();
    }

    calculateMinScale() {
        // Calculate ratios of container to image dimensions
        const containerRatio = this.container.clientWidth / this.container.clientHeight;
        const imageRatio = this.image.width / this.image.height;

        if (containerRatio > imageRatio) {
            // Container is wider relative to image - fit to height
            this.min_scale = this.container.clientHeight / this.image.height;
        } else {
            // Container is taller relative to image - fit to width
            this.min_scale = this.container.clientWidth / this.image.width;
        }

        // Add a small buffer (e.g., 10%) to ensure full coverage
        this.min_scale *= 1.11;
    }

    initEventListeners() {
        let isDragging = false;
        let lastX = 0;
        let lastY = 0;

        // Mouse down - start dragging
        this.container.addEventListener('mousedown', (e) => {
            isDragging = true;
            lastX = e.clientX;
            lastY = e.clientY;
            this.container.style.cursor = 'grabbing';
        });

        window.addEventListener('resize', () => {
            this.calculateMinScale()

            if(this.scale <= this.min_scale){
                this.scale = this.min_scale
                this.updateTransform();
            }
        });

        // Mouse move - update position
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const deltaX = e.clientX - lastX;
            const deltaY = e.clientY - lastY;
            lastX = e.clientX;
            lastY = e.clientY;

            this.translateX += deltaX;
            this.translateY += deltaY;

            this.updateTransform();
        });

        // Mouse up - stop dragging
        document.addEventListener('mouseup', () => {
            isDragging = false;
            this.container.style.cursor = 'move';
        });

        // Wheel zoom
        this.container.addEventListener('wheel', (e) => {
            e.preventDefault();

            // Get mouse position relative to container center
            const rect = this.container.getBoundingClientRect();
            const mouseX = e.clientX - rect.left - this.container.clientWidth / 2;
            const mouseY = e.clientY - rect.top - this.container.clientHeight / 2;

            const oldScale = this.scale;

            if (e.deltaY < 0) {
                this.zoomIn()
            } else {
                this.zoomOut()
            }

            // zoom toward mouse
            const scaleFactor = this.scale / oldScale;
            this.translateX = mouseX * (1 - scaleFactor) + this.translateX * scaleFactor;
            this.translateY = mouseY * (1 - scaleFactor) + this.translateY * scaleFactor;

            this.updateTransform();
        });

        // Prevent default drag behavior
        this.image.addEventListener('dragstart', (e) => e.preventDefault());
    }

    zoomIn() {
        
        if(this.scale >= this.max_scale){
            this.scale = this.max_scale
        }else{
            this.scale *= 1.1;
        }
        this.updateTransform();
    }

    zoomOut() {
        
        if(this.scale / 1.1 <= this.min_scale){
            this.scale = this.min_scale
        }else{
            this.scale /= 1.1;
        }
        this.updateTransform();
    }

    resetZoom() {
        this.scale = .5;
        this.translateX = 0;
        this.translateY = 0;
        this.updateTransform();
    }

    updateTransform() {
        this.calculateMinScale();
        // Calculate the scaled dimensions
        const scaledImageWidth = this.image.width * this.scale;
        const scaledImageHeight = this.image.height * this.scale;
        const containerWidth = this.container.clientWidth;
        const containerHeight = this.container.clientHeight;
        
        // Calculate maximum translations for both axes
        const maxTranslateX = (scaledImageWidth - containerWidth) / 2;
        const maxTranslateY = (scaledImageHeight - containerHeight) / 2;
        
        // Constrain X translation
        if (Math.abs(this.translateX) > maxTranslateX) {
            this.translateX = Math.sign(this.translateX) * maxTranslateX;
        }
        
        // Constrain Y translation
        if (Math.abs(this.translateY) > maxTranslateY) {
            this.translateY = Math.sign(this.translateY) * maxTranslateY;
        }

        // Apply transform
        const transform = `translate(-50%, -50%) scale(${this.scale}) translate(${this.translateX / this.scale}px, ${this.translateY / this.scale}px)`;
        this.image.style.transform = transform;
    }
}

// Initialize viewer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('panZoomContainer');
    const image = document.getElementById('zoomImage');
    const viewer = new PanZoomViewer(container, image);

    // Button controls
    document.getElementById('zoomInBtn').onclick = () => viewer.zoomIn();
    document.getElementById('zoomOutBtn').onclick = () => viewer.zoomOut();
    // document.getElementById('zoomResetBtn').onclick = () => viewer.resetZoom();
});