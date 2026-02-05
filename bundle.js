/* data.js content */
const CATEGORIES = {
    CELLS: 'cells',
    SCAFFOLDS: 'scaffolds',
    FACTORS: 'growth-factors'
};

const COMPONENTS = [
    // --- CELLS ---
    {
        id: 'stem',
        name: 'Stem Cells (MSC)',
        category: CATEGORIES.CELLS,
        description: 'Multipotent stromal cells. Versatile.',
        shape: 'blob',
        color: '#3498db',
        wiki: 'https://en.wikipedia.org/wiki/Mesenchymal_stem_cell'
    },
    {
        id: 'fibroblast',
        name: 'Fibroblasts',
        category: CATEGORIES.CELLS,
        description: 'Synthesizes extracellular matrix.',
        shape: 'elongated',
        color: '#e67e22',
        wiki: 'https://en.wikipedia.org/wiki/Fibroblast'
    },
    {
        id: 'endothelial',
        name: 'Endothelial Cells',
        category: CATEGORIES.CELLS,
        description: 'Lining for blood vessels.',
        shape: 'scribble',
        color: '#e74c3c',
        wiki: 'https://en.wikipedia.org/wiki/Endothelium'
    },
    {
        id: 'cardiomyocyte',
        name: 'Cardiomyocytes',
        category: CATEGORIES.CELLS,
        description: 'Heart muscle cells.',
        shape: 'muscle',
        color: '#8e44ad',
        wiki: 'https://en.wikipedia.org/wiki/Cardiomyocyte'
    },
    {
        id: 'osteoblast',
        name: 'Osteoblasts',
        category: CATEGORIES.CELLS,
        description: 'Bone-forming cells.',
        shape: 'angular',
        color: '#f1c40f',
        wiki: 'https://en.wikipedia.org/wiki/Osteoblast'
    },
    {
        id: 'neuron',
        name: 'Neurons',
        category: CATEGORIES.CELLS,
        description: 'Nerve cells.',
        shape: 'star',
        color: '#2ecc71',
        wiki: 'https://en.wikipedia.org/wiki/Neuron'
    },

    // --- SCAFFOLDS ---
    {
        id: 'collagen',
        name: 'Collagen I',
        category: CATEGORIES.SCAFFOLDS,
        description: 'Natural protein mesh.',
        pattern: 'mesh',
        stiffness: 2,
        wiki: 'https://en.wikipedia.org/wiki/Collagen'
    },
    {
        id: 'alginate',
        name: 'Alginate Hydrogel',
        category: CATEGORIES.SCAFFOLDS,
        description: 'Seaweed-derived gel.',
        pattern: 'bubbles',
        stiffness: 3,
        wiki: 'https://en.wikipedia.org/wiki/Alginic_acid'
    },
    {
        id: 'polymer',
        name: 'PLA (Rigid)',
        category: CATEGORIES.SCAFFOLDS,
        description: 'Biodegradable thermoplastic.',
        pattern: 'hatch',
        stiffness: 8,
        wiki: 'https://en.wikipedia.org/wiki/Polylactic_acid'
    },
    {
        id: 'hydroxyapatite',
        name: 'Hydroxyapatite',
        category: CATEGORIES.SCAFFOLDS,
        description: 'Bone mineral.',
        pattern: 'stones',
        stiffness: 10,
        wiki: 'https://en.wikipedia.org/wiki/Hydroxyapatite'
    },

    // --- FACTORS ---
    {
        id: 'vegf',
        name: 'VEGF',
        category: CATEGORIES.FACTORS,
        description: 'Angiogenesis factor.',
        symbol: 'arrow',
        wiki: 'https://en.wikipedia.org/wiki/Vascular_endothelial_growth_factor'
    },
    {
        id: 'bmp2',
        name: 'BMP-2',
        category: CATEGORIES.FACTORS,
        description: 'Bone inducer.',
        symbol: 'starburst',
        wiki: 'https://en.wikipedia.org/wiki/Bone_morphogenetic_protein_2'
    },
    {
        id: 'ngf',
        name: 'NGF',
        category: CATEGORIES.FACTORS,
        description: 'Nerve growth factor.',
        symbol: 'lightning',
        wiki: 'https://en.wikipedia.org/wiki/Nerve_growth_factor'
    }
];

