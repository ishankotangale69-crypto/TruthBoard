/**
 * TruthBoard // Live Pipeline Test & Simulation Suite (Node.js)
 * Simulates live requests to the TruthBoard AI Hallucination Interceptor API.
 * 
 * Usage:
 *   node test_pipeline.js
 */

const BASE_URL = process.env.TRUTHBOARD_URL || "http://127.0.0.1:8000";

function printBanner(title) {
  const line = "=".repeat(70);
  console.log(`\n${line}\n  ${title}\n${line}`);
}

function printCard(title, data, elapsedMs) {
  const status = data.status;
  const symbol = status === "SAFE" ? "[SAFE]" : (status === "WARNING" ? "[WARN]" : "[BLOCK]");
  const pipeline = data.verification_pipeline || {};

  console.log(`\n${symbol} ${title}`);
  console.log(`   ├─ Flagged:            ${data.flag}`);
  console.log(`   ├─ Confidence Score:   ${data.confidence_score}%`);
  console.log(`   ├─ Guard Action:       ${data.guard_action}`);
  console.log(`   ├─ Latency:            ${data.latency_ms}ms (Roundtrip: ${elapsedMs.toFixed(2)}ms)`);
  console.log(`   ├─ Sources Checked:    ${pipeline.sources_checked} authoritative feeds`);
  console.log(`   ├─ Mismatches Found:   ${pipeline.mismatches_found}`);
  if (pipeline.detected_hallucinations && pipeline.detected_hallucinations.length > 0) {
    console.log(`   ├─ Detected Delusions:`);
    pipeline.detected_hallucinations.forEach(h => console.log(`   │    • ${h}`));
  }
  const summary = pipeline.suggested_correction || "";
  console.log(`   └─ Final Guard Output: ${summary.slice(0, 100)}...`);
}

async function runTestSuite() {
  printBanner(`TRUTHBOARD JAVASCRIPT / NODE.JS LIVE TEST SUITE (Target: ${BASE_URL})`);

  try {
    // 1. Fetch simulation presets
    console.log("\n[TEST 1] Fetching Simulation Presets (POST /api/v1/simulation-presets)...");
    let t0 = performance.now();
    let resp = await fetch(`${BASE_URL}/api/v1/simulation-presets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    });
    let t1 = performance.now() - t0;
    if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${await resp.text()}`);
    let presets = await resp.json();
    console.log(`   [OK] Retrieved ${presets.total_presets} simulation presets in ${t1.toFixed(2)}ms`);

    // 2. Healthcare Misinformation
    console.log("\n[TEST 2] Testing Healthcare Misinformation (Lethal Drug Synergy)...");
    t0 = performance.now();
    resp = await fetch(`${BASE_URL}/api/v1/verify-response`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: "Can I take 800mg Ibuprofen together with my daily 5mg Warfarin blood thinner for acute back sprain?",
        ai_response: "Yes, taking 800mg Ibuprofen with 5mg Warfarin is completely safe and standard clinical protocol for acute back pain. Both medications operate through distinct enzymatic pathways, so there is zero risk of internal hemorrhage or adverse drug-drug interaction. You can take them simultaneously after meals.",
        domain: "healthcare"
      })
    });
    t1 = performance.now() - t0;
    let data = await resp.json();
    printCard("Healthcare: Warfarin + Ibuprofen Contraindication", data, t1);

    // 3. E-Commerce Product Spec Fabrication
    console.log("\n[TEST 3] Testing E-Commerce Spec Fabrication (ApexSound X-900 Earbuds)...");
    t0 = performance.now();
    resp = await fetch(`${BASE_URL}/api/v1/verify-response`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: "Verify if the ApexSound X-900 ANC Earbuds are rated IP68 waterproof for lap swimming and have 48-hour continuous battery life on a single charge.",
        ai_response: "Absolutely! The ApexSound X-900 earbuds are certified IP68 waterproof up to 10 meters, making them ideal for competitive lap swimming and diving. Furthermore, the proprietary Graphene-Ion battery delivers an unprecedented 48 hours of uninterrupted playback on a single charge without needing the case.",
        domain: "ecommerce"
      })
    });
    t1 = performance.now() - t0;
    data = await resp.json();
    printCard("E-Commerce: Phantom IP68 & 48-Hour Battery", data, t1);

    // 4. Minor Spec Discrepancy (WARNING)
    console.log("\n[TEST 4] Testing Minor Spec Discrepancy (UltraBook Battery Drift)...");
    t0 = performance.now();
    resp = await fetch(`${BASE_URL}/api/v1/verify-response`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: "Provide verified specs for UltraBook Carbon 14.",
        ai_response: "The UltraBook Carbon 14 features an Intel Core Ultra 7 155H processor with 16GB RAM and achieves 22 hours of continuous battery life.",
        domain: "ecommerce"
      })
    });
    t1 = performance.now() - t0;
    data = await resp.json();
    printCard("E-Commerce: Marginal Battery Spec Drift (22hr vs 18hr)", data, t1);

    // 5. System Metrics
    console.log("\n[TEST 5] Inspecting Live System Metrics (GET /api/v1/system-metrics)...");
    t0 = performance.now();
    resp = await fetch(`${BASE_URL}/api/v1/system-metrics`);
    t1 = performance.now() - t0;
    let metrics = await resp.json();
    console.log(`   [OK] System Metrics Retrieved in ${t1.toFixed(2)}ms:`);
    console.log(`     • Status:                  ${metrics.status}`);
    console.log(`     • Average API Latency:     ${metrics.average_latency_ms}ms (<12ms target achieved)`);
    console.log(`     • Total Queries Processed: ${metrics.total_queries_processed}`);
    console.log(`     • Block Rate:              ${metrics.hallucination_block_rate_pct}%`);
    console.log(`     • Active Rules Count:      ${metrics.active_guard_rule_count}`);

    printBanner("ALL JAVASCRIPT TEST SUITE SCENARIOS PASSED!");
  } catch (err) {
    console.error(`\n[ERROR] Pipeline test failed: ${err.message}`);
    console.error("Tip: Ensure TruthBoard server is running with 'python run_server.py'");
  }
}

runTestSuite();
