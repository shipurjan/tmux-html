/**
 * Layout structure:
 * - Pane (leaf): string
 * - Split (node): { columns: [...] } or { rows: [...] }
 *
 * Grid: 12×9
 */

/**
 * Calculate the maximum depth of a layout tree
 */
export function calculateDepth(node) {
  if (typeof node === 'string') {
    return 0; // Pane (leaf)
  }

  const children = node.columns || node.rows;
  if (!children || children.length === 0) {
    return 0;
  }

  const childDepths = children.map(child => calculateDepth(child));
  return 1 + Math.max(...childDepths);
}

/**
 * Get the split direction
 */
function getDirection(node) {
  if (typeof node === 'string') return null;
  if (node.columns) return 'columns';
  if (node.rows) return 'rows';
  return null;
}

/**
 * Flatten a layout tree to minimize depth
 */
export function flatten(node) {
  if (typeof node === 'string') {
    return node; // Pane - already minimal
  }

  const direction = getDirection(node);
  if (!direction) return node;

  const children = node[direction];

  // First, recursively flatten all children
  const flattenedChildren = children.map(child => flatten(child));

  // Merge same-direction children (collapse redundant nesting)
  const mergedChildren = [];
  for (const child of flattenedChildren) {
    if (typeof child === 'string') {
      mergedChildren.push(child);
    } else if (getDirection(child) === direction) {
      // Same direction - merge children up
      mergedChildren.push(...child[direction]);
    } else {
      mergedChildren.push(child);
    }
  }

  // Remove single-child containers
  if (mergedChildren.length === 1) {
    return mergedChildren[0];
  }

  return { [direction]: mergedChildren };
}

/**
 * Get all pane IDs from a layout (for verification)
 */
export function getPanes(node) {
  if (typeof node === 'string') {
    return [node];
  }

  const children = node.columns || node.rows || [];
  return children.flatMap(child => getPanes(child));
}

/**
 * Generate a layout with specific depth by alternating directions
 */
export function generateDeepLayout(targetDepth, panePrefix = 'p') {
  if (targetDepth === 0) {
    return `${panePrefix}`;
  }

  const direction = targetDepth % 2 === 1 ? 'columns' : 'rows';
  const numChildren = 2; // Binary splits

  const children = [];
  for (let i = 0; i < numChildren; i++) {
    children.push(generateDeepLayout(targetDepth - 1, `${panePrefix}_${i}`));
  }

  return { [direction]: children };
}

/**
 * Generate the "worst case" checkerboard layout (all 1×1 cells)
 */
export function generateCheckerboard() {
  const columns = [];
  let paneId = 0;

  for (let col = 0; col < 12; col++) {
    const rows = [];
    for (let row = 0; row < 9; row++) {
      rows.push(`p${paneId++}`);
    }
    columns.push({ rows });
  }

  return { columns };
}

/**
 * Generate a complex nested layout that requires deep alternation
 */
export function generateComplexLayout() {
  return {
    columns: [
      {
        rows: [
          { columns: ['A', 'B'] },
          { columns: ['C', 'D'] }
        ]
      },
      {
        rows: [
          { columns: ['E', 'F'] },
          { columns: ['G', 'H'] }
        ]
      }
    ]
  };
}

/**
 * Generate a layout that tests depth-4 necessity
 * This creates a pattern where you need:
 * cols -> rows -> cols -> rows -> panes
 */
export function generateDepth4TestLayout() {
  return {
    columns: [
      {
        rows: [
          {
            columns: [
              { rows: ['A', 'B'] },
              { rows: ['C', 'D'] }
            ]
          },
          'E'
        ]
      },
      'F'
    ]
  };
}

/**
 * Generate a pathological layout that might need depth-5
 */
export function generateDepth5TestLayout() {
  return {
    columns: [
      {
        rows: [
          {
            columns: [
              {
                rows: [
                  { columns: ['A', 'B'] },
                  'C'
                ]
              },
              'D'
            ]
          },
          'E'
        ]
      },
      'F'
    ]
  };
}

/**
 * Generate a random layout with controlled parameters
 * @param {number} maxDepth - Maximum depth to generate
 * @param {number} maxChildren - Maximum children per split
 * @param {number} paneCount - Track pane numbering
 */
export function generateRandomLayout(maxDepth = 5, maxChildren = 4, paneCount = { value: 0 }) {
  // Random chance to stop and create a pane
  const stopChance = 0.3 + (1 - maxDepth / 5) * 0.4; // Higher chance as depth decreases

  if (maxDepth === 0 || Math.random() < stopChance) {
    return `p${paneCount.value++}`;
  }

  // Randomly choose direction
  const direction = Math.random() < 0.5 ? 'columns' : 'rows';

  // Random number of children (2 to maxChildren)
  const numChildren = 2 + Math.floor(Math.random() * (maxChildren - 1));

  const children = [];
  for (let i = 0; i < numChildren; i++) {
    children.push(generateRandomLayout(maxDepth - 1, maxChildren, paneCount));
  }

  return { [direction]: children };
}

/**
 * Generate random layouts that respect 12×9 grid constraints
 * This ensures layouts could theoretically be rendered
 */
export function generateConstrainedRandomLayout(depth = 3) {
  const paneCount = { value: 0 };
  return generateRandomLayout(depth, 4, paneCount);
}
