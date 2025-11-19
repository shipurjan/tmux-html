import { describe, it, expect } from 'vitest';
import {
  calculateDepth,
  flatten,
  getPanes,
  generateDeepLayout,
  generateCheckerboard,
  generateComplexLayout,
  generateDepth4TestLayout,
  generateDepth5TestLayout,
  generateRandomLayout,
  generateConstrainedRandomLayout
} from './flatten.js';

describe('Depth Calculation', () => {
  it('should calculate depth 0 for a single pane', () => {
    expect(calculateDepth('A')).toBe(0);
  });

  it('should calculate depth 1 for a simple split', () => {
    const layout = { columns: ['A', 'B'] };
    expect(calculateDepth(layout)).toBe(1);
  });

  it('should calculate depth 2 for nested splits', () => {
    const layout = {
      columns: [
        { rows: ['A', 'B'] },
        'C'
      ]
    };
    expect(calculateDepth(layout)).toBe(2);
  });

  it('should calculate depth 3 for triple-nested splits', () => {
    const layout = {
      columns: [
        {
          rows: [
            { columns: ['A', 'B'] },
            'C'
          ]
        },
        'D'
      ]
    };
    expect(calculateDepth(layout)).toBe(3);
  });

  it('should calculate depth 4 for quad-nested splits', () => {
    const layout = {
      columns: [
        {
          rows: [
            {
              columns: [
                { rows: ['A', 'B'] },
                'C'
              ]
            },
            'D'
          ]
        },
        'E'
      ]
    };
    expect(calculateDepth(layout)).toBe(4);
  });
});

describe('Flatten Function', () => {
  it('should not modify a single pane', () => {
    expect(flatten('A')).toBe('A');
  });

  it('should not modify a simple split', () => {
    const layout = { columns: ['A', 'B'] };
    expect(flatten(layout)).toEqual(layout);
  });

  it('should remove single-child containers', () => {
    const layout = {
      columns: [
        { rows: ['A'] }
      ]
    };
    expect(flatten(layout)).toBe('A');
  });

  it('should merge same-direction children', () => {
    const layout = {
      columns: [
        { columns: ['A', 'B'] },
        'C'
      ]
    };
    const flattened = flatten(layout);
    expect(flattened).toEqual({ columns: ['A', 'B', 'C'] });
    expect(calculateDepth(flattened)).toBe(1);
  });

  it('should preserve panes after flattening', () => {
    const layout = {
      columns: [
        { columns: ['A', 'B'] },
        { columns: ['C', 'D'] }
      ]
    };
    const original = getPanes(layout).sort();
    const flattened = flatten(layout);
    const after = getPanes(flattened).sort();
    expect(after).toEqual(original);
  });

  it('should flatten nested same-direction splits', () => {
    const layout = {
      rows: [
        { rows: [{ rows: ['A', 'B'] }, 'C'] },
        'D'
      ]
    };
    const flattened = flatten(layout);
    expect(flattened).toEqual({ rows: ['A', 'B', 'C', 'D'] });
    expect(calculateDepth(flattened)).toBe(1);
  });
});

describe('Generated Layouts', () => {
  it('should generate layout with target depth', () => {
    const layout = generateDeepLayout(4);
    expect(calculateDepth(layout)).toBe(4);
  });

  it('should flatten artificially deep layouts', () => {
    const layout = generateDeepLayout(6);
    expect(calculateDepth(layout)).toBe(6);

    const flattened = flatten(layout);
    const flattenedDepth = calculateDepth(flattened);

    console.log('Original depth:', 6);
    console.log('Flattened depth:', flattenedDepth);

    expect(flattenedDepth).toBeLessThan(6);
  });

  it('checkerboard (12×9 all 1×1) should be depth 2', () => {
    const layout = generateCheckerboard();
    const depth = calculateDepth(layout);
    console.log('Checkerboard depth:', depth);
    expect(depth).toBe(2);
  });

  it('complex layout should be depth 3', () => {
    const layout = generateComplexLayout();
    const depth = calculateDepth(layout);
    console.log('Complex layout depth:', depth);
    expect(depth).toBe(3);
  });

  it('depth-4 test layout should be depth 4', () => {
    const layout = generateDepth4TestLayout();
    const depth = calculateDepth(layout);
    console.log('Depth-4 test layout depth:', depth);
    expect(depth).toBe(4);
  });

  it('depth-5 test layout should be depth 5', () => {
    const layout = generateDepth5TestLayout();
    const depth = calculateDepth(layout);
    console.log('Depth-5 test layout depth:', depth);
    expect(depth).toBe(5);
  });
});

