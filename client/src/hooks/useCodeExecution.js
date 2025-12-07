/**
 * useCodeExecution Hook
 * 
 * Handles client-side code execution for JavaScript and Python.
 * - JavaScript: Executed using sandboxed Function wrapper
 * - Python: Executed using Pyodide (Python compiled to WebAssembly)
 * 
 * SECURITY: All code execution happens in the browser.
 * The server NEVER executes user code.
 */
import { useState, useCallback, useRef } from 'react';

/**
 * Custom hook for code execution
 * @returns {Object} { output, isRunning, isLoading, error, runCode, loadingMessage }
 */
export function useCodeExecution() {
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState(null);
  
  // Store Pyodide instance
  const pyodideRef = useRef(null);
  const pyodideLoadingRef = useRef(false);

  /**
   * Load Pyodide runtime (lazy-loaded on first Python execution)
   */
  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) {
      return pyodideRef.current;
    }

    // Prevent multiple simultaneous loads
    if (pyodideLoadingRef.current) {
      // Wait for existing load to complete
      while (pyodideLoadingRef.current && !pyodideRef.current) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return pyodideRef.current;
    }

    pyodideLoadingRef.current = true;
    setIsLoading(true);
    setLoadingMessage('Loading Python runtime...');

    try {
      // Load Pyodide from CDN
      setLoadingMessage('Downloading Pyodide...');
      
      // Check if loadPyodide is already available (script loaded)
      if (!window.loadPyodide) {
        // Load Pyodide script dynamically
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
          script.onload = resolve;
          script.onerror = () => reject(new Error('Failed to load Pyodide'));
          document.head.appendChild(script);
        });
      }

      setLoadingMessage('Initializing Python interpreter...');
      
      // Initialize Pyodide
      const pyodide = await window.loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/'
      });

      // Set up stdout capture
      pyodide.runPython(`
import sys
from io import StringIO

class CaptureOutput:
    def __init__(self):
        self.output = StringIO()
    
    def write(self, text):
        self.output.write(text)
    
    def flush(self):
        pass
    
    def getvalue(self):
        return self.output.getvalue()
    
    def clear(self):
        self.output = StringIO()

_stdout_capture = CaptureOutput()
sys.stdout = _stdout_capture
sys.stderr = _stdout_capture
      `);

      pyodideRef.current = pyodide;
      setLoadingMessage('');
      setIsLoading(false);
      
      return pyodide;
    } catch (err) {
      setIsLoading(false);
      setLoadingMessage('');
      pyodideLoadingRef.current = false;
      throw new Error(`Failed to load Python runtime: ${err.message}`);
    }
  }, []);

  /**
   * Execute JavaScript code safely in the browser
   * Uses a sandboxed Function to prevent access to global scope
   */
  /**
   * Execute JavaScript code safely using a Web Worker
   * This prevents access to DOM/Cookies and handles infinite loops via timeout
   */
  const executeJavaScript = useCallback((code) => {
    return new Promise((resolve) => {
      try {
        const worker = new Worker(new URL('../workers/javascript.worker.js', import.meta.url), { type: 'module' });
        
        const timeoutId = setTimeout(() => {
          worker.terminate();
          resolve({
            success: false,
            output: '',
            error: 'Execution timed out (5s limit)'
          });
        }, 5000);

        worker.onmessage = (e) => {
          clearTimeout(timeoutId);
          worker.terminate();
          resolve(e.data);
        };

        worker.onerror = (err) => {
          clearTimeout(timeoutId);
          worker.terminate();
          resolve({
            success: false,
            output: '',
            error: `Runtime Error: ${err.message}`
          });
        };

        worker.postMessage({ code });
      } catch (err) {
        resolve({
          success: false,
          output: '',
          error: `Failed to start worker: ${err.message}`
        });
      }
    });
  }, []);

  /**
   * Execute Python code using Pyodide
   */
  const executePython = useCallback(async (code) => {
    try {
      const pyodide = await loadPyodide();
      
      // Clear previous output
      pyodide.runPython('_stdout_capture.clear()');
      
      // Run the user code
      let result;
      try {
        result = pyodide.runPython(code);
      } catch (pyErr) {
        // Get any partial output before the error
        const partialOutput = pyodide.runPython('_stdout_capture.getvalue()');
        return {
          success: false,
          output: partialOutput || '',
          error: pyErr.message
        };
      }
      
      // Get captured stdout
      const stdout = pyodide.runPython('_stdout_capture.getvalue()');
      
      let output = stdout;
      
      // If there's a result and no stdout, show the result
      if (result !== undefined && result !== null && (!output || !output.trim())) {
         output = result.toString();
      }
      
      return { success: true, output: output || '(No output)' };
    } catch (err) {
      return { 
        success: false, 
        output: '',
        error: err.message 
      };
    }
  }, [loadPyodide]);

  /**
   * Main execution function
   * @param {string} code - Code to execute
   * @param {string} language - 'javascript' or 'python'
   */
  const runCode = useCallback(async (code, language) => {
    setIsRunning(true);
    setError(null);
    setOutput('');

    try {
      let result;
      
      if (language === 'javascript') {
        result = await executeJavaScript(code);
      } else if (language === 'python') {
        result = await executePython(code);
      } else {
        result = { 
          success: false, 
          output: '', 
          error: `Execution not supported for language: ${language}` 
        };
      }

      if (result.success) {
        setOutput(result.output);
      } else {
        setOutput(result.output);
        setError(result.error);
      }
    } catch (err) {
      setError(`Execution failed: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  }, [executeJavaScript, executePython]);

  return {
    output,
    isRunning,
    isLoading,
    loadingMessage,
    error,
    runCode
  };
}