// Compatibility
function checkCompatibility(prevLayer, newComponent) {
    if (!prevLayer) return { status: 'compatible', text: 'Foundation set.' };
    const prevComp = prevLayer.component;
    const newComp = newComponent;

    // Simple logic checks
    if (newComp.category === CATEGORIES.FACTORS) return { status: 'compatible', text: 'Factor Added.' };

    if (prevComp.category === CATEGORIES.SCAFFOLDS && newComp.category === CATEGORIES.CELLS) {
        if (newComp.id === 'osteoblast' && prevComp.stiffness < 4) return { status: 'borderline', text: 'Too soft for bone.' };
        if (newComp.id === 'neuron' && prevComp.stiffness > 6) return { status: 'incompatible', text: 'Too hard for nerves.' };
        return { status: 'compatible', text: 'Good support.' };
    }

    if (prevComp.category === CATEGORIES.CELLS && newComp.category === CATEGORIES.SCAFFOLDS) return { status: 'compatible', text: 'Encapsulation.' };

    // Default
    return { status: 'compatible', text: 'Layer added.' };
}

function calculateStability(layers) {
    if (layers.length === 0) return 0.5;
    let s = 0; let l = 0;
    layers.forEach(item => {
        if (item.component.category === CATEGORIES.SCAFFOLDS) s += item.component.stiffness;
        if (item.component.category === CATEGORIES.CELLS) l += 1;
    });
    if (s === 0 && l > 0) return 0;
    return Math.min(1, Math.max(0, (s / (l * 2 + 1)) * 0.6 + 0.1));
}

// Generate Outcome Result
function generateOutcome(layers) {
    if (layers.length === 0) return { title: "Empty Dish", desc: "Nothing to report." };

    const cells = layers.filter(l => l.component.category === 'cells').map(l => l.component.id);
    const scaffolds = layers.filter(l => l.component.category === 'scaffolds').map(l => l.component.id);
    const factors = layers.filter(l => l.component.category === 'growth-factors').map(l => l.component.id);

    // Count specific types
    const hasBone = cells.includes('osteoblast');
    const hasNerve = cells.includes('neuron');
    const hasHeart = cells.includes('cardiomyocyte');
    const hasStem = cells.includes('stem');

    const isHard = scaffolds.some(s => ['hydroxyapatite', 'polymer'].includes(s));
    const isSoft = scaffolds.some(s => ['collagen', 'alginate'].includes(s));

    // Random modifiers
    const outcomeAdjectives = ["Promising", "Unstable", "Dense", "Fragile", "Unexpected", "Hybrid"];
    const randomAdj = outcomeAdjectives[Math.floor(Math.random() * outcomeAdjectives.length)];

    let title = "Undefined Aggregate";
    let desc = "The cells are confused. No clear structure emerged.";

    // Specific Logic
    if (hasBone && isHard) {
        title = "Calcified Osteoid";
        desc = "Success! The osteoblasts have begun mineralizing the matrix. Early bone formation detected.";
        if (factors.includes('bmp2')) desc += " BMP-2 accelerated the process significantly.";
    }
    else if (hasBone && isSoft) {
        title = "Fibrotic Clump";
        desc = "The matrix was too soft for proper bone signalling. Cells have de-differentiated.";
    }
    else if (hasNerve && isSoft) {
        title = "Neural Network";
        desc = "Neurites are extending through the soft hydrogel. Synaptic connections forming.";
        if (factors.includes('ngf')) desc += " NGF caused robust axon growth.";
    }
    else if (hasHeart && isSoft) {
        title = "Beating Tissue Patch";
        desc = "Spontaneous contractions observed. The tissue is alive!";
    }
    else if (hasStem && scaffolds.length > 0) {
        title = `${randomAdj} Stem Cluster`;
        desc = "The stem cells are differentiating based on local stiffness cues. Outcome uncertain but interesting.";
    }
    else if (scaffolds.length === 0 && cells.length > 0) {
        title = "Cell Pellet";
        desc = "Without a scaffold, the cells formed a tight ball and central necrosis is likely.";
    }
    else if (cells.length === 0) {
        title = "Empty Scaffold";
        desc = "A lonely piece of biomaterial floating in media.";
    }

    return { title, desc };
}


/* graphics.js content */
const ROUGH_OPTS_DEFAULT = { roughness: 2, bowing: 1.5, stroke: '#2c3e50', strokeWidth: 2 };