describe('Flatten to Minimum Depth', () => {
  it('should flatten depth-4 layout optimally', () => {
    const layout = generateDepth4TestLayout();
    const flattened = flatten(layout);
    const depth = calculateDepth(flattened);

    console.log('Depth-4 layout before flatten:', calculateDepth(layout));
    console.log('Depth-4 layout after flatten:', depth);
    console.log('Flattened structure:', JSON.stringify(flattened, null, 2));

    // Verify panes are preserved
    expect(getPanes(flattened).sort()).toEqual(getPanes(layout).sort());

    // Check if it can be reduced
    expect(depth).toBeLessThanOrEqual(4);
  });

  it('should flatten depth-5 layout optimally', () => {
    const layout = generateDepth5TestLayout();
    const flattened = flatten(layout);
    const depth = calculateDepth(flattened);

    console.log('Depth-5 layout before flatten:', calculateDepth(layout));
    console.log('Depth-5 layout after flatten:', depth);
    console.log('Flattened structure:', JSON.stringify(flattened, null, 2));

    // Verify panes are preserved
    expect(getPanes(flattened).sort()).toEqual(getPanes(layout).sort());

    // This is the key test: can we ALWAYS flatten to depth-4 or less?
    console.log('CAN FLATTEN TO DEPTH-4 OR LESS:', depth <= 4);
  });

  it('should test if depth-4 is sufficient for arbitrary layouts', () => {
    // Generate multiple random-ish complex layouts
    const testLayouts = [
      generateDepth4TestLayout(),
      generateDepth5TestLayout(),
      generateComplexLayout(),
      generateCheckerboard(),
      // Add more test cases
      {
        columns: [
          {
            rows: [
              { columns: [{ rows: ['A', 'B'] }, 'C'] },
              'D'
            ]
          },
          {
            rows: [
              { columns: ['E', 'F'] },
              'G'
            ]
          }
        ]
      }
    ];

    const results = testLayouts.map(layout => {
      const original = calculateDepth(layout);
      const flattened = flatten(layout);
      const final = calculateDepth(flattened);
      return { original, final };
    });

    console.log('\n=== Depth Analysis Results ===');
    results.forEach((r, i) => {
      console.log(`Layout ${i}: ${r.original} -> ${r.final}`);
    });

    const maxFinalDepth = Math.max(...results.map(r => r.final));
    console.log(`\nMaximum depth after flattening: ${maxFinalDepth}`);
    console.log(`Is depth-4 sufficient? ${maxFinalDepth <= 4}`);
    console.log(`Is depth-3 sufficient? ${maxFinalDepth <= 3}`);
  });
});

describe('Edge Cases', () => {
  it('should handle empty splits gracefully', () => {
    const layout = { columns: [] };
    expect(calculateDepth(layout)).toBe(0);
  });

  it('should handle layouts with many siblings', () => {
    const layout = {
      columns: [
        { rows: ['A', 'B', 'C'] },
        { rows: ['D', 'E', 'F'] },
        { rows: ['G', 'H', 'I'] },
        { rows: ['J', 'K', 'L'] }
      ]
    };
    expect(calculateDepth(layout)).toBe(2);
    const flattened = flatten(layout);
    expect(calculateDepth(flattened)).toBe(2);
    expect(getPanes(flattened)).toHaveLength(12);
  });

  it('should handle deeply nested single paths', () => {
    const layout = {
      columns: [{
        rows: [{
          columns: [{
            rows: [{
              columns: ['A']
            }]
          }]
        }]
      }]
    };

    const flattened = flatten(layout);
    expect(flattened).toBe('A');
    expect(calculateDepth(flattened)).toBe(0);
  });
});

