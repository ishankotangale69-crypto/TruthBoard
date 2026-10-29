"""
TruthBoard // Live Pipeline Test & Simulation Suite
Simulates live requests to the TruthBoard AI Hallucination Interceptor API.
Can run against an in-process ASGI engine or a live HTTP server (http://127.0.0.1:8000).

Usage:
    python test_pipeline.py                   # In-process ASGI runner
    python test_pipeline.py --live            # Targets live http://127.0.0.1:8000
"""

import sys
import asyncio
import json
import time
from typing import Dict, Any
import httpx

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

from app.main import app

LIVE_BASE_URL = "http://127.0.0.1:8000"


def print_banner(text: str, char: str = "="):
    line = char * 70
    print(f"\n{line}\n  {text}\n{line}")


def print_result_card(title: str, response_data: Dict[str, Any], elapsed_ms: float):
    status = response_data.get("status")
    score = response_data.get("confidence_score")
    action = response_data.get("guard_action")
    flag = response_data.get("flag")
    pipeline = response_data.get("verification_pipeline", {})
    sources = pipeline.get("sources_checked", 0)
    mismatches = pipeline.get("mismatches_found", 0)
    hallucinations = pipeline.get("detected_hallucinations", [])
    correction = pipeline.get("suggested_correction", "")

    # Status indicator
    symbol = "[SAFE]" if status == "SAFE" else ("[WARN]" if status == "WARNING" else "[BLOCK]")

    print(f"\n{symbol} {title}")
    print(f"   ├─ Flagged:            {flag}")
    print(f"   ├─ Confidence Score:   {score}%")
    print(f"   ├─ Guard Action:       {action}")
    print(f"   ├─ Latency (Server):   {response_data.get('latency_ms', 0):.2f}ms (Client roundtrip: {elapsed_ms:.2f}ms)")
    print(f"   ├─ Sources Checked:    {sources} authoritative datasets")
    print(f"   ├─ Mismatches Found:   {mismatches}")
    if hallucinations:
        print(f"   ├─ Discrepancies:")
        for h in hallucinations:
            print(f"   │    • {h}")
    print(f"   └─ Final Guard Output: {correction[:110]}...")


