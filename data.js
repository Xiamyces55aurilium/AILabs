export const CATEGORIES = {
    CELLS: 'cells',
    SCAFFOLDS: 'scaffolds',
    FACTORS: 'growth-factors'
};

export const COMPONENTS = [
    // Cells
    {
        id: 'stem',
        name: 'Stem Cells',
        category: CATEGORIES.CELLS,
        description: 'Undifferentiated cells. Versatile starter.',
        shape: 'blob', // Logic for roughjs
        color: '#3498db'
    },
    {
        id: 'fibroblast',
        name: 'Fibroblasts',
        category: CATEGORIES.CELLS,
        description: 'Connective tissue builders.',
        shape: 'elongated',
        color: '#e67e22'
    },
    {
        id: 'endothelial',
        name: 'Endothelial',
        category: CATEGORIES.CELLS,
        description: 'Lining for blood vessels.',
        shape: 'scribble',
        color: '#e74c3c'
    },
    {
        id: 'cardiomyocyte',
        name: 'Cardio Cells',
        category: CATEGORIES.CELLS,
        description: 'Muscle cells that beat.',
        shape: 'muscle',
        color: '#8e44ad'
    },

    // Scaffolds
    {
        id: 'collagen',
        name: 'Collagen Gel',
        category: CATEGORIES.SCAFFOLDS,
        description: 'Soft, natural protein mesh.',
        pattern: 'mesh',
        stiffness: 2 // Low
    },
    {
        id: 'alginate',
        name: 'Alginate',
        category: CATEGORIES.SCAFFOLDS,
        description: 'Algae-based hydrogel.',
        pattern: 'bubbles',
        stiffness: 3
    },
    {
        id: 'polymer',
        name: 'Synthetics (PLA)',
        category: CATEGORIES.SCAFFOLDS,
        description: 'Rigid polymer structure.',
        pattern: 'hatch',
        stiffness: 8 // High
    },

    // Factors
    {
        id: 'vegf',
        name: 'VEGF',
        category: CATEGORIES.FACTORS,
        description: 'Vascular growth factor.',
        symbol: 'arrow'
    },
    {
        id: 'tgf',
        name: 'TGF-Beta',
        category: CATEGORIES.FACTORS,
        description: 'Transforming growth factor.',
        symbol: 'spiral'
    }
];

// Compatibility Matrix / Rules
// Returns: 'compatible' (green), 'borderline' (amber), 'incompatible' (red)
// text: Message for the user
export function checkCompatibility(prevLayer, newComponent) {
    if (!prevLayer) {
        // First layer rules
        if (newComponent.category === CATEGORIES.SCAFFOLDS) return { status: 'compatible', text: 'Scaffold interaction with dish OK.' };
        if (newComponent.category === CATEGORIES.CELLS) return { status: 'borderline', text: 'Cells need a scaffold to adhere properly.' };
        return { status: 'incompatible', text: 'Growth factors wash away without a matrix.' };
    }

    const prevComp = prevLayer.component;

    // Factors: Always adaptable but need cells/scaffold to bind
    if (newComponent.category === CATEGORIES.FACTORS) {
        return { status: 'compatible', text: 'Factor infused into layer.' };
    }

    // Scaffolds on Scaffolds -> Layering materials
    if (prevComp.category === CATEGORIES.SCAFFOLDS && newComponent.category === CATEGORIES.SCAFFOLDS) {
        if (prevComp.id === newComponent.id) return { status: 'compatible', text: 'Layer thickening.' };
        return { status: 'borderline', text: 'Interface between different materials may be weak.' };
    }

    // Cells on Scaffolds -> The Core Logic
    if (prevComp.category === CATEGORIES.SCAFFOLDS && newComponent.category === CATEGORIES.CELLS) {
        // Specific interactions
        if (newComponent.id === 'endothelial' && prevComp.id === 'polymer') {
            return { status: 'incompatible', text: 'Surface too rigid for endothelial spreading.' };
        }
        if (newComponent.id === 'cardiomyocyte' && prevComp.stiffness > 5) {
            return { status: 'borderline', text: 'Scaffold slightly too stiff for beating.' };
        }
        return { status: 'compatible', text: 'Good adhesion.' };
    }

    // Scaffold on Cells -> Encapsulation
    if (prevComp.category === CATEGORIES.CELLS && newComponent.category === CATEGORIES.SCAFFOLDS) {
        return { status: 'compatible', text: 'Cells encapsulated.' };
    }

    // Cells on Cells -> Cell Sheets
    if (prevComp.category === CATEGORIES.CELLS && newComponent.category === CATEGORIES.CELLS) {
        if (prevComp.id === newComponent.id) return { status: 'compatible', text: 'Tissue density increasing.' };
        return { status: 'borderline', text: 'Mixed cell population requires careful signaling.' };
    }

    return { status: 'compatible', text: 'Standard interaction.' };
}

export function calculateStability(layers) {
    if (layers.length === 0) return 0.5; // Balanced

    // Logic: 
    // Too many cells, not enough scaffold -> Unstable
    // Too stiff -> Rigid but stable (maybe brittle)

    let support = 0;
    let load = 0;

    layers.forEach(l => {
        const c = l.component;
        if (c.category === CATEGORIES.SCAFFOLDS) {
            support += (c.stiffness || 5);
        } else if (c.category === CATEGORIES.CELLS) {
            load += 1;
            // Cells provide a little structure if dense, but mostly load
            support += 0.5;
        }
    });

    if (support === 0 && load > 0) return 0; // Collapsed

    // Ideal ratio: Support should support the load
    const ratio = support / (load * 2 + 1); // +1 to avoid div0

    // Normalize to 0-1 range where 0.5 is balanced
    // Ratio 1.0 is very stiff. Ratio 0.1 is very weak.

    // Clamp
    const outcome = Math.min(1, Math.max(0, ratio * 0.5));
    return outcome;
}