function createIcon(component, width = 50, height = 50) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);
    if (typeof rough === 'undefined') return svg;
    const rc = rough.svg(svg);
    const c = component;

    // Draw logic simplified for brevity but functional
    if (c.category === 'cells') {
        const fill = { fill: c.color, fillStyle: 'hachure', stroke: 'none' };
        if (c.shape === 'star') svg.appendChild(rc.polygon([[25, 5], [30, 20], [45, 25], [30, 30], [25, 45], [20, 30], [5, 25], [20, 20]], fill));
        else if (c.shape === 'angular') svg.appendChild(rc.rectangle(10, 10, 30, 30, fill));
        else svg.appendChild(rc.circle(25, 25, 30, fill));
    } else if (c.category === 'scaffolds') {
        const opts = { stroke: '#555', fill: '#eee', fillStyle: c.pattern === 'stones' ? 'solid' : 'cross-hatch' };
        svg.appendChild(rc.rectangle(5, 5, 40, 40, opts));
    } else {
        svg.appendChild(rc.circle(25, 25, 25, { stroke: 'purple', roughness: 3 }));
    }
    return svg;
}

function drawLayerVisuals(container, component) {
    container.innerHTML = '';
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%"); svg.setAttribute("height", "100%");
    svg.setAttribute("viewBox", "0 0 400 80"); svg.setAttribute("preserveAspectRatio", "none");
    if (typeof rough === 'undefined') return;
    const rc = rough.svg(svg);

    if (component.category === 'scaffolds') {
        svg.appendChild(rc.rectangle(0, 0, 400, 80, { fill: '#ecf0f1', fillStyle: 'cross-hatch', stroke: '#bdc3c7' }));
    } else if (component.category === 'cells') {
        for (let i = 0; i < 10; i++) {
            const x = Math.random() * 360 + 20; const y = Math.random() * 50 + 15;
            svg.appendChild(rc.circle(x, y, 20, { fill: component.color, stroke: 'none', fillStyle: 'solid' }));
        }
    }
    container.appendChild(svg);
}

function updateStabilityIndicator(value) {
    const div = document.getElementById('stability-indicator');
    if (!div) return;
    div.innerHTML = '';
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", 40); svg.setAttribute("height", 40);
    if (typeof rough === 'undefined') return;
    const rc = rough.svg(svg);
    svg.appendChild(rc.line(10, 35, 30, 35, { strokeWidth: 2 }));
    svg.appendChild(rc.line(20, 35, 20, 10, { strokeWidth: 2 }));
    const angle = (value - 0.5) * 50 * Math.PI / 180;
    const x1 = 20 - Math.cos(angle) * 15; const y1 = 10 + Math.sin(angle) * 15;
    const x2 = 20 + Math.cos(angle) * 15; const y2 = 10 - Math.sin(angle) * 15;
    svg.appendChild(rc.line(x1, y1, x2, y2, { stroke: value < 0.2 || value > 0.8 ? 'red' : '#2c3e50', strokeWidth: 3 }));
    div.appendChild(svg);
}


/* script.js */
let layers = [];
let currentCategory = 'cells';