describe('Random Layout Statistics', () => {
  it('should generate and analyze 10000 random layouts', () => {
    const numLayouts = 10000;
    const stats = {
      originalDepths: {},
      flattenedDepths: {},
      reductions: [],
      maxOriginal: 0,
      maxFlattened: 0
    };

    for (let i = 0; i < numLayouts; i++) {
      // Generate random layout with max depth 8
      const layout = generateRandomLayout(8, 4, { value: 0 });
      const originalDepth = calculateDepth(layout);
      const flattened = flatten(layout);
      const flattenedDepth = calculateDepth(flattened);

      // Track statistics
      stats.originalDepths[originalDepth] = (stats.originalDepths[originalDepth] || 0) + 1;
      stats.flattenedDepths[flattenedDepth] = (stats.flattenedDepths[flattenedDepth] || 0) + 1;
      stats.reductions.push(originalDepth - flattenedDepth);
      stats.maxOriginal = Math.max(stats.maxOriginal, originalDepth);
      stats.maxFlattened = Math.max(stats.maxFlattened, flattenedDepth);
    }

    console.log('\n=== RANDOM LAYOUT STATISTICS (10,000 layouts) ===\n');
    console.log('Original Depth Distribution:');
    Object.keys(stats.originalDepths).sort((a, b) => a - b).forEach(depth => {
      const count = stats.originalDepths[depth];
      const pct = (count / numLayouts * 100).toFixed(1);
      console.log(`  Depth ${depth}: ${count} (${pct}%)`);
    });

    console.log('\nFlattened Depth Distribution:');
    Object.keys(stats.flattenedDepths).sort((a, b) => a - b).forEach(depth => {
      const count = stats.flattenedDepths[depth];
      const pct = (count / numLayouts * 100).toFixed(1);
      console.log(`  Depth ${depth}: ${count} (${pct}%)`);
    });

    console.log(`\nMax original depth: ${stats.maxOriginal}`);
    console.log(`Max flattened depth: ${stats.maxFlattened}`);

    const avgReduction = stats.reductions.reduce((a, b) => a + b, 0) / numLayouts;
    console.log(`Average depth reduction: ${avgReduction.toFixed(2)}`);

    const depth3Count = stats.flattenedDepths[3] || 0;
    const depth4Count = stats.flattenedDepths[4] || 0;
    const depth5Count = stats.flattenedDepths[5] || 0;
    const depth3OrLess = Object.keys(stats.flattenedDepths)
      .filter(d => parseInt(d) <= 3)
      .reduce((sum, d) => sum + stats.flattenedDepths[d], 0);
    const depth4OrLess = Object.keys(stats.flattenedDepths)
      .filter(d => parseInt(d) <= 4)
      .reduce((sum, d) => sum + stats.flattenedDepths[d], 0);

    console.log(`\nLayouts flattened to depth ≤3: ${depth3OrLess} (${(depth3OrLess / numLayouts * 100).toFixed(1)}%)`);
    console.log(`Layouts flattened to depth ≤4: ${depth4OrLess} (${(depth4OrLess / numLayouts * 100).toFixed(1)}%)`);

    console.log('\n=== CONCLUSION ===');
    if (stats.maxFlattened <= 3) {
      console.log('✓ ALL layouts can be flattened to depth-3 or less!');
    } else if (stats.maxFlattened <= 4) {
      console.log('✓ ALL layouts can be flattened to depth-4 or less!');
    } else if (stats.maxFlattened <= 5) {
      console.log('⚠ Some layouts require depth-5 after flattening');
    } else {
      console.log('⚠ Some layouts require depth-6+ after flattening');
    }

    console.log(`\nIs depth-3 sufficient? ${stats.maxFlattened <= 3 ? 'YES' : 'NO'}`);
    console.log(`Is depth-4 sufficient? ${stats.maxFlattened <= 4 ? 'YES' : 'NO'}`);
    console.log(`Is depth-5 sufficient? ${stats.maxFlattened <= 5 ? 'YES' : 'NO'}`);

    // The test passes if we have meaningful data
    expect(stats.maxOriginal).toBeGreaterThan(0);
    expect(stats.maxFlattened).toBeGreaterThan(0);
  });

  it('should test extreme depth layouts (depth 10+)', () => {
    const extremeLayouts = [];
    for (let depth = 6; depth <= 12; depth++) {
      const layout = generateDeepLayout(depth);
      extremeLayouts.push({ depth, layout });
    }

    console.log('\n=== EXTREME DEPTH LAYOUTS ===\n');

    extremeLayouts.forEach(({ depth, layout }) => {
      const flattened = flatten(layout);
      const flattenedDepth = calculateDepth(flattened);
      console.log(`Original depth ${depth} → Flattened depth ${flattenedDepth}`);
    });

    const maxFlattenedExtreme = Math.max(...extremeLayouts.map(({ layout }) => {
      return calculateDepth(flatten(layout));
    }));

    console.log(`\nMax flattened depth from extreme layouts: ${maxFlattenedExtreme}`);
    console.log(`Can extreme layouts flatten to depth-4? ${maxFlattenedExtreme <= 4 ? 'YES' : 'NO'}`);
  });
});
