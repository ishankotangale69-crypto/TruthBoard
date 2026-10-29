/**
 * TRUTHBOARD // Core Cyberpunk Controller & Interactive Prototype Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  const DATA = window.TRUTHBOARD_DATA || window.TRUTH_BOARD_DATA;
  let currentPresetKey = 'healthcare';
  let isShieldEnabled = true;
  let currentModelKey = 'gpt-4o';
  let isTyping = false;
  let typingTimeout = null;

  // Sound engine alias
  const sound = window.cyberSound;

  /* ==========================================================================
     1. Sound & Scanline Controls
     ========================================================================== */
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const scanlineToggleBtn = document.getElementById('scanlineToggleBtn');
  const scanlinesEl = document.querySelector('.scanlines');

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      const state = sound.toggle();
      const soundText = document.getElementById('soundToggleText');
      const soundIcon = document.getElementById('soundIcon');
      if (soundText) soundText.textContent = state ? 'SFX: ON' : 'SFX: OFF';
      if (soundIcon) {
        soundIcon.setAttribute('data-lucide', state ? 'volume-2' : 'volume-x');
        if (window.lucide) window.lucide.createIcons();
      }
      if (state) sound.playClick();
    });
  }

  if (scanlineToggleBtn && scanlinesEl) {
    scanlineToggleBtn.addEventListener('click', () => {
      sound.playClick();
      scanlinesEl.classList.toggle('disabled');
      const isEnabled = !scanlinesEl.classList.contains('disabled');
      const textEl = document.getElementById('scanlineToggleText');
      if (textEl) textEl.textContent = isEnabled ? 'CRT: ON' : 'CRT: OFF';
    });
  }

  /* ==========================================================================
     2. Live Threat Ticker
     ========================================================================== */
  const tickerTrack = document.getElementById('threatTickerTrack');
  if (tickerTrack && DATA.liveThreats) {
    const threatsDoubled = [...DATA.liveThreats, ...DATA.liveThreats];
    tickerTrack.innerHTML = threatsDoubled.map(t => `
      <div class="flex items-center space-x-3 px-6 py-2 border-r border-cyan-500/20 whitespace-nowrap text-xs">
        <span class="text-xs px-2 py-0.5 font-bold uppercase bg-red-500/20 text-red-400 border border-red-500/40 rounded tracking-wider">
          ${t.status}
        </span>
        <span class="text-cyan-400 font-bold">${t.source}</span>
        <span class="text-purple-300 font-medium">[${t.topic}]:</span>
        <span class="text-gray-300">${t.error}</span>
        <span class="text-gray-500 text-[10px]">${t.time}</span>
      </div>
    `).join('');
  }

  /* ==========================================================================
     3. Live Interceptor Terminal Engine
     ========================================================================== */
  const presetButtons = document.querySelectorAll('.preset-btn');
  const customPromptInput = document.getElementById('customPromptInput');
  const runCustomBtn = document.getElementById('runCustomBtn');
  const modelSelect = document.getElementById('modelSelect');
  const shieldToggleBtn = document.getElementById('shieldToggleBtn');
  const shieldStateText = document.getElementById('shieldStateText');
  const bypassHazardBanner = document.getElementById('bypassHazardBanner');
  const rawTerminalContent = document.getElementById('rawTerminalContent');
  const verifiedTerminalContent = document.getElementById('verifiedTerminalContent');
  const explanationTerminal = document.getElementById('explanationTerminal');
  const confidenceGaugeCircle = document.getElementById('confidenceGaugeCircle');
  const confidenceScoreValue = document.getElementById('confidenceScoreValue');
  const confidenceRiskBadge = document.getElementById('confidenceRiskBadge');
  const latencyBadge = document.getElementById('latencyBadge');
  const modelConfidenceDisplay = document.getElementById('modelConfidenceDisplay');

  // Pipeline badges
  const pipeRetrievalBadge = document.getElementById('pipeRetrievalBadge');
  const pipeCrossBadge = document.getElementById('pipeCrossBadge');
  const pipeActionBadge = document.getElementById('pipeActionBadge');

  function renderPreset(presetKey, shouldAnimate = true) {
    currentPresetKey = presetKey;
    const preset = DATA.presets[presetKey];
    if (!preset) return;

    // Update active button state
    presetButtons.forEach(btn => {
      if (btn.dataset.preset === presetKey) {
        btn.classList.add('bg-cyan-500/20', 'border-cyan-400', 'text-cyan-300', 'shadow-[0_0_15px_rgba(0,240,255,0.3)]');
        btn.classList.remove('bg-gray-900/60', 'border-gray-700/60', 'text-gray-400');
      } else {
        btn.classList.remove('bg-cyan-500/20', 'border-cyan-400', 'text-cyan-300', 'shadow-[0_0_15px_rgba(0,240,255,0.3)]');
        btn.classList.add('bg-gray-900/60', 'border-gray-700/60', 'text-gray-400');
      }
    });

    // Update prompt preview
    const promptDisplay = document.getElementById('activePromptDisplay');
    if (promptDisplay) {
      promptDisplay.textContent = `"${preset.prompt}"`;
    }

    if (modelConfidenceDisplay) {
      modelConfidenceDisplay.textContent = preset.modelConfidence;
    }

    if (latencyBadge) {
      latencyBadge.textContent = preset.latency;
    }

    // Play scan sound
    sound.playScan();

    // Stream or render terminal output
    if (shouldAnimate) {
      simulateTerminalStreaming(preset);
    } else {
      updateTerminalOutput(preset);
    }

    updateVerificationMetrics(preset);
  }

  function simulateTerminalStreaming(preset) {
    if (typingTimeout) clearTimeout(typingTimeout);
    isTyping = true;

    // Reset displays
    rawTerminalContent.innerHTML = `<span class="text-cyan-400 inline-flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span> INGESTING STREAM & AUDITING TOKENS...</span>`;
    verifiedTerminalContent.innerHTML = `<div class="text-gray-500 italic flex items-center gap-2"><div class="w-3 h-3 border-2 border-lime-400 border-t-transparent rounded-full animate-spin"></div> Running 4-Level Cross-Verification Matrix...</div>`;

    typingTimeout = setTimeout(() => {
      isTyping = false;
      updateTerminalOutput(preset);
      if (isShieldEnabled) {
        sound.playAlert();
      } else {
        sound.playAlert();
      }
    }, 450);
  }

  function updateTerminalOutput(preset) {
    if (!preset) preset = DATA.presets[currentPresetKey];

    if (!isShieldEnabled) {
      // BYPASS GUARD MODE: Radioactive Hazard Alert
      rawTerminalContent.innerHTML = `
        <div class="space-y-3">
          <div class="p-3 bg-red-950/40 border border-red-500/70 text-red-300 text-xs rounded font-mono hazard-active">
            <span class="font-bold text-red-400 uppercase tracking-widest flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-red-500 beacon-danger"></span>
              CRITICAL HAZARD // GUARD LAYER BYPASSED
            </span>
            <p class="mt-1 text-[11px] text-red-200/90">
              Unfiltered hallucinated model output is leaking directly to client interface. Factual errors and lethal/legal hallucinations are active!
            </p>
          </div>
          <p class="text-gray-200 text-sm leading-relaxed">
            ${preset.rawOutput}
          </p>
        </div>
      `;

      verifiedTerminalContent.innerHTML = `
        <div class="h-full flex flex-col items-center justify-center py-10 px-4 text-center border border-dashed border-red-500/30 rounded bg-red-950/10">
          <div class="w-12 h-12 rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center text-red-400 mb-3 beacon-danger">
            <i data-lucide="shield-off" class="w-6 h-6"></i>
          </div>
          <h4 class="text-red-400 font-orbitron font-bold text-sm tracking-wider">DEFENSE SHIELD DISABLED</h4>
          <p class="text-gray-400 text-xs max-w-sm mt-1">
            Real-time interceptor is bypassed. No ground-truth verification or token rewrites are active.
          </p>
          <button id="quickEnableShieldBtn" class="mt-4 px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold font-orbitron tracking-wider rounded transition-all shadow-[0_0_15px_rgba(255,0,85,0.4)]">
            RE-ENGAGE TRUTHBOARD SHIELD
          </button>
        </div>
      `;

      const quickBtn = document.getElementById('quickEnableShieldBtn');
      if (quickBtn) {
        quickBtn.addEventListener('click', () => {
          toggleShield(true);
        });
      }

    } else {
      // SHIELD ENABLED MODE: Highlight hallucinations & Inject Verified Fact
      let highlightedRaw = preset.rawOutput;
      preset.hallucinatedSpans.forEach(span => {
        const regex = new RegExp(escapeRegExp(span), 'g');
        highlightedRaw = highlightedRaw.replace(regex, `<span class="hallucination-strike">${span}</span>`);
      });

      rawTerminalContent.innerHTML = `
        <div class="space-y-2">
          <div class="text-[11px] text-yellow-400/90 bg-yellow-950/30 border border-yellow-500/30 px-3 py-1.5 rounded flex items-center justify-between">
            <span class="flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-yellow-400"></span>
              MODEL GENERATION AUDITED // <strong>${preset.hallucinatedSpans.length} HALLUCINATION SPANS DETECTED</strong>
            </span>
            <span class="text-[10px] text-gray-400">P(delusion) = 0.984</span>
          </div>
          <p class="text-gray-300 text-sm leading-relaxed font-mono">
            ${highlightedRaw}
          </p>
        </div>
      `;

      verifiedTerminalContent.innerHTML = `
        <div class="space-y-4">
          <div class="p-3.5 bg-lime-950/25 border border-lime-500/50 rounded glow-lime">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold text-lime-400 font-orbitron flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-lime-400 beacon-active"></span>
                TRUTHBOARD SANITIZED RESPONSE
              </span>
              <span class="text-[10px] bg-lime-500/20 text-lime-300 px-2 py-0.5 rounded border border-lime-500/30 font-mono">
                OVERRIDE #TRUTH-981
              </span>
            </div>
            <p class="text-lime-200/90 text-sm font-medium leading-relaxed">
              <span class="fact-highlight mr-1">VERIFIED GROUND TRUTH:</span>
              ${preset.verifiedFact}
            </p>
            <p class="text-gray-300 text-xs mt-2.5 pt-2 border-t border-lime-500/20 font-mono">
              <strong class="text-lime-400">Policy Action:</strong> ${preset.recommendation}
            </p>
          </div>

          <div class="bg-obsidian/80 border border-cyan-500/20 p-3 rounded text-xs space-y-2">
            <div class="text-cyan-400 font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5">
              <i data-lucide="shield-check" class="w-3.5 h-3.5 text-cyan-400"></i> Ground-Truth Provenance Sources:
            </div>
            <div class="flex flex-wrap gap-2">
              ${preset.sources.map(s => `
                <a href="${s.url}" target="_blank" rel="noopener" class="inline-flex items-center gap-1 px-2.5 py-1 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 rounded text-[11px] transition-colors">
                  <span>${s.name}</span>
                  <i data-lucide="external-link" class="w-2.5 h-2.5"></i>
                </a>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    }

    // Update deep inspection side-by-side comparison
    updateComparisonDrawer(preset);

    // Refresh lucide icons in injected HTML
    if (window.lucide) window.lucide.createIcons();
  }

  function updateVerificationMetrics(preset) {
    if (!preset) preset = DATA.presets[currentPresetKey];

    if (!isShieldEnabled) {
      // Hazard state metrics
      confidenceScoreValue.textContent = '0%';
      confidenceRiskBadge.textContent = 'SHIELD BYPASS';
      confidenceRiskBadge.className = 'text-xs px-2.5 py-0.5 rounded-full font-bold bg-red-500/30 text-red-300 border border-red-500';
      setGaugeScore(0, '#FF0055');

      pipeRetrievalBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-gray-500"></span> BYPASSED (0/0)`;
      pipeCrossBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-gray-500"></span> INACTIVE`;
      pipeActionBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-red-500 animate-ping"></span> UNFILTERED LEAK`;
    } else {
      // Protected mode metrics
      confidenceScoreValue.textContent = `${preset.confidenceScore}%`;
      confidenceRiskBadge.textContent = preset.riskLevel;
      confidenceRiskBadge.className = 'text-xs px-2.5 py-0.5 rounded-full font-bold bg-red-500/20 text-red-400 border border-red-500/50';
      setGaugeScore(preset.confidenceScore, preset.gaugeColor);

      pipeRetrievalBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-cyan-400 beacon-active"></span> ${preset.pipeline.retrieval}`;
      pipeCrossBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-purple-400"></span> ${preset.pipeline.crossVerification}`;
      pipeActionBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-lime-400 beacon-active"></span> ${preset.pipeline.action}`;
    }
  }

  function setGaugeScore(score, color) {
    if (!confidenceGaugeCircle) return;
    const circumference = 2 * Math.PI * 45; // r=45
    const offset = circumference - (score / 100) * circumference;
    confidenceGaugeCircle.style.strokeDasharray = `${circumference}`;
    confidenceGaugeCircle.style.strokeDashoffset = `${offset}`;
    confidenceGaugeCircle.style.stroke = color;
  }

  function updateComparisonDrawer(preset) {
    if (!explanationTerminal) return;

    explanationTerminal.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
        <div class="bg-red-950/20 border border-red-500/30 rounded p-3">
          <div class="text-red-400 font-bold mb-1.5 flex items-center gap-1.5">
            <i data-lucide="x-circle" class="w-3.5 h-3.5"></i> RAW MODEL CLAIMED:
          </div>
          <p class="text-gray-300 leading-relaxed">
            "${preset.hallucinatedSpans[0]}"
          </p>
          <div class="mt-2 text-[10px] text-red-400/80">
            P(Hallucination Certainty): 99.4% • Inherent Model Hallucination Trap
          </div>
        </div>

        <div class="bg-lime-950/20 border border-lime-500/30 rounded p-3">
          <div class="text-lime-400 font-bold mb-1.5 flex items-center gap-1.5">
            <i data-lucide="check-circle" class="w-3.5 h-3.5"></i> VERIFIED GROUND TRUTH:
          </div>
          <p class="text-lime-200 leading-relaxed">
            ${preset.verifiedFact.slice(0, 160)}...
          </p>
          <div class="mt-2 text-[10px] text-lime-400/80">
            Validated against authoritative primary sources in <strong>${preset.latency}</strong>
          </div>
        </div>
      </div>
    `;
  }

  function toggleShield(forceState = null) {
    isShieldEnabled = forceState !== null ? forceState : !isShieldEnabled;
    sound.playClick();

    if (shieldToggleBtn) {
      if (isShieldEnabled) {
        shieldToggleBtn.classList.remove('bg-red-600', 'border-red-400', 'text-white');
        shieldToggleBtn.classList.add('bg-lime-500/20', 'border-lime-400', 'text-lime-300');
        shieldToggleBtn.innerHTML = `
          <span class="w-2.5 h-2.5 rounded-full bg-lime-400 beacon-active"></span>
          <span id="shieldStateText" class="font-orbitron font-bold">ENABLE SHIELD</span>
          <span class="text-[10px] bg-lime-400 text-black px-1.5 py-0.2 rounded font-bold">ACTIVE</span>
        `;
        if (bypassHazardBanner) bypassHazardBanner.classList.add('hidden');
      } else {
        shieldToggleBtn.classList.remove('bg-lime-500/20', 'border-lime-400', 'text-lime-300');
        shieldToggleBtn.classList.add('bg-red-600', 'border-red-400', 'text-white');
        shieldToggleBtn.innerHTML = `
          <span class="w-2.5 h-2.5 rounded-full bg-red-400 beacon-danger"></span>
          <span id="shieldStateText" class="font-orbitron font-bold">BYPASS GUARD</span>
          <span class="text-[10px] bg-white text-red-600 px-1.5 py-0.2 rounded font-bold">HAZARD</span>
        `;
        if (bypassHazardBanner) bypassHazardBanner.classList.remove('hidden');
      }
    }

    updateTerminalOutput(DATA.presets[currentPresetKey]);
    updateVerificationMetrics(DATA.presets[currentPresetKey]);
  }

  // Preset button clicks
  presetButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      sound.playClick();
      const presetKey = btn.dataset.preset;
      renderPreset(presetKey, true);
    });
  });

  // Shield Toggle Click
  if (shieldToggleBtn) {
    shieldToggleBtn.addEventListener('click', () => {
      toggleShield();
    });
  }

  // Model Selector
  if (modelSelect) {
    modelSelect.addEventListener('change', (e) => {
      sound.playClick();
      currentModelKey = e.target.value;
      renderPreset(currentPresetKey, true);
    });
  }

  // Custom Prompt Form with Live FastAPI Interceptor Integration
  if (runCustomBtn && customPromptInput) {
    runCustomBtn.addEventListener('click', async () => {
      const val = customPromptInput.value.trim();
      if (!val) return;
      sound.playScan();

      // Show intermediate state
      rawTerminalContent.innerHTML = `<span class="text-cyan-400 inline-flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span> DISPATCHING TO FASTAPI INTERCEPTOR (PORT 8000)...</span>`;
      verifiedTerminalContent.innerHTML = `<div class="text-gray-500 italic flex items-center gap-2"><div class="w-3 h-3 border-2 border-lime-400 border-t-transparent rounded-full animate-spin"></div> Running Multi-Vector Cross-Verification...</div>`;

      // Infer domain from prompt content
      const lower = val.toLowerCase();
      let targetDomain = currentPresetKey || 'ecommerce';
      if (lower.includes('warfarin') || lower.includes('ibuprofen') || lower.includes('dose') || lower.includes('drug') || lower.includes('pain') || lower.includes('patient')) {
        targetDomain = 'healthcare';
      } else if (lower.includes('earbuds') || lower.includes('battery') || lower.includes('waterproof') || lower.includes('spec') || lower.includes('laptop')) {
        targetDomain = 'ecommerce';
      } else if (lower.includes('doi') || lower.includes('paper') || lower.includes('citation') || lower.includes('research') || lower.includes('einstein')) {
        targetDomain = 'education';
      } else if (lower.includes('margin') || lower.includes('dividend') || lower.includes('sec') || lower.includes('10-q') || lower.includes('non-compete')) {
        targetDomain = 'enterprise';
      }

      // Synthesize candidate AI assertion to verify
      let simulatedResponse = `The device/subject (${val}) is 100% certified and completely safe with 48 hours battery life and zero restrictions.`;
      if (targetDomain === 'healthcare') {
        simulatedResponse = `Yes, taking this medication (${val}) is completely safe and standard clinical protocol. There is zero risk of internal hemorrhage.`;
      } else if (targetDomain === 'education') {
        simulatedResponse = `The definitive citation is: Vance, S., Keller, T. (2024). DOI: 10.1038/s41565-024-01994-x.`;
      } else if (targetDomain === 'enterprise') {
        simulatedResponse = `Operating margin expanded to 34.8% and the board authorized a $2.50 cash dividend.`;
      }

      let apiData = null;
      try {
        const resp = await fetch('http://127.0.0.1:8000/api/v1/verify-response', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: val,
            ai_response: simulatedResponse,
            domain: targetDomain
          })
        });
        if (resp.ok) {
          apiData = await resp.json();
        }
      } catch (err) {
        // Fallback to client synthesis if backend is offline
        console.warn('FastAPI backend offline, running in client simulation mode:', err);
      }

      if (apiData) {
        const isSafe = apiData.status === 'SAFE';
        const isWarn = apiData.status === 'WARNING';
        DATA.presets.custom = {
          id: 'custom',
          name: `Live API Interception [${targetDomain.toUpperCase()}]`,
          tag: `FASTAPI // ${apiData.status}`,
          model: currentModelKey.toUpperCase(),
          prompt: val,
          modelConfidence: '98.5% (Model Self-Reported)',
          riskLevel: isSafe ? 'VERIFIED SAFE' : (isWarn ? 'MARGINAL DRIFT' : 'CRITICAL DELUSION'),
          confidenceScore: apiData.confidence_score,
          gaugeColor: isSafe ? '#39FF14' : (isWarn ? '#FFB800' : '#FF0055'),
          latency: `${apiData.latency_ms}ms`,
          rawOutput: simulatedResponse,
          hallucinatedSpans: apiData.verification_pipeline.detected_hallucinations || ['completely safe with 48 hours battery'],
          verifiedFact: apiData.verification_pipeline.suggested_correction,
          recommendation: `GUARD ACTION: ${apiData.guard_action} (Status: ${apiData.status}, Flagged: ${apiData.flag})`,
          sources: [
            { name: `Authoritative ${targetDomain.toUpperCase()} Feeds (${apiData.verification_pipeline.sources_checked} checked)`, url: '#' },
            { name: 'TruthBoard Real-Time Grounding Node', url: '#' }
          ],
          pipeline: {
            retrieval: `Ingested ${apiData.verification_pipeline.sources_checked} authoritative primary sources`,
            crossVerification: `Mismatches Detected: ${apiData.verification_pipeline.mismatches_found}`,
            action: apiData.guard_action
          }
        };
      } else {
        // Fallback client simulation
        DATA.presets.custom = {
          id: 'custom',
          name: 'Custom User Prompt',
          tag: 'USER STREAM TEST',
          model: currentModelKey.toUpperCase(),
          prompt: val,
          modelConfidence: '98.1% (Model Self-Reported)',
          riskLevel: 'HALLUCINATION FLAGGED',
          confidenceScore: 31,
          gaugeColor: '#FFB800',
          latency: '9.3ms',
          rawOutput: `Synthesized response to: "${val}". The model claims complete factual authority, however TruthBoard's NLI engine identified semantic divergence against 14 crawled authoritative ground-truth feeds.`,
          hallucinatedSpans: ['claims complete factual authority'],
          verifiedFact: `TRUTHBOARD AUDIT: Ingested live web & knowledge base grounding. Detected unsubstantiated assertion. Output flagged and held for developer review threshold (score: 31%).`,
          recommendation: 'REVIEW: Prompt flagged for human-in-the-loop or fallback grounding synthesis.',
          sources: [
            { name: 'Live Multi-Vector Grounding Corpus', url: '#' },
            { name: 'TruthBoard Global Knowledge Graph', url: '#' }
          ],
          pipeline: {
            retrieval: 'Dynamic Hybrid Vector Search (14 Datasets)',
            crossVerification: 'Semantic Drift Detected (Delta: -69%)',
            action: 'FLAGGED & ANNOTATED WITH CAUTION'
          }
        };
      }

      renderPreset('custom', true);
    });
  }

  /* ==========================================================================
     4. 4-Level Pipeline Stage Inspection Modal
     ========================================================================== */
  const stageCards = document.querySelectorAll('.pipeline-card');
  const stageModal = document.getElementById('stageDetailModal');
  const stageModalClose = document.getElementById('stageModalClose');
  const stageModalTitle = document.getElementById('stageModalTitle');
  const stageModalStep = document.getElementById('stageModalStep');
  const stageModalDesc = document.getElementById('stageModalDesc');
  const stageModalSim = document.getElementById('stageModalSim');
  const stageModalSpecs = document.getElementById('stageModalSpecs');

  function openStageModal(stageIndex) {
    const stage = DATA.pipelineStages[stageIndex];
    if (!stage || !stageModal) return;
    sound.playClick();

    stageModalStep.textContent = `STAGE // ${stage.step}`;
    stageModalTitle.textContent = `${stage.name}: ${stage.subtitle}`;
    stageModalDesc.textContent = stage.description;
    stageModalSim.textContent = stage.simulationDetail;

    stageModalSpecs.innerHTML = stage.specs.map(spec => `
      <li class="flex items-center gap-2 text-xs text-gray-300">
        <span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
        <span>${spec}</span>
      </li>
    `).join('');

    stageModal.classList.remove('hidden');
    stageModal.classList.add('flex');
    if (window.lucide) window.lucide.createIcons();
  }

  stageCards.forEach(card => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.dataset.stageIndex, 10);
      openStageModal(idx);
    });
  });

  if (stageModalClose && stageModal) {
    stageModalClose.addEventListener('click', () => {
      sound.playClick();
      stageModal.classList.add('hidden');
      stageModal.classList.remove('flex');
    });
  }

  /* ==========================================================================
     5. Real-World Vertical Use Case Tabs
     ========================================================================== */
  const useCaseTabs = document.querySelectorAll('.use-case-tab');
  const useCaseContainer = document.getElementById('useCaseContentArea');

  function renderUseCase(useCaseId) {
    const uc = DATA.useCases.find(u => u.id === useCaseId) || DATA.useCases[0];
    if (!uc || !useCaseContainer) return;

    useCaseTabs.forEach(tab => {
      if (tab.dataset.usecase === useCaseId) {
        tab.classList.add('bg-cyan-500/20', 'border-cyan-400', 'text-cyan-300', 'shadow-[0_0_15px_rgba(0,240,255,0.2)]');
        tab.classList.remove('bg-gray-900/60', 'border-gray-800', 'text-gray-400');
      } else {
        tab.classList.remove('bg-cyan-500/20', 'border-cyan-400', 'text-cyan-300', 'shadow-[0_0_15px_rgba(0,240,255,0.2)]');
        tab.classList.add('bg-gray-900/60', 'border-gray-800', 'text-gray-400');
      }
    });

    useCaseContainer.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div class="lg:col-span-5 space-y-5">
          <div class="inline-flex items-center gap-2 px-3 py-1 bg-purple-900/30 border border-purple-500/40 text-purple-300 rounded-full text-xs font-mono font-bold tracking-wide">
            <span class="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
            ${uc.badge}
          </div>
          <h3 class="text-2xl md:text-3xl font-extrabold font-orbitron text-white leading-tight">
            ${uc.headline}
          </h3>
          <p class="text-gray-300 text-sm leading-relaxed">
            ${uc.description}
          </p>
          <div class="grid grid-cols-2 gap-4 pt-2">
            <div class="p-4 bg-obsidian/70 border border-cyan-500/20 rounded">
              <div class="text-3xl font-extrabold font-orbitron text-cyan-400 text-glow-cyan">${uc.statNumber}</div>
              <div class="text-xs text-gray-400 font-mono mt-1">${uc.statLabel}</div>
            </div>
            <div class="p-4 bg-obsidian/70 border border-lime-500/20 rounded">
              <div class="text-3xl font-extrabold font-orbitron text-lime-400 text-glow-lime">${uc.secondaryStat}</div>
              <div class="text-xs text-gray-400 font-mono mt-1">${uc.secondaryLabel}</div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-7">
          <div class="cyber-panel p-6 rounded-lg cyber-cutout-tr border-cyan-500/30 space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-gray-800">
              <span class="text-xs font-mono text-gray-400 flex items-center gap-2">
                <i data-lucide="terminal" class="w-4 h-4 text-cyan-400"></i> LIVE DOMAIN INTERCEPT EXAMPLE
              </span>
              <span class="text-[10px] font-mono text-lime-400 bg-lime-950/40 px-2 py-0.5 rounded border border-lime-500/30">
                EDGE DEFENSE ONLINE
              </span>
            </div>

            <div>
              <div class="text-[11px] font-mono text-cyan-400 uppercase mb-1">User Query:</div>
              <div class="p-3 bg-obsidian rounded border border-gray-800 text-xs font-mono text-gray-200">
                "${uc.samplePrompt}"
              </div>
            </div>

            <div class="p-3.5 bg-red-950/20 border border-red-500/30 rounded text-xs font-mono space-y-1">
              <div class="text-red-400 font-bold flex items-center gap-1.5">
                <i data-lucide="alert-triangle" class="w-3.5 h-3.5"></i> Intercepted Raw AI Hallucination:
              </div>
              <p class="text-gray-300">
                ${uc.hallucinatedClaim}
              </p>
            </div>

            <div class="p-3.5 bg-lime-950/25 border border-lime-500/40 rounded text-xs font-mono space-y-1 glow-lime">
              <div class="text-lime-400 font-bold flex items-center gap-1.5">
                <i data-lucide="shield-check" class="w-3.5 h-3.5"></i> TruthBoard Intercept & Sanitize Action:
              </div>
              <p class="text-lime-200">
                ${uc.truthBoardAction}
              </p>
            </div>
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }

  useCaseTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      sound.playClick();
      renderUseCase(tab.dataset.usecase);
    });
  });

  /* ==========================================================================
     6. Enterprise API Code Hub
     ========================================================================== */
  const codeTabs = document.querySelectorAll('.code-tab-btn');
  const codeSnippetPre = document.getElementById('codeSnippetPre');
  const copyCodeBtn = document.getElementById('copyCodeBtn');

  function renderCodeSnippet(lang) {
    if (!codeSnippetPre || !DATA.codeSnippets[lang]) return;

    codeTabs.forEach(tab => {
      if (tab.dataset.lang === lang) {
        tab.classList.add('bg-cyan-500/20', 'border-cyan-400', 'text-cyan-300');
        tab.classList.remove('bg-transparent', 'border-transparent', 'text-gray-400');
      } else {
        tab.classList.remove('bg-cyan-500/20', 'border-cyan-400', 'text-cyan-300');
        tab.classList.add('bg-transparent', 'border-transparent', 'text-gray-400');
      }
    });

    codeSnippetPre.textContent = DATA.codeSnippets[lang];
  }

  codeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      sound.playClick();
      renderCodeSnippet(tab.dataset.lang);
    });
  });

  if (copyCodeBtn && codeSnippetPre) {
    copyCodeBtn.addEventListener('click', () => {
      sound.playSuccess();
      navigator.clipboard.writeText(codeSnippetPre.textContent).then(() => {
        const copyText = document.getElementById('copyCodeText');
        if (copyText) {
          copyText.textContent = 'COPIED TO CLIPBOARD!';
          setTimeout(() => {
            copyText.textContent = 'COPY CODE';
          }, 2000);
        }
      });
    });
  }

  /* ==========================================================================
     7. API Key & Deployment Modal
     ========================================================================== */
  const deployModal = document.getElementById('deployModal');
  const deployModalClose = document.getElementById('deployModalClose');
  const deployButtons = document.querySelectorAll('.trigger-deploy-modal');
  const copyApiKeyBtn = document.getElementById('copyApiKeyBtn');
  const genNewKeyBtn = document.getElementById('genNewKeyBtn');
  const apiKeyField = document.getElementById('apiKeyField');

  function openDeployModal() {
    sound.playClick();
    if (deployModal) {
      deployModal.classList.remove('hidden');
      deployModal.classList.add('flex');
    }
  }

  function closeDeployModal() {
    sound.playClick();
    if (deployModal) {
      deployModal.classList.add('hidden');
      deployModal.classList.remove('flex');
    }
  }

  deployButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openDeployModal();
    });
  });

  if (deployModalClose) {
    deployModalClose.addEventListener('click', closeDeployModal);
  }

  if (copyApiKeyBtn && apiKeyField) {
    copyApiKeyBtn.addEventListener('click', () => {
      sound.playSuccess();
      navigator.clipboard.writeText(apiKeyField.value).then(() => {
        copyApiKeyBtn.innerHTML = `<i data-lucide="check" class="w-3.5 h-3.5 text-lime-400"></i>`;
        if (window.lucide) window.lucide.createIcons();
        setTimeout(() => {
          copyApiKeyBtn.innerHTML = `<i data-lucide="copy" class="w-3.5 h-3.5"></i>`;
          if (window.lucide) window.lucide.createIcons();
        }, 2000);
      });
    });
  }

  if (genNewKeyBtn && apiKeyField) {
    genNewKeyBtn.addEventListener('click', () => {
      sound.playScan();
      const randomHex = Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      apiKeyField.value = `tg_live_${randomHex}`;
    });
  }

  /* ==========================================================================
     8. Terminal Execution Log Streamer (Footer)
     ========================================================================== */
  const terminalLogContainer = document.getElementById('terminalLogStream');
  if (terminalLogContainer) {
    const logPool = [
      { type: 'INTRCPT', text: 'token#8419 semantic_divergence=0.88 -> ACTION: AUTO_PATCH' },
      { type: 'GROUND',  text: 'PubChem CID 3672 matched -> verified 16/16 triples (delta 4.1ms)' },
      { type: 'ENTL_FAIL', text: 'Assertion "zero risk" contradicted by FDA Warning #WAR-IBU' },
      { type: 'GATEWAY', text: 'Edge proxy route us-east-1 -> latency=6.8ms -> confidence=98.4%' },
      { type: 'REWRITE', text: 'Substituted phantom IP68 claim with OEM IPX4 verified spec' },
      { type: 'SEC_EDGAR', text: 'Form 10-Q accession validated -> suppressed hallucinated dividend' },
      { type: 'BAYES_CALIB', text: 'Token entropy threshold crossed (H=4.12) -> routed to Stage 04' },
      { type: 'CROSSREF', text: 'DOI 10.1038/s41565-024-01994-x returned 404 -> GHOST DOI PURGED' }
    ];

    let logIndex = 0;
    setInterval(() => {
      const now = new Date().toISOString().substring(11, 19);
      const log = logPool[logIndex % logPool.length];
      logIndex++;

      const logRow = document.createElement('div');
      logRow.className = 'flex items-center gap-2 text-[11px] font-mono leading-tight hover:bg-cyan-950/20 py-0.5';
      logRow.innerHTML = `
        <span class="text-gray-500">[${now}]</span>
        <span class="text-cyan-400 font-bold">[${log.type}]</span>
        <span class="text-gray-300">${log.text}</span>
      `;
      terminalLogContainer.appendChild(logRow);

      // Keep only last 15 logs
      if (terminalLogContainer.children.length > 18) {
        terminalLogContainer.removeChild(terminalLogContainer.children[0]);
      }
      terminalLogContainer.scrollTop = terminalLogContainer.scrollHeight;
    }, 2800);
  }

  // System Uptime Real-Time Incrementer
  const uptimeCounter = document.getElementById('uptimeCounter');
  if (uptimeCounter) {
    let baseSeconds = 3491204;
    setInterval(() => {
      baseSeconds++;
      const days = Math.floor(baseSeconds / 86400);
      const hours = Math.floor((baseSeconds % 86400) / 3600);
      const mins = Math.floor((baseSeconds % 3600) / 60);
      const secs = baseSeconds % 60;
      uptimeCounter.textContent = `${days}d ${hours}h ${mins}m ${secs}s (99.999%)`;
    }, 1000);
  }

  // -------------------------------------------------------------------------
  // Live Telemetry Sync with FastAPI Backend (GET /api/v1/system-metrics)
  // -------------------------------------------------------------------------
  async function syncSystemMetrics() {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/v1/system-metrics');
      if (!res.ok) return;
      const data = await res.json();
      const statusEl = document.getElementById('telemetryStatus');
      const latencyEl = document.getElementById('telemetryLatency');
      const delusionEl = document.getElementById('telemetryDelusion');
      const beaconEl = document.getElementById('telemetryBeacon');

      if (statusEl) statusEl.textContent = 'FASTAPI_BACKEND // CONNECTED';
      if (latencyEl) latencyEl.textContent = `<${data.average_latency_ms}ms`;
      if (delusionEl) delusionEl.textContent = `${data.hallucination_block_rate_pct}%`;
      if (beaconEl) {
        beaconEl.className = 'w-2 h-2 rounded-full bg-lime-400 beacon-active';
      }
    } catch (e) {
      // Backend not running; keep offline indicator
      const statusEl = document.getElementById('telemetryStatus');
      if (statusEl && statusEl.textContent.includes('FASTAPI')) {
        statusEl.textContent = 'SIMULATOR MODE // STANDALONE';
      }
    }
  }

  syncSystemMetrics();
  setInterval(syncSystemMetrics, 4000);

  // Initial renders
  renderPreset('healthcare', false);
  renderUseCase('ecommerce');
  renderCodeSnippet('python');

  // Helper escape
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
});