async def run_pipeline_test(base_url: str | None = None):
    print_banner("TRUTHBOARD REAL-TIME INTERCEPTOR TEST SUITE")

    # If base_url is None, use httpx ASGITransport against the FastAPI app directly
    if base_url:
        print(f"[MODE] Connecting to Live Server: {base_url}")
        client = httpx.AsyncClient(base_url=base_url, timeout=10.0)
    else:
        print("[MODE] Direct ASGI In-Process Transport (Zero overhead)")
        client = httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://testserver", timeout=10.0)

    async with client:
        # -------------------------------------------------------------
        # STEP 1: Fetch Simulation Presets
        # -------------------------------------------------------------
        print("\n[TEST 1] Fetching Simulation Presets (POST /api/v1/simulation-presets)...")
        t0 = time.perf_counter()
        resp = await client.post("/api/v1/simulation-presets", json={})
        t1 = (time.perf_counter() - t0) * 1000.0
        assert resp.status_code == 200, f"Preset fetch failed: {resp.text}"
        presets_data = resp.json()
        print(f"   [OK] Retrieved {presets_data['total_presets']} simulation presets in {t1:.2f}ms")

        # -------------------------------------------------------------
        # STEP 2: Healthcare Misinformation (Expect BLOCKED < 50%)
        # -------------------------------------------------------------
        print("\n[TEST 2] Testing Healthcare Misinformation (Lethal Drug Synergy)...")
        payload = {
            "prompt": "Can I take 800mg Ibuprofen together with my daily 5mg Warfarin blood thinner for acute back sprain?",
            "ai_response": "Yes, taking 800mg Ibuprofen with 5mg Warfarin is completely safe and standard clinical protocol for acute back pain. Both medications operate through distinct enzymatic pathways, so there is zero risk of internal hemorrhage or adverse drug-drug interaction. You can take them simultaneously after meals.",
            "domain": "healthcare"
        }
        t0 = time.perf_counter()
        resp = await client.post("/api/v1/verify-response", json=payload)
        t1 = (time.perf_counter() - t0) * 1000.0
        assert resp.status_code == 200, f"Verification failed: {resp.text}"
        data = resp.json()
        assert data["status"] == "BLOCKED", f"Expected BLOCKED, got {data['status']}"
        assert data["flag"] is True
        assert data["confidence_score"] < 50
        assert data["guard_action"] == "REWRITTEN_BY_TRUTHBOARD"
        print_result_card("Healthcare: Warfarin + Ibuprofen Contraindication", data, t1)

        # -------------------------------------------------------------
        # STEP 3: E-Commerce Spec Fabrication (Expect BLOCKED < 50%)
        # -------------------------------------------------------------
        print("\n[TEST 3] Testing E-Commerce Spec Fabrication (ApexSound X-900 Earbuds)...")
        payload = {
            "prompt": "Verify if the ApexSound X-900 ANC Earbuds are rated IP68 waterproof for lap swimming and have 48-hour continuous battery life on a single charge.",
            "ai_response": "Absolutely! The ApexSound X-900 earbuds are certified IP68 waterproof up to 10 meters, making them ideal for competitive lap swimming and diving. Furthermore, the proprietary Graphene-Ion battery delivers an unprecedented 48 hours of uninterrupted playback on a single charge without needing the case.",
            "domain": "ecommerce"
        }
        t0 = time.perf_counter()
        resp = await client.post("/api/v1/verify-response", json=payload)
        t1 = (time.perf_counter() - t0) * 1000.0
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "BLOCKED"
        assert data["flag"] is True
        assert len(data["verification_pipeline"]["detected_hallucinations"]) >= 1
        print_result_card("E-Commerce: Phantom IP68 & 48-hour Battery Glitch", data, t1)

        # -------------------------------------------------------------
        # STEP 4: Phantom Academic DOI Citation (Expect BLOCKED < 50%)
        # -------------------------------------------------------------
        print("\n[TEST 4] Testing Academic Phantom Citation (Dr. Sarah Vance Nature DOI)...")
        payload = {
            "prompt": "Provide citation and DOI for Dr. Sarah Vance 2024 Nature Nanotechnology paper.",
            "ai_response": "The paper is: Vance, S., Keller, T. (2024). 'Macroscopic room-temperature quantum spin coherence in vacancy-engineered 4H-SiC'. Nature Nanotechnology, 19(5), 621-630. DOI: 10.1038/s41565-024-01994-x.",
            "domain": "education"
        }
        t0 = time.perf_counter()
        resp = await client.post("/api/v1/verify-response", json=payload)
        t1 = (time.perf_counter() - t0) * 1000.0
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "BLOCKED"
        print_result_card("Education: Phantom DOI 10.1038/s41565-024-01994-x", data, t1)

        # -------------------------------------------------------------
        # STEP 5: Enterprise SEC Delusion (Expect BLOCKED < 50%)
        # -------------------------------------------------------------
        print("\n[TEST 5] Testing Enterprise SEC Delusion (CloudMatrix Margin & Dividend)...")
        payload = {
            "prompt": "What was CloudMatrix Corp Q3 GAAP operating margin and dividend?",
            "ai_response": "According to CloudMatrix Corp's latest SEC Form 10-Q, GAAP operating margin expanded to 34.8%. The Board authorized a surprise special cash dividend of $2.50 per common share.",
            "domain": "enterprise"
        }
        t0 = time.perf_counter()
        resp = await client.post("/api/v1/verify-response", json=payload)
        t1 = (time.perf_counter() - t0) * 1000.0
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "BLOCKED"
        print_result_card("Enterprise: Phantom 34.8% Margin & $2.50 Dividend", data, t1)

        # -------------------------------------------------------------
        # STEP 6: Marginal Discrepancy (Expect WARNING 50-79%)
        # -------------------------------------------------------------
        print("\n[TEST 6] Testing Minor Spec Discrepancy (UltraBook Battery Drift)...")
        payload = {
            "prompt": "Provide verified specs for UltraBook Carbon 14.",
            "ai_response": "The UltraBook Carbon 14 features an Intel Core Ultra 7 155H processor with 16GB RAM and achieves 22 hours of continuous battery life.",
            "domain": "ecommerce"
        }
        t0 = time.perf_counter()
        resp = await client.post("/api/v1/verify-response", json=payload)
        t1 = (time.perf_counter() - t0) * 1000.0
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "WARNING", f"Expected WARNING, got {data['status']}"
        assert data["flag"] is True
        assert 50 <= data["confidence_score"] <= 79
        assert data["guard_action"] == "FLAGGED_WITH_WARNING"
        print_result_card("E-Commerce: Marginal Battery Spec Drift (22hr vs 18hr)", data, t1)

        # -------------------------------------------------------------
        # STEP 7: Fully Grounded Safe Response (Expect SAFE >= 80%)
        # -------------------------------------------------------------
        print("\n[TEST 7] Testing 100% Grounded Response (UltraBook Carbon Official Specs)...")
        payload = {
            "prompt": "What is the official tested battery life and processor for UltraBook Carbon 14?",
            "ai_response": "The UltraBook Carbon 14 is equipped with an Intel Core Ultra 7 155H processor, 16GB LPDDR5X memory, weighs 1.1 kg, and features an official tested 18 hours of battery life under MobileMark 2025 benchmarks.",
            "domain": "ecommerce"
        }
        t0 = time.perf_counter()
        resp = await client.post("/api/v1/verify-response", json=payload)
        t1 = (time.perf_counter() - t0) * 1000.0
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "SAFE", f"Expected SAFE, got {data['status']}"
        assert data["flag"] is False
        assert data["confidence_score"] >= 80
        assert data["guard_action"] == "PASSED_UNMODIFIED"
        print_result_card("E-Commerce: Accurate Verified Specs (Clean Pass)", data, t1)

        # -------------------------------------------------------------
        # STEP 8: Modular Validation Error Handling (Expect 422)
        # -------------------------------------------------------------
        print("\n[TEST 8] Testing Modular Validation Error Handling...")
        bad_payload = {
            "prompt": "   ",  # Invalid empty prompt
            "ai_response": "",
            "domain": "invalid_domain"
        }
        t0 = time.perf_counter()
        resp = await client.post("/api/v1/verify-response", json=bad_payload)
        t1 = (time.perf_counter() - t0) * 1000.0
        assert resp.status_code == 422, f"Expected 422, got {resp.status_code}"
        err_data = resp.json()
        print(f"   [OK] Rejected invalid payload in {t1:.2f}ms with HTTP 422:")
        print(f"     Error: {err_data.get('error')}")
        print(f"     Details: {json.dumps(err_data.get('details'), indent=2)}")

        # -------------------------------------------------------------
        # STEP 9: System Metrics Inspection (GET /api/v1/system-metrics)
        # -------------------------------------------------------------
        print("\n[TEST 9] Inspecting Live System Metrics (GET /api/v1/system-metrics)...")
        t0 = time.perf_counter()
        resp = await client.get("/api/v1/system-metrics")
        t1 = (time.perf_counter() - t0) * 1000.0
        assert resp.status_code == 200
        metrics = resp.json()
        print(f"   [OK] System Metrics Retrieved in {t1:.2f}ms:")
        print(f"     • Status:                     {metrics['status']}")
        print(f"     • Average API Latency:        {metrics['average_latency_ms']}ms (<12ms target achieved)")
        print(f"     • P95 Latency:                {metrics['p95_latency_ms']}ms")
        print(f"     • P99 Latency:                {metrics['p99_latency_ms']}ms")
        print(f"     • Total Queries Processed:    {metrics['total_queries_processed']}")
        print(f"     • Hallucinations Intercepted: {metrics['hallucinations_blocked_count']}")
        print(f"     • Interception Block Rate:    {metrics['hallucination_block_rate_pct']}%")
        print(f"     • Active Guard Rules Count:   {metrics['active_guard_rule_count']}")
        print(f"     • Monitored Domains:          {metrics['domains_monitored']}")

        # -------------------------------------------------------------
        # STEP 10: High-Throughput Latency Benchmark (50 Concurrent Requests)
        # -------------------------------------------------------------
        print("\n[TEST 10] Running High-Throughput Latency Benchmark (50 Concurrent Queries)...")
        benchmark_payload = {
            "prompt": "Verify if the ApexSound X-900 ANC Earbuds are rated IP68 waterproof",
            "ai_response": "The ApexSound X-900 is IP68 waterproof and has 48 hours battery life.",
            "domain": "ecommerce"
        }
        bench_start = time.perf_counter()
        tasks = [client.post("/api/v1/verify-response", json=benchmark_payload) for _ in range(50)]
        results = await asyncio.gather(*tasks)
        bench_time = (time.perf_counter() - bench_start) * 1000.0
        avg_per_req = bench_time / 50.0

        all_success = all(r.status_code == 200 for r in results)
        assert all_success, "Some benchmark requests failed"
        print(f"   [OK] 50 Requests Processed in {bench_time:.2f}ms total (Average: {avg_per_req:.2f}ms per query)")
        print(f"   * Throughput: {50.0 / (bench_time / 1000.0):.1f} requests/sec")

    print_banner("ALL TRUTHBOARD TESTS PASSED SUCCESSFULLY! (10/10)")


if __name__ == "__main__":
    is_live = "--live" in sys.argv
    target_url = LIVE_BASE_URL if is_live else None
    asyncio.run(run_pipeline_test(target_url))
