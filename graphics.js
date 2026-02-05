// Graphics module using Rough.js
// Assumes 'rough' is available globally via script tag

const ROUGH_OPTS_DEFAULT = { roughness: 2, bowing: 1.5, stroke: '#2c3e50', strokeWidth: 2 };

export function createIcon(component, width = 50, height = 50) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

    // Safety check just in case rough isn't loaded
    if (typeof rough === 'undefined') {
        console.error("RoughJS not loaded");
        return svg;
    }

    const rc = rough.svg(svg);
    const c = component;

    let node;

    // Drawing logic based on component type/shape
    if (c.category === 'cells') {
        const fillOpt = { fill: c.color, fillStyle: 'hachure', fillWeight: 3, hachureGap: 4, stroke: 'none' };

        if (c.shape === 'blob') {
            // Stem: Soft round blob
            node = rc.circle(width / 2, height / 2, width * 0.8, { ...ROUGH_OPTS_DEFAULT, ...fillOpt });
            svg.appendChild(node);
            // Nucleus
            svg.appendChild(rc.circle(width / 2 + 5, height / 2 - 5, 8, { fill: '#000', fillStyle: 'solid', stroke: 'none' }));
        }
        else if (c.shape === 'elongated') {
            // Fibroblast
            node = rc.ellipse(width / 2, height / 2, width * 0.9, height * 0.4, { ...ROUGH_OPTS_DEFAULT, ...fillOpt });
            svg.appendChild(node);
            svg.appendChild(rc.circle(width / 2, height / 2, 6, { fill: '#000', fillStyle: 'solid', stroke: 'none' }));
        }
        else if (c.shape === 'scribble') {
            // Endothelial: thin scribbles
            node = rc.path(`M 5,${height / 2} Q ${width / 4},${height / 4} ${width / 2},${height / 2} T ${width - 5},${height / 2}`, { ...ROUGH_OPTS_DEFAULT, stroke: c.color });
            svg.appendChild(node);
        }
        else {
            node = rc.circle(width / 2, height / 2, width * 0.6, { ...ROUGH_OPTS_DEFAULT, ...fillOpt });
            svg.appendChild(node);
        }
    }
    else if (c.category === 'scaffolds') {
        const opts = { stroke: '#555', strokeWidth: 1 };

        if (c.pattern === 'mesh') {
            // Cross hatch
            node = rc.rectangle(5, 5, width - 10, height - 10, { ...opts, fill: '#eee', fillStyle: 'cross-hatch' });
        } else if (c.pattern === 'bubbles') {
            node = rc.rectangle(5, 5, width - 10, height - 10, { ...opts, fill: '#eee', fillStyle: 'dots' });
        } else {
            node = rc.rectangle(5, 5, width - 10, height - 10, { ...opts, fill: '#eee', fillStyle: 'solid' });
        }
        svg.appendChild(node);
    }
    else if (c.category === 'growth-factors') {
        // Symbols
        if (c.id === 'vegf') { // Arrow
            node = rc.line(10, height / 2, width - 10, height / 2, { stroke: '#e67e22', strokeWidth: 3 });
            svg.appendChild(node);
            svg.appendChild(rc.line(width - 20, height / 2 - 10, width - 10, height / 2, { stroke: '#e67e22', strokeWidth: 3 }));
            svg.appendChild(rc.line(width - 20, height / 2 + 10, width - 10, height / 2, { stroke: '#e67e22', strokeWidth: 3 }));
        } else { // Spiral / Star
            node = rc.circle(width / 2, height / 2, width * 0.5, { stroke: '#9b59b6', strokeWidth: 3, roughness: 3 });
            svg.appendChild(node);
        }
    }

    return svg;
}

export function drawLayerVisuals(container, component, width, height) {
    // Draws the background pattern for a layer in the stack
    container.innerHTML = ''; // Clear
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%"); // SVG scales to container
    // We need pixel dimensions for rough.js to draw nicely, so we might need to measure container
    // or just assume a standard width for the pattern.

    // For simplicity, we just create a pattern that fits "roughly" or use viewBox
    svg.setAttribute("viewBox", `0 0 400 80`);
    svg.setAttribute("preserveAspectRatio", "none");

    const rc = rough.svg(svg);
    const opts = { stroke: 'none', fill: '#fff', fillStyle: 'hachure' };

    // Background color based on validity is handled by CSS (green/red overlays), 
    // here we draw the component texture.

    if (component.category === 'scaffolds') {
        if (component.pattern === 'mesh') {
            svg.appendChild(rc.rectangle(0, 0, 400, 80, { fill: '#ecf0f1', fillStyle: 'cross-hatch', stroke: '#bdc3c7', hachureAngle: 60, strokeWidth: 1 }));
        } else if (component.pattern === 'bubbles') {
            svg.appendChild(rc.rectangle(0, 0, 400, 80, { fill: '#ecf0f1', fillStyle: 'dots', stroke: '#bdc3c7', strokeWidth: 1 }));
        } else { // Polymer
            svg.appendChild(rc.rectangle(0, 0, 400, 80, { fill: '#ecf0f1', fillStyle: 'zigzag', stroke: '#bdc3c7', strokeWidth: 1 }));
        }
    } else if (component.category === 'cells') {
        // Draw many little blobs
        for (let i = 0; i < 8; i++) {
            const x = Math.random() * 350 + 20;
            const y = Math.random() * 50 + 15;
            const size = 20 + Math.random() * 10;
            const blob = rc.circle(x, y, size, { fill: component.color, fillStyle: 'solid', stroke: 'none', roughness: 2 });
            svg.appendChild(blob);
            // Nucleus
            svg.appendChild(rc.circle(x + 2, y - 2, 4, { fill: 'rgba(0,0,0,0.5)', fillStyle: 'solid', stroke: 'none' }));
        }
    }

    container.appendChild(svg);
}

export function updateStabilityIndicator(value) {
    // value 0 to 1. 0.5 is balanced.
    const div = document.getElementById('stability-indicator');
    if (!div) return;

    div.innerHTML = '';
    const w = 40; const h = 40;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", w);
    svg.setAttribute("height", h);
    const rc = rough.svg(svg);

    // Draw a scale
    // Base
    svg.appendChild(rc.line(10, 35, 30, 35, { strokeWidth: 2 }));
    svg.appendChild(rc.line(20, 35, 20, 10, { strokeWidth: 2 }));

    // Beam
    // Angle depends on value. 0.5 -> 0 deg. 0 -> -20 deg. 1 -> +20 deg.
    const angle = (value - 0.5) * 40; // max +/- 45 deg

    // Calculate beam ends based on angle
    // Center is 20, 10
    const rad = angle * Math.PI / 180;
    const len = 15;
    const x1 = 20 - Math.cos(rad) * len;
    const y1 = 10 + Math.sin(rad) * len; // y goes down
    const x2 = 20 + Math.cos(rad) * len;
    const y2 = 10 - Math.sin(rad) * len;

    svg.appendChild(rc.line(x1, y1, x2, y2, { stroke: value < 0.3 || value > 0.7 ? '#c0392b' : '#2c3e50', strokeWidth: 3 }));

    div.appendChild(svg);
}
