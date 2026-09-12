/**
 * SCUBACODE NEO-BRUTALIST IDE
 * Main Application Logic, Dark Mode & Window Controls
 */

function initApp() {
  // DOM Elements
  const sourceEditor = document.getElementById('sourceEditor');
  const codeOutput = document.getElementById('codeOutput');
  const consoleOutput = document.getElementById('consoleOutput');
  const compileBtn = document.getElementById('compileBtn');
  const runBtn = document.getElementById('runBtn');
  const clearOutputBtn = document.getElementById('clearOutputBtn');
  const copyConsoleBtn = document.getElementById('copyConsoleBtn');
  const copySourceBtn = document.getElementById('copySourceBtn');
  const copyTranspiledBtn = document.getElementById('copyTranspiledBtn');
  const resetEditorBtn = document.getElementById('resetEditorBtn');
  const directionToggleBtn = document.getElementById('directionToggleBtn');
  const directionLabel = document.getElementById('directionLabel');
  const currentModeText = document.getElementById('currentModeText');
  const leftPanelTitle = document.getElementById('leftPanelTitle');
  const leftFileTag = document.getElementById('leftFileTag');
  const rightPanelTitle = document.getElementById('rightPanelTitle');
  const rightFileTag = document.getElementById('rightFileTag');
  const sourceStats = document.getElementById('sourceStats');
  const outputStats = document.getElementById('outputStats');
  const leftLineNumbers = document.getElementById('leftLineNumbers');
  const rightLineNumbers = document.getElementById('rightLineNumbers');
  const engineStatusIndicator = document.getElementById('engineStatusIndicator');
  const executionStatusTag = document.getElementById('executionStatusTag');
  const dictionaryBtn = document.getElementById('dictionaryBtn');
  const dictionaryModal = document.getElementById('dictionaryModal');
  const closeDictionaryBtn = document.getElementById('closeDictionaryBtn');
  const modalGotItBtn = document.getElementById('modalGotItBtn');
  const toastContainer = document.getElementById('toastContainer');
  
  // Theme Toggle Elements
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeToggleIcon = document.getElementById('themeToggleIcon');
  const themeToggleText = document.getElementById('themeToggleText');

  // Window Control Elements
  const collapseLeftBtn = document.getElementById('collapseLeftBtn');
  const splitLeftBtn = document.getElementById('splitLeftBtn');
  const maximizeLeftBtn = document.getElementById('maximizeLeftBtn');
  const collapseRightBtn = document.getElementById('collapseRightBtn');
  const splitRightBtn = document.getElementById('splitRightBtn');
  const maximizeRightBtn = document.getElementById('maximizeRightBtn');

  // Resizer Elements
  const codeSplitContainer = document.getElementById('codeSplitContainer');
  const leftEditorPanel = document.getElementById('leftEditorPanel');
  const rightEditorPanel = document.getElementById('rightEditorPanel');
  const resizerDivider = document.getElementById('resizerDivider');

  // Application State
  let currentDirection = 'absurd-to-js'; // 'absurd-to-js' | 'js-to-absurd'
  let isDraggingSplitter = false;

  // Starter Boilerplate for Scubacode
  const defaultAbsurdCode = `// Welcome to Scubacode IDE
frfr greeting = "Hello from Scubacode!";
lowkey counter = 3;

vibeCheck (counter > 0) {
  spill(greeting, "Count:", counter);
} otherwise {
  spill("Finished execution!");
}`;

  // Initialize Starter Content if empty
  if (sourceEditor && !sourceEditor.value) {
    sourceEditor.value = defaultAbsurdCode;
  }

  // ==========================================
  // THEME SYSTEM (DARK / LIGHT MODE)
  // ==========================================
  function applyTheme(isDark) {
    if (isDark) {
      document.body.classList.add('dark-theme');
      if (themeToggleIcon) themeToggleIcon.textContent = '☀️';
      if (themeToggleText) themeToggleText.textContent = 'LIGHT';
      if (themeToggleBtn) themeToggleBtn.title = 'Switch to Light Mode';
    } else {
      document.body.classList.remove('dark-theme');
      if (themeToggleIcon) themeToggleIcon.textContent = '🌙';
      if (themeToggleText) themeToggleText.textContent = 'DARK';
      if (themeToggleBtn) themeToggleBtn.title = 'Switch to Dark Mode';
    }
  }

  function initTheme() {
    const savedTheme = localStorage.getItem('scubacode-theme') || localStorage.getItem('subacode-theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = savedTheme ? savedTheme === 'dark' : prefersDark;
    applyTheme(isDark);

    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        const currentlyDark = document.body.classList.contains('dark-theme');
        const nextDark = !currentlyDark;
        applyTheme(nextDark);
        localStorage.setItem('scubacode-theme', nextDark ? 'dark' : 'light');
        showToast(`Switched to ${nextDark ? 'Dark' : 'Light'} Mode`, 'info');
      });
    }
  }

  // ==========================================
  // TOAST NOTIFICATIONS
  // ==========================================
  function showToast(message, type = 'info') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `neo-toast toast-${type}`;
    
    let icon = '⚡';
    if (type === 'success') icon = '✓';
    if (type === 'error') icon = '✕';
    if (type === 'info') icon = 'ℹ';

    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'all 0.2s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px) scale(0.9)';
      setTimeout(() => toast.remove(), 200);
    }, 2800);
  }

  // ==========================================
  // STATUS INDICATORS & LOADING
  // ==========================================
  function setStatus(status, text) {
    if (engineStatusIndicator) {
      engineStatusIndicator.className = `status-value status-${status}`;
      engineStatusIndicator.textContent = text.toUpperCase();
    }
    if (executionStatusTag) {
      executionStatusTag.textContent = text.toUpperCase();
      if (status === 'error') {
        executionStatusTag.style.backgroundColor = 'var(--neo-pink)';
      } else if (status === 'ready') {
        executionStatusTag.style.backgroundColor = 'var(--neo-yellow)';
      } else if (status === 'running') {
        executionStatusTag.style.backgroundColor = 'var(--neo-cyan)';
      }
    }
  }

  function setLoading(btn, isLoading) {
    if (!btn) return;
    const textEl = btn.querySelector('.btn-text');
    const spinnerEl = btn.querySelector('.spinner');
    if (isLoading) {
      btn.disabled = true;
      if (textEl) textEl.classList.add('hidden');
      if (spinnerEl) spinnerEl.classList.remove('hidden');
    } else {
      btn.disabled = false;
      if (textEl) textEl.classList.remove('hidden');
      if (spinnerEl) spinnerEl.classList.add('hidden');
    }
  }

  // ==========================================
  // LINE NUMBERS & STATS SYNC
  // ==========================================
  function updateLineNumbers(textarea, lineNumbersEl, statsEl) {
    if (!textarea || !lineNumbersEl) return;
    const lines = textarea.value.split('\n');
    const lineCount = lines.length;
    
    let lineNumsStr = '';
    for (let i = 1; i <= lineCount; i++) {
      lineNumsStr += i + '\n';
    }
    lineNumbersEl.textContent = lineNumsStr;

    if (statsEl) {
      const charCount = textarea.value.length;
      statsEl.textContent = `${lineCount}L · ${charCount}C`;
    }
  }

  function syncScroll(textarea, lineNumbersEl) {
    if (textarea && lineNumbersEl) {
      lineNumbersEl.scrollTop = textarea.scrollTop;
    }
  }

  if (sourceEditor && leftLineNumbers) {
    sourceEditor.addEventListener('input', () => {
      updateLineNumbers(sourceEditor, leftLineNumbers, sourceStats);
    });
    sourceEditor.addEventListener('scroll', () => {
      syncScroll(sourceEditor, leftLineNumbers);
    });
  }

  if (codeOutput && rightLineNumbers) {
    codeOutput.addEventListener('scroll', () => {
      syncScroll(codeOutput, rightLineNumbers);
    });
  }

  // ==========================================
  // TAB KEY & AUTO-INDENT HANDLING IN EDITOR
  // ==========================================
  if (sourceEditor) {
    sourceEditor.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = sourceEditor.selectionStart;
        const end = sourceEditor.selectionEnd;
        const val = sourceEditor.value;

        sourceEditor.value = val.substring(0, start) + '  ' + val.substring(end);
        sourceEditor.selectionStart = sourceEditor.selectionEnd = start + 2;
        updateLineNumbers(sourceEditor, leftLineNumbers, sourceStats);
      }
    });
  }

  // ==========================================
  // HORIZONTAL PANEL RESIZING & WINDOW CONTROLS
  // ==========================================
  function setPanelSplit(leftPercent) {
    if (!leftEditorPanel || !rightEditorPanel) return;
    if (leftPercent <= 5) {
      leftEditorPanel.style.display = 'none';
      leftEditorPanel.style.flex = '0 0 0%';
      rightEditorPanel.style.display = 'flex';
      rightEditorPanel.style.flex = '1 1 100%';
    } else if (leftPercent >= 95) {
      leftEditorPanel.style.display = 'flex';
      leftEditorPanel.style.flex = '1 1 100%';
      rightEditorPanel.style.display = 'none';
      rightEditorPanel.style.flex = '0 0 0%';
    } else {
      leftEditorPanel.style.display = 'flex';
      rightEditorPanel.style.display = 'flex';
      const rightPercent = 100 - leftPercent;
      leftEditorPanel.style.flex = `0 0 calc(${leftPercent}% - 8px)`;
      rightEditorPanel.style.flex = `0 0 calc(${rightPercent}% - 8px)`;
    }
  }

  function initHorizontalResizer() {
    if (!resizerDivider || !codeSplitContainer || !leftEditorPanel || !rightEditorPanel) return;

    function onPointerDown(e) {
      isDraggingSplitter = true;
      resizerDivider.classList.add('dragging');
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';

      // Temporarily disable pointer events on textareas so drag doesn't lose focus
      if (sourceEditor) sourceEditor.style.pointerEvents = 'none';
      if (codeOutput) codeOutput.style.pointerEvents = 'none';

      window.addEventListener('mousemove', onPointerMove);
      window.addEventListener('mouseup', onPointerUp);
      window.addEventListener('touchmove', onPointerMove, { passive: false });
      window.addEventListener('touchend', onPointerUp);
    }

    function onPointerMove(e) {
      if (!isDraggingSplitter) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const containerRect = codeSplitContainer.getBoundingClientRect();
      const containerWidth = containerRect.width;

      if (containerWidth <= 0) return;

      const offsetLeft = clientX - containerRect.left;
      let leftPercent = (offsetLeft / containerWidth) * 100;

      // Soft constraints between 12% and 88%
      if (leftPercent < 12) leftPercent = 12;
      if (leftPercent > 88) leftPercent = 88;

      setPanelSplit(leftPercent);
    }

    function onPointerUp() {
      if (!isDraggingSplitter) return;
      isDraggingSplitter = false;
      resizerDivider.classList.remove('dragging');
      document.body.style.cursor = '';
      document.body.style.userSelect = '';

      if (sourceEditor) sourceEditor.style.pointerEvents = '';
      if (codeOutput) codeOutput.style.pointerEvents = '';

      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
    }

    resizerDivider.addEventListener('mousedown', onPointerDown);
    resizerDivider.addEventListener('touchstart', onPointerDown, { passive: true });

    // Double click splitter to reset 50/50
    resizerDivider.addEventListener('dblclick', () => {
      setPanelSplit(50);
      showToast('Split reset to 50/50', 'info');
    });

    // Window control buttons
    if (collapseLeftBtn) {
      collapseLeftBtn.addEventListener('click', () => {
        setPanelSplit(0);
        showToast('Source panel collapsed', 'info');
      });
    }
    if (splitLeftBtn) {
      splitLeftBtn.addEventListener('click', () => {
        setPanelSplit(50);
        showToast('Panels split 50/50', 'info');
      });
    }
    if (maximizeLeftBtn) {
      maximizeLeftBtn.addEventListener('click', () => {
        setPanelSplit(100);
        showToast('Source panel maximized', 'info');
      });
    }

    if (collapseRightBtn) {
      collapseRightBtn.addEventListener('click', () => {
        setPanelSplit(100);
        showToast('Output panel collapsed', 'info');
      });
    }
    if (splitRightBtn) {
      splitRightBtn.addEventListener('click', () => {
        setPanelSplit(50);
        showToast('Panels split 50/50', 'info');
      });
    }
    if (maximizeRightBtn) {
      maximizeRightBtn.addEventListener('click', () => {
        setPanelSplit(0);
        showToast('Output panel maximized', 'info');
      });
    }
  }

  // ==========================================
  // DIRECTION SWITCHING (ABSURD ⇄ JS)
  // ==========================================
  function updateDirectionUI() {
    if (sourceEditor) sourceEditor.readOnly = false;
    if (codeOutput) codeOutput.readOnly = true;

    if (currentDirection === 'js-to-absurd') {
      if (directionLabel) directionLabel.textContent = 'JS ➔ ABSURD';
      if (currentModeText) currentModeText.textContent = 'JAVASCRIPT ➔ ABSURD';
      if (directionToggleBtn) directionToggleBtn.classList.add('swapped');

      if (leftPanelTitle) leftPanelTitle.textContent = 'JAVASCRIPT SOURCE';
      if (leftFileTag) leftFileTag.textContent = 'main.js';
      if (rightPanelTitle) rightPanelTitle.textContent = 'TRANSPILED ABSURD';
      if (rightFileTag) rightFileTag.textContent = 'output.absurd';

      if (sourceEditor) sourceEditor.placeholder = 'Write standard JavaScript code here...';
      if (codeOutput) codeOutput.placeholder = 'Transpiled Absurd code will appear here...';
    } else {
      if (directionLabel) directionLabel.textContent = 'ABSURD ➔ JS';
      if (currentModeText) currentModeText.textContent = 'ABSURD ➔ JAVASCRIPT';
      if (directionToggleBtn) directionToggleBtn.classList.remove('swapped');

      if (leftPanelTitle) leftPanelTitle.textContent = 'ABSURD SOURCE';
      if (leftFileTag) leftFileTag.textContent = 'main.absurd';
      if (rightPanelTitle) rightPanelTitle.textContent = 'TRANSPILED JAVASCRIPT';
      if (rightFileTag) rightFileTag.textContent = 'output.js';

      if (sourceEditor) sourceEditor.placeholder = 'Write your Absurd code here...';
      if (codeOutput) codeOutput.placeholder = 'Transpiled JavaScript code will appear here...';
    }

    updateLineNumbers(sourceEditor, leftLineNumbers, sourceStats);
    updateLineNumbers(codeOutput, rightLineNumbers, outputStats);
  }

  async function handleToggleDirection() {
    const rightContent = codeOutput ? codeOutput.value : '';
    const leftContent = sourceEditor ? sourceEditor.value : '';
    const newInput = rightContent.trim() ? rightContent : leftContent;

    currentDirection = currentDirection === 'absurd-to-js' ? 'js-to-absurd' : 'absurd-to-js';
    updateDirectionUI();

    if (sourceEditor) {
      sourceEditor.value = newInput;
      updateLineNumbers(sourceEditor, leftLineNumbers, sourceStats);
    }

    showToast(`Mode: ${currentDirection === 'absurd-to-js' ? 'ABSURD ➔ JS' : 'JS ➔ ABSURD'}`, 'info');
    await performCompile(newInput);
  }

  if (directionToggleBtn) {
    directionToggleBtn.addEventListener('click', handleToggleDirection);
  }

  // ==========================================
  // COMPILE / TRANSPILATION API
  // ==========================================
  async function performCompile(customCode) {
    const inputCode = customCode !== undefined ? customCode : (sourceEditor ? sourceEditor.value : '');
    setLoading(compileBtn, true);
    setStatus('running', 'Compiling...');

    if (consoleOutput) {
      consoleOutput.classList.remove('error-mode');
      consoleOutput.textContent = '// [COMPILE] Transpiling source AST...';
    }

    const endpoint = currentDirection === 'absurd-to-js' ? '/api/transpile' : '/api/reverse-transpile';

    try {
      const startTime = performance.now();
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: inputCode })
      });

      const elapsed = Math.round(performance.now() - startTime);
      let data;
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        data = { success: false, error: `Server response (${res.status}): ${text}` };
      }

      if (data.success) {
        if (codeOutput) codeOutput.value = data.code || '';
        if (consoleOutput) {
          consoleOutput.textContent = `// ✓ Transpilation Successful in ${elapsed}ms!\n// Click 'RUN CODE' [Ctrl+Enter] to execute in Node.js VM.`;
        }
        setStatus('ready', `Compiled (${elapsed}ms)`);
        showToast('Transpiled successfully!', 'success');
      } else {
        if (codeOutput) codeOutput.value = '';
        if (consoleOutput) {
          consoleOutput.classList.add('error-mode');
          consoleOutput.textContent = `// ✕ COMPILATION ERROR:\n${data.error || 'Unknown transpiler error.'}`;
        }
        setStatus('error', 'Compile Error');
        showToast('Transpilation failed! Check logs.', 'error');
      }
    } catch (err) {
      if (consoleOutput) {
        consoleOutput.classList.add('error-mode');
        consoleOutput.textContent = `// ✕ NETWORK ERROR:\nCould not connect to transpiler backend: ${err.message}`;
      }
      setStatus('error', 'Network Error');
      showToast('Network error connecting to backend.', 'error');
    } finally {
      setLoading(compileBtn, false);
      updateLineNumbers(codeOutput, rightLineNumbers, outputStats);
    }
  }

  // ==========================================
  // RUN / EXECUTION API
  // ==========================================
  async function performRun() {
    const sourceCode = sourceEditor ? sourceEditor.value : '';
    setLoading(runBtn, true);
    setStatus('running', 'Executing...');

    if (consoleOutput) {
      consoleOutput.classList.remove('error-mode');
      consoleOutput.textContent = '// [RUN] Executing code in secure sandbox...';
    }

    try {
      const startTime = performance.now();
      const res = await fetch('/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: sourceCode, mode: currentDirection })
      });

      const elapsed = Math.round(performance.now() - startTime);
      let data;
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        data = { success: false, error: `Server error (${res.status}): ${text}` };
      }

      if (data.success) {
        if (codeOutput && data.code) {
          codeOutput.value = data.code;
          updateLineNumbers(codeOutput, rightLineNumbers, outputStats);
        }

        if (consoleOutput) {
          if (data.output && data.output.length > 0) {
            consoleOutput.textContent = data.output.join('\n');
          } else {
            consoleOutput.textContent = `// [Process exited with code 0 in ${elapsed}ms] (No output emitted)`;
          }
        }
        setStatus('ready', `Done (${elapsed}ms)`);
        showToast(`Executed cleanly in ${elapsed}ms`, 'success');
      } else {
        if (consoleOutput) {
          consoleOutput.classList.add('error-mode');
          consoleOutput.textContent = `// ✕ RUNTIME / PARSE ERROR:\n${data.error || 'Execution failed.'}`;
        }
        setStatus('error', 'Runtime Error');
        showToast('Runtime error during execution.', 'error');
      }
    } catch (err) {
      if (consoleOutput) {
        consoleOutput.classList.add('error-mode');
        consoleOutput.textContent = `// ✕ NETWORK ERROR:\nCould not reach execution backend: ${err.message}`;
      }
      setStatus('error', 'Network Error');
      showToast('Network error connecting to runner.', 'error');
    } finally {
      setLoading(runBtn, false);
    }
  }

  // Hook Up Buttons
  if (compileBtn) compileBtn.addEventListener('click', () => performCompile());
  if (runBtn) runBtn.addEventListener('click', performRun);

  // ==========================================
  // KEYBOARD SHORTCUTS
  // ==========================================
  window.addEventListener('keydown', (e) => {
    // Ctrl+Enter or Cmd+Enter to Run
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      performRun();
    }
    // Alt+C to Compile
    if (e.altKey && (e.key === 'c' || e.key === 'C')) {
      e.preventDefault();
      performCompile();
    }
  });

  // ==========================================
  // UTILITY BUTTONS (COPY, CLEAR, RESET)
  // ==========================================
  if (clearOutputBtn) {
    clearOutputBtn.addEventListener('click', () => {
      if (consoleOutput) {
        consoleOutput.textContent = '// Console logs cleared.';
        consoleOutput.classList.remove('error-mode');
      }
      setStatus('ready', 'IDLE');
      showToast('Console cleared', 'info');
    });
  }

  if (copyConsoleBtn) {
    copyConsoleBtn.addEventListener('click', () => {
      if (consoleOutput && consoleOutput.textContent) {
        navigator.clipboard.writeText(consoleOutput.textContent)
          .then(() => showToast('Console output copied!', 'success'))
          .catch(() => showToast('Failed to copy console text', 'error'));
      }
    });
  }

  if (copySourceBtn) {
    copySourceBtn.addEventListener('click', () => {
      if (sourceEditor && sourceEditor.value) {
        navigator.clipboard.writeText(sourceEditor.value)
          .then(() => showToast('Source code copied to clipboard!', 'success'))
          .catch(() => showToast('Failed to copy', 'error'));
      }
    });
  }

  if (copyTranspiledBtn) {
    copyTranspiledBtn.addEventListener('click', () => {
      if (codeOutput && codeOutput.value) {
        navigator.clipboard.writeText(codeOutput.value)
          .then(() => showToast('Transpiled JavaScript copied!', 'success'))
          .catch(() => showToast('Failed to copy', 'error'));
      }
    });
  }

  if (resetEditorBtn) {
    resetEditorBtn.addEventListener('click', () => {
      if (sourceEditor) {
        sourceEditor.value = '';
        if (codeOutput) codeOutput.value = '';
        if (consoleOutput) consoleOutput.textContent = '// Editor reset. Start typing new code...';
        updateLineNumbers(sourceEditor, leftLineNumbers, sourceStats);
        updateLineNumbers(codeOutput, rightLineNumbers, outputStats);
        showToast('Editor reset', 'info');
      }
    });
  }

  // ==========================================
  // KEYWORD DICTIONARY MODAL
  // ==========================================
  function openDictionary() {
    if (dictionaryModal) dictionaryModal.classList.remove('hidden');
  }

  function closeDictionary() {
    if (dictionaryModal) dictionaryModal.classList.add('hidden');
  }

  if (dictionaryBtn) dictionaryBtn.addEventListener('click', openDictionary);
  if (closeDictionaryBtn) closeDictionaryBtn.addEventListener('click', closeDictionary);
  if (modalGotItBtn) modalGotItBtn.addEventListener('click', closeDictionary);
  if (dictionaryModal) {
    dictionaryModal.addEventListener('click', (e) => {
      if (e.target === dictionaryModal) closeDictionary();
    });
  }

  // ==========================================
  // INITIAL BOOTSTRAP
  // ==========================================
  initTheme();
  initHorizontalResizer();
  updateDirectionUI();
  updateLineNumbers(sourceEditor, leftLineNumbers, sourceStats);
  performCompile();
}

// Auto-run once DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
