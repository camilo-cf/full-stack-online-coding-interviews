/**
 * JavaScript Execution Worker
 * 
 * Runs user code in a separate thread (Web Worker).
 * - No access to DOM/localStorage/Cookies (Security).
 * - Custom console capture.
 * - Isolated scope.
 */

self.onmessage = (e) => {
  const { code } = e.data;
  const logs = [];

  // Custom console implementation
  const customConsole = {
    log: (...args) => {
      logs.push(args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' '));
    },
    error: (...args) => {
      logs.push(`Error: ${args.map(arg => String(arg)).join(' ')}`);
    },
    warn: (...args) => {
      logs.push(`Warning: ${args.map(arg => String(arg)).join(' ')}`);
    },
    info: (...args) => {
      logs.push(args.map(arg => String(arg)).join(' '));
    }
  };

  try {
    // Execute code
    // We use new Function to create a function body.
    // Note: global objects like 'self' are still accessible, but DOM/window are not.
    // 'use strict' prevents accidental global variable creation.
    const fn = new Function('console', `"use strict";\n${code}`);
    
    // Run it
    const result = fn(customConsole);
    
    let output = logs.join('\n');
    
    // Handle return value
    if (result !== undefined && logs.length === 0) {
      output = typeof result === 'object' 
        ? JSON.stringify(result, null, 2) 
        : String(result);
    }

    self.postMessage({ success: true, output: output || '(No output)' });
  } catch (err) {
    self.postMessage({ 
      success: false, 
      output: logs.join('\n'), // Return any logs before error
      error: `${err.name}: ${err.message}` 
    });
  }
};
