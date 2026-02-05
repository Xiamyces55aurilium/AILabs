import { CATEGORIES, COMPONENTS, checkCompatibility, calculateStability } from './data.js';
import { createIcon, drawLayerVisuals, updateStabilityIndicator } from './graphics.js';

// State
let layers = []; // Array of { id, component, uniqueId }
let currentCategory = 'cells';

// DOM Elements
const libraryList = document.getElementById('component-list');
const libraryTabs = document.querySelectorAll('.tab-btn');
const dropZone = document.getElementById('drop-zone');
const feedbackArea = document.getElementById('feedback-area');

// Init
function init() {
    renderLibrary();
    setupTabs();
    setupDragDrop();
    updateStabilityIndicator(0.5); // Initial balance
}

// -------------------------------------------------------------
// Library
// -------------------------------------------------------------
function setupTabs() {
    libraryTabs.forEach(btn => {
        btn.addEventListener('click', () => {
            libraryTabs.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            renderLibrary();
        });
    });
}

function renderLibrary() {
    libraryList.innerHTML = '';
    const items = COMPONENTS.filter(c => c.category === currentCategory);

    items.forEach(comp => {
        const div = document.createElement('div');
        div.className = 'component-item';
        div.draggable = true;
        div.dataset.id = comp.id;

        // Icon
        const iconContainer = document.createElement('div');
        iconContainer.className = 'component-icon';
        iconContainer.appendChild(createIcon(comp));
        div.appendChild(iconContainer);

        // Info
        const info = document.createElement('div');
        info.className = 'component-info';
        info.innerHTML = `<h4>${comp.name}</h4><p>${comp.description}</p>`;
        div.appendChild(info);

        // Events
        div.addEventListener('dragstart', handleDragStart);

        libraryList.appendChild(div);
    });
}

// -------------------------------------------------------------
// Drag & Drop
// -------------------------------------------------------------
let draggedComponentId = null;

function handleDragStart(e) {
    draggedComponentId = this.dataset.id;
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('text/plain', draggedComponentId);

    // Create ghost image (optional, browser default is okay for now)
}

function setupDragDrop() {
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault(); // Allow drop
        e.dataTransfer.dropEffect = 'copy';
        dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        const id = e.dataTransfer.getData('text/plain');
        if (id) {
            addComponentToSketch(id);
        }
    });
}

// -------------------------------------------------------------
// Canvas Logic
// -------------------------------------------------------------
function addComponentToSketch(componentId) {
    const comp = COMPONENTS.find(c => c.id === componentId);
    if (!comp) return;

    // Check interaction with the top-most layer (visually top, which is last in our array if we stack upwards?)
    // Let's assume layers array order: [Index 0 = Bottom Layer, Index N = Top Layer]
    // UI displays Top Layer at the top. 
    // In DOM with flex-col-reverse:
    // Container
    //  -> Child 3 (Top)
    //  -> Child 2
    //  -> Child 1 (Bottom)

    const prevLayer = layers.length > 0 ? layers[layers.length - 1] : null;
    const compatibility = checkCompatibility(prevLayer, comp);

    const layerData = {
        uniqueId: Date.now(),
        component: comp,
        validity: compatibility
    };

    layers.push(layerData);

    renderLayers();
    updateFeedback(compatibility.text, compatibility.status);

    // Update stability
    const stability = calculateStability(layers);
    updateStabilityIndicator(stability);
}

function renderLayers() {
    const container = document.getElementById('drop-zone');
    container.innerHTML = ''; // Clear and redraw (simple for now)

    if (layers.length === 0) {
        container.innerHTML = '<div class="empty-state">Drag components here to start...</div>';
        return;
    }

    // Since we use flex-col-reverse, we append children in the order they appear in the array?
    // Wait. flex-direction: column-reverse means the *first child* is at the bottom.
    // So Array[0] (Bottom layer) should be the *first child* in DOM.
    // Array[N] (Top layer) should be the *last child* in DOM.
    // Then column-reverse puts Last Child at Top? 
    // Let's verify standard behavior:
    // col-reverse: items are laid out from bottom to top. 1, 2, 3 -> 1 is bottom, 3 is top.
    // So yes, I should append them in array order.

    layers.forEach((layer, index) => {
        const el = createLayerElement(layer, index);
        container.appendChild(el);
    });
}

function createLayerElement(layer, index) {
    const div = document.createElement('div');
    div.className = 'tissue-layer';
    div.style.zIndex = layers.length - index; // Ensure top layers visually stack nicely if overlapping

    // Background Container for RoughJS
    const bg = document.createElement('div');
    bg.className = 'tissue-layer-bg';
    div.appendChild(bg);

    // Call Graphics to draw pattern
    // Delay slightly to ensure layout? No, rough works on creates SVG.
    setTimeout(() => drawLayerVisuals(bg, layer.component), 0);

    // Content
    const content = document.createElement('div');
    content.className = 'tissue-content';

    const label = document.createElement('span');
    label.className = 'layer-label';
    label.innerText = layer.component.name;
    content.appendChild(label);

    div.appendChild(content);

    // Feedback visual
    // Green shading or Red hatch
    if (layer.validity.status === 'compatible') {
        div.style.backgroundColor = 'rgba(39, 174, 96, 0.1)'; // faint green
        div.style.border = '2px solid transparent';
    } else if (layer.validity.status === 'incompatible') {
        div.style.backgroundColor = 'rgba(192, 57, 43, 0.1)'; // faint red
        // Add red hatch pattern or dashed border
        div.style.backgroundImage = 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(192, 57, 43, 0.2) 10px, rgba(192, 57, 43, 0.2) 20px)';
        div.style.border = '2px dashed ' + 'rgba(192, 57, 43, 0.5)';
    } else {
        // Borderline
        div.style.backgroundColor = 'rgba(243, 156, 18, 0.1)';
        div.style.border = '2px dotted #f39c12';
    }

    return div;
}

function updateFeedback(msg, status) {
    feedbackArea.textContent = msg;
    feedbackArea.style.color = status === 'incompatible' ? 'red' : (status === 'borderline' ? '#d35400' : 'green');
    // Animate
    feedbackArea.animate([
        { opacity: 0, transform: 'translateY(10px)' },
        { opacity: 1, transform: 'translateY(0)' }
    ], { duration: 300, easing: 'ease-out' });
}

// Start
document.addEventListener('DOMContentLoaded', init);