function init() {
    const libraryList = document.getElementById('component-list');
    const libraryTabs = document.querySelectorAll('.tab-btn');
    const dropZone = document.getElementById('drop-zone');
    const feedbackArea = document.getElementById('feedback-area');

    // Add Incubate Button Area
    const ws = document.getElementById('workspace');
    if (!document.getElementById('incubate-area')) {
        const btnArea = document.createElement('div');
        btnArea.id = 'incubate-area';
        btnArea.style.cssText = "padding: 0 20px 20px; text-align: center;";

        const btn = document.createElement('button');
        btn.innerText = "🧪 Incubate & Analyze Mixture 🧪";
        btn.style.cssText = `
            background: #2c3e50; color: white; border: none; padding: 12px 24px;
            font-family: var(--font-heading); font-size: 1.2rem; cursor: pointer;
            border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px;
            box-shadow: 3px 3px 0 rgba(0,0,0,0.2); transition: all 0.2s;
        `;
        btn.onclick = showResult;
        btn.onmouseover = () => btn.style.transform = "scale(1.02) rotate(-1deg)";
        btn.onmouseout = () => btn.style.transform = "none";

        btnArea.appendChild(btn);
        ws.appendChild(btnArea); // Append to workspace
    }

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

            const icon = document.createElement('div');
            icon.className = 'component-icon';
            icon.appendChild(createIcon(comp));
            div.appendChild(icon);

            const info = document.createElement('div');
            info.className = 'component-info';
            info.innerHTML = `<h4><a href="${comp.wiki}" target="_blank" onclick="event.stopPropagation()">${comp.name} 🔗</a></h4><p>${comp.description}</p>`;
            div.appendChild(info);

            div.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', comp.id);
            });
            libraryList.appendChild(div);
        });
    }

    function setupDragDrop() {
        dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('drag-over'); });
        dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
            const id = e.dataTransfer.getData('text/plain');
            if (id) addComponent(id);
        });
    }

    function addComponent(id) {
        const comp = COMPONENTS.find(c => c.id === id);
        if (!comp) return;
        const prev = layers.length > 0 ? layers[layers.length - 1] : null;
        const check = checkCompatibility(prev, comp);

        layers.push({ uniqueId: Date.now() + Math.random(), component: comp, validity: check });
        renderLayers();
        updateStabilityIndicator(calculateStability(layers));
        updateFeedback(check.text, check.status);
    }

    window.removeLayer = function (uid) {
        const idx = layers.findIndex(l => l.uniqueId === uid);
        if (idx > -1) {
            layers.splice(idx, 1);
            renderLayers();
            updateStabilityIndicator(calculateStability(layers));
        }
    }

    function renderLayers() {
        dropZone.innerHTML = '';
        if (layers.length === 0) {
            dropZone.innerHTML = '<div class="empty-state">Drag components here...</div>';
            return;
        }
        layers.forEach((l, i) => {
            const el = document.createElement('div');
            el.className = 'tissue-layer';
            el.style.zIndex = layers.length - i;

            const bg = document.createElement('div');
            bg.className = 'tissue-layer-bg';
            setTimeout(() => drawLayerVisuals(bg, l.component), 0);
            el.appendChild(bg);

            const content = document.createElement('div');
            content.className = 'tissue-content';
            content.innerHTML = `<span class="layer-label">${l.component.name}</span>`;

            const del = document.createElement('button');
            del.innerText = '×';
            del.style.cssText = "background:none;border:none;color:red;font-size:1.5rem;cursor:pointer;pointer-events:all;";
            del.onclick = (e) => { e.stopPropagation(); window.removeLayer(l.uniqueId); };
            content.appendChild(del);
            el.appendChild(content);

            if (l.validity.status === 'incompatible') el.style.border = '2px dashed red';
            else if (l.validity.status === 'borderline') el.style.border = '2px dotted orange';

            dropZone.appendChild(el);
        });
    }

    function updateFeedback(msg, status) {
        feedbackArea.innerText = msg;
        feedbackArea.style.color = status === 'incompatible' ? 'red' : 'green';
    }

    // Modal Logic
    function showResult() {
        // create modal
        const existing = document.getElementById('result-modal');
        if (existing) existing.remove();

        const outcome = generateOutcome(layers);

        const modal = document.createElement('div');
        modal.id = 'result-modal';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.5); z-index: 2000;
            display: flex; justify-content: center; align-items: center;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: #fff; padding: 30px; width: 400px;
            border-radius: 10px; border: 3px solid #2c3e50;
            position: relative; box-shadow: 5px 5px 0 rgba(0,0,0,0.2);
            font-family: var(--font-heading);
            transform: rotate(1deg);
        `;

        content.innerHTML = `
            <h2 style="margin-top:0; border-bottom: 2px dashed #ccc; padding-bottom:10px;">🧪 Analysis Report</h2>
            <h3 style="color: #2980b9; margin-bottom: 5px;">${outcome.title}</h3>
            <p style="font-family: var(--font-body); font-size: 1.1rem; line-height: 1.4;">${outcome.desc}</p>
            <div style="margin-top: 20px; text-align: right;">
                <button id="close-modal" style="
                    background: #c0392b; color: white; border: none; padding: 8px 16px;
                    cursor: pointer; font-size: 1rem; border-radius: 4px;
                ">Close Notebook</button>
            </div>
        `;

        modal.appendChild(content);
        document.body.appendChild(modal);

        document.getElementById('close-modal').onclick = () => modal.remove();
    }

    renderLibrary();
    setupTabs();
    setupDragDrop();
    updateStabilityIndicator(0.5);
}

document.addEventListener('DOMContentLoaded', init);
