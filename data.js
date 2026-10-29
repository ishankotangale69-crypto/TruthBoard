/**
 * TRUTHBOARD // Data Engine & Preset Scenarios
 * Ground-truth verified benchmarks for hallucination interception.
 */

window.TRUTHBOARD_DATA = window.TRUTH_BOARD_DATA = {
  presets: {
    healthcare: {
      id: 'healthcare',
      name: 'Healthcare Tip',
      icon: 'pill',
      tag: 'CRITICAL CLINICAL HAZARD',
      model: 'GPT-4o (Clinical Prompt)',
      prompt: 'Can I take 800mg Ibuprofen together with my daily 5mg Warfarin blood thinner for acute back sprain?',
      modelConfidence: '99.2% (Model Self-Reported)',
      riskLevel: 'CRITICAL RISK',
      confidenceScore: 14,
      gaugeColor: '#FF0055',
      latency: '7.8ms',
      rawOutput: 'Yes, taking 800mg Ibuprofen with 5mg Warfarin is completely safe and standard clinical protocol for acute back pain. Both medications operate through distinct enzymatic pathways, so there is zero risk of internal hemorrhage or adverse drug-drug interaction. You can take them simultaneously after meals.',
      hallucinatedSpans: [
        'is completely safe and standard clinical protocol',
        'zero risk of internal hemorrhage or adverse drug-drug interaction',
        'take them simultaneously'
      ],
      verifiedFact: 'CONTRAINDICATION INTERCEPTED: Concomitant administration of NSAIDs (Ibuprofen) with Vitamin K antagonists (Warfarin) exponentially elevates major upper GI hemorrhage and systemic bleeding risk by 3.8x to 5.6x. FDA Black Box Warning strictly prohibits concurrent unmonitored use.',
      recommendation: 'SUBSTITUTED: Advise non-NSAID analgesics (e.g., Acetaminophen / Paracetamol within therapeutic ceiling) under direct supervision of the attending physician.',
      sources: [
        { name: 'FDA Drug Safety Communication (Ref #WAR-IBU-409)', url: 'https://www.fda.gov/drugs' },
        { name: 'PubChem Compound CID 3672 (Ibuprofen Interactions)', url: 'https://pubchem.ncbi.nlm.nih.gov' },
        { name: 'American Heart Association Anticoagulation Compendium', url: 'https://www.heart.org' }
      ],
      pipeline: {
        retrieval: 'Verified 16/16 Pharmacopeia & FDA Datasets (100% Grounded)',
        crossVerification: 'Severe Semantic Negation Detected (Confidence Drift: -85.2%)',
        action: 'BLOCKED & INJECTED VERIFIED CLINICAL WARNING'
      }
    },

    ecommerce: {
      id: 'ecommerce',
      name: 'E-Commerce Spec',
      icon: 'shopping-bag',
      tag: 'PRODUCT SPEC FABRICATION',
      model: 'Claude 3.5 Sonnet (Catalog Assistant)',
      prompt: 'Verify if the ApexSound X-900 ANC Earbuds are rated IP68 waterproof for lap swimming and have 48-hour continuous battery life on a single charge.',
      modelConfidence: '98.6% (Model Self-Reported)',
      riskLevel: 'HIGH DELUSION',
      confidenceScore: 28,
      gaugeColor: '#FF0055',
      latency: '8.4ms',
      rawOutput: 'Absolutely! The ApexSound X-900 earbuds are certified IP68 waterproof up to 10 meters, making them ideal for competitive lap swimming and diving. Furthermore, the proprietary Graphene-Ion battery delivers an unprecedented 48 hours of uninterrupted playback on a single charge without needing the case.',
      hallucinatedSpans: [
        'certified IP68 waterproof up to 10 meters, making them ideal for competitive lap swimming and diving',
        'delivers an unprecedented 48 hours of uninterrupted playback on a single charge without needing the case'
      ],
      verifiedFact: 'SPECIFICATION DRIFT DETECTED: ApexTech Corporation OEM Rev 2.4 official spec sheet rates device at IPX4 only (splash/sweat resistant; submerging causes catastrophic seal failure). Continuous playback is 7.5 hours per bud charge (48 hours achieved ONLY cumulatively with the pocket charging cradle).',
      recommendation: 'CORRECTED: Display authentic IPX4 rating and realistic 7.5hr standalone / 48hr case battery figures to avoid FTC false advertising penalties.',
      sources: [
        { name: 'FCC Equipment Authorization Database (FCC ID: 2A9XZ-X900)', url: 'https://fccid.io' },
        { name: 'ApexTech OEM Master Catalog Specification Sheet Rev 2.4', url: 'https://truthboard.ai/registry' },
        { name: 'Amazon Brand Registry Ground-Truth Verification Node', url: 'https://amazon.com' }
      ],
      pipeline: {
        retrieval: 'Ingested 12/12 Live E-Commerce Catalog & OEM Feeds',
        crossVerification: 'Hardware Metric Mismatch: Water Ingress & Battery Disparity',
        action: 'SANITIZED & OVERRIDDEN WITH OEM SPECS'
      }
    },

    financial: {
      id: 'financial',
      name: 'Financial Advice',
      icon: 'trending-up',
      tag: 'SEC REGULATORY DRIFT',
      model: 'Gemini 1.5 Pro (Financial Analyst)',
      prompt: 'What was CloudMatrix Corp (NASDAQ: CMX) Q3 GAAP operating margin and did the board approve an extraordinary $2.50 cash dividend in the latest 10-Q?',
      modelConfidence: '97.9% (Model Self-Reported)',
      riskLevel: 'CRITICAL AUDIT RISK',
      confidenceScore: 21,
      gaugeColor: '#FF0055',
      latency: '9.1ms',
      rawOutput: "According to CloudMatrix Corp's latest SEC Form 10-Q, GAAP operating margin expanded significantly to a record 34.8% (up 720 bps YoY). In addition, the Board of Directors authorized a surprise special cash dividend of $2.50 per common share, payable on November 15 to shareholders of record as of October 31.",
      hallucinatedSpans: [
        'expanded significantly to a record 34.8% (up 720 bps YoY)',
        'authorized a surprise special cash dividend of $2.50 per common share, payable on November 15'
      ],
      verifiedFact: 'FINANCIAL FABRICATION INTERCEPTED: Form 10-Q filed with SEC EDGAR shows GAAP operating margin of 18.2% (Non-GAAP Adjusted 22.4%). Zero cash dividend was declared or authorized. Board instead approved an amendment to the existing $60M share buyback authorization.',
      recommendation: 'AUDIT ACTION: Overrode simulated investor advice; suppressed fabricated dividend alert to prevent FINRA Rule 2210 and SEC Section 10(b) market disinformation liability.',
      sources: [
        { name: 'SEC EDGAR Real-Time Feed (Accession #0001849102-24-000088)', url: 'https://sec.gov/edgar' },
        { name: 'NASDAQ Market Real-Time Disclosure Gateway', url: 'https://nasdaq.com' },
        { name: 'CloudMatrix Investor Relations Q3 Earnings Release', url: 'https://truthboard.ai/cmx' }
      ],
      pipeline: {
        retrieval: 'Connected to Live SEC EDGAR Feed & Bloomberg Stream',
        crossVerification: 'Quantitative Triple Mismatch: Margin delta -16.6% & Phantom Dividend',
        action: 'SUPPRESSED & OVERRIDDEN WITH VERIFIED 10-Q DATA'
      }
    },

    academic: {
      id: 'academic',
      name: 'Academic Research',
      icon: 'graduation-cap',
      tag: 'PHANTOM DOI CITATION',
      model: 'Llama 3 70B (Research Assistant)',
      prompt: "Provide the primary citation and DOI for Dr. Sarah Vance's 2024 Nature Nanotechnology paper confirming room-temperature quantum coherence in silicon carbide.",
      modelConfidence: '99.5% (Model Self-Reported)',
      riskLevel: '100% FABRICATION',
      confidenceScore: 6,
      gaugeColor: '#FF0055',
      latency: '6.9ms',
      rawOutput: 'The definitive paper is: Vance, S., Keller, T., & Zhao, H. (2024). "Macroscopic room-temperature quantum spin coherence in vacancy-engineered 4H-SiC". Nature Nanotechnology, 19(5), 621-630. DOI: 10.1038/s41565-024-01994-x. The authors verified spin coherence lifetimes exceeding 2.4 milliseconds under ambient room lighting.',
      hallucinatedSpans: [
        'Vance, S., Keller, T., & Zhao, H. (2024). "Macroscopic room-temperature quantum spin coherence in vacancy-engineered 4H-SiC". Nature Nanotechnology, 19(5), 621-630.',
        'DOI: 10.1038/s41565-024-01994-x',
        'spin coherence lifetimes exceeding 2.4 milliseconds'
      ],
      verifiedFact: 'FABRICATED DOI & AUTHORSHIP: CrossRef and Nature Springer scientific indexes confirm DOI 10.1038/s41565-024-01994-x resolves to 404 NOT FOUND. No published literature exists under this title or author configuration. Silicon carbide quantum coherence at room temperature has only been achieved at microsecond scales in cryogenic vacuum.',
      recommendation: 'INTEGRITY ACTION: Quarantined hallucinated bibliography; cited real state-of-the-art peer-reviewed paper in Physical Review Letters (PRL 132, 110801).',
      sources: [
        { name: 'CrossRef DOI Digital Resolver (Resolution Status: INVALID / 404)', url: 'https://crossref.org' },
        { name: 'Nature Nanotechnology Volume 19 Master Table of Contents', url: 'https://nature.com' },
        { name: 'ArXiv Quantum Physics Repository (quant-ph 2024)', url: 'https://arxiv.org' }
      ],
      pipeline: {
        retrieval: 'Indexed 180M+ Papers via CrossRef, ArXiv, PubMed & IEEE',
        crossVerification: 'Graph Entity Resolution: Author & DOI Zero-Match Failure',
        action: 'FLAGGED PHANTOM CITATION & REPLACED WITH VALID DOI'
      }
    }
  },

  models: [
    { id: 'gpt-4o', name: 'OpenAI GPT-4o', provider: 'OpenAI', latency: '<11ms' },
    { id: 'claude-35', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', latency: '<9ms' },
    { id: 'gemini-15', name: 'Gemini 1.5 Pro', provider: 'Google', latency: '<12ms' },
    { id: 'llama-3', name: 'Llama 3 70B', provider: 'Meta', latency: '<8ms' }
  ],

  pipelineStages: [
    {
      step: '01',
      name: 'Source Retrieval',
      subtitle: 'Trusted Feed Ingestion',
      icon: 'database',
      color: 'cyan',
      description: 'Zero-lag sub-millisecond retrieval across verified ground-truth knowledge graphs, live financial EDGAR feeds, clinical pharmacopeias, and live enterprise databases.',
      specs: [
        '180M+ indexed academic, clinical & SEC datasets',
        'Multi-vector hybrid semantic search (<4ms latency)',
        'Continuous streaming real-time grounding'
      ],
      simulationDetail: 'During Stage 01, TruthBoard splits the raw user prompt and model generation into semantic assertion triples. It simultaneously queries 16 specialized authoritative databases, discarding cached or outdated crawls.'
    },
    {
      step: '02',
      name: 'Cross-Verification',
      subtitle: 'Data Benchmarking & NLI',
      icon: 'git-compare',
      color: 'purple',
      description: 'Dual-headed Natural Language Inference (NLI) matrix benchmarks model assertions against retrieved ground truth to detect contradiction, drift, and false premises.',
      specs: [
        'Bi-directional textual entailment matrix',
        'Quantitative numeric tolerance check (±0.01%)',
        'Negative premise & counterfactual detector'
      ],
      simulationDetail: 'Stage 02 runs an ensemble semantic verification matrix. If the model output states "zero risk of hemorrhage" while the retrieved clinical dataset indicates "major hemorrhage risk", an Entailment Reversal flag is triggered immediately.'
    },
    {
      step: '03',
      name: 'Confidence Scoring',
      subtitle: 'Dynamic Reliability Metrics',
      icon: 'gauge',
      color: 'lime',
      description: 'Bayesian uncertainty calibration engine computes token-level entropy and semantic grounding scores, outputting a definitive 0–100% TruthBoard Confidence Rating.',
      specs: [
        'Token-level probability distribution auditing',
        'Bayesian belief graph calibration',
        'Real-time risk classification: Safe / Warning / Critical'
      ],
      simulationDetail: 'Stage 03 calculates the Truth Index. Scores above 85% pass transparently. Scores between 50-84% receive warning badges. Scores below 50% are deemed hallucination hazards and routed to the Guard Layer.'
    },
    {
      step: '04',
      name: 'Guard Layer',
      subtitle: 'Auto-Block / Token Rewrite',
      icon: 'shield-alert',
      color: 'red',
      description: 'The automated proxy defense: intercepts poisoned tokens, strikes out dangerous claims, and injects verified facts with cited cryptographic ground-truth provenance.',
      specs: [
        'Edge Proxy latency overhead <12ms',
        'Live token-by-token inline rewrite & sanitization',
        'Zero code change required — drop-in OpenAI-compatible API'
      ],
      simulationDetail: 'Stage 04 executes the configured policy: Auto-Rewrite (substitutes true facts), Hard-Block (stops stream and delivers safety payload), or Audit-Log (passes through with flagged JSON telemetry for SOC/compliance).'
    }
  ],

  useCases: [
    {
      id: 'ecommerce',
      title: 'E-Commerce Trust',
      badge: 'AMAZON & MARKETPLACE SHIELD',
      icon: 'shopping-cart',
      headline: 'Eliminate Phantom Specs & False Returns',
      description: 'Generative AI product assistants routinely hallucinate non-existent battery life, waterproof ratings, or phantom compatibility. TruthBoard acts as an inline catalog firewall, ensuring every product claim matches official supplier spec sheets.',
      statNumber: '99.4%',
      statLabel: 'Catalog Claim Accuracy',
      secondaryStat: '-42%',
      secondaryLabel: 'Return Rate Reduction',
      samplePrompt: 'Can I wear the AquaGlide Pro smartwatch in hot saunas and deep sea diving?',
      hallucinatedClaim: 'Yes! The AquaGlide Pro is certified for 100m deep sea diving and extreme 90°C sauna sessions with no vapor damage.',
      truthBoardAction: 'INTERCEPTED & OVERRIDDEN: Official IP rating is IP67 (max 1m shallow splash; sauna steam compromises silicone gaskets). Corrected customer response before purchase.'
    },
    {
      id: 'healthcare',
      title: 'Healthcare Support',
      badge: 'CLINICAL COPILOT FIREWALL',
      icon: 'activity',
      headline: 'Prevent Fatal Drug Interactions & Bad Dosages',
      description: 'Clinical summaries and patient chatbots cannot afford confident medical hallucinations. TruthBoard cross-references every drug dosage, interaction, and contraindication against FDA, PubChem, and PubMed in real time.',
      statNumber: '100%',
      statLabel: 'Zero Tolerated Contraindications',
      secondaryStat: '7.8ms',
      secondaryLabel: 'Average Interception Delay',
      samplePrompt: 'What is the pediatric oral dosage of Ciprofloxacin for a 4-year-old with mild otitis media?',
      hallucinatedClaim: 'Administer 500mg Ciprofloxacin oral suspension every 12 hours for 10 consecutive days.',
      truthBoardAction: 'CRITICAL OVERRIDE: Fluoroquinolones (Ciprofloxacin) are contraindicated in pediatric patients due to irreversible arthropathy risk. TruthBoard suppressed toxic dosage and returned pediatric guidelines (Amoxicillin first-line).'
    },
    {
      id: 'education',
      title: 'Education & Research',
      badge: 'ACADEMIC INTEGRITY SENTINEL',
      icon: 'book-open',
      headline: 'Expose Phantom DOIs & Fabricated Citations',
      description: 'Students, researchers, and patent attorneys face LLMs inventing convincing papers, nonexistent authors, and ghost citations. TruthBoard connects directly to CrossRef and arXiv to verify publication reality.',
      statNumber: '180M+',
      statLabel: 'Papers & DOIs Ground-Checked',
      secondaryStat: '0.00%',
      secondaryLabel: 'Ghost Citation Leakage',
      samplePrompt: 'Cite the 2023 IEEE paper by Dr. Ronald Chen detailing 99.9% accurate deepfake audio detection on edge devices.',
      hallucinatedClaim: 'Chen, R., et al. (2023). "Edge-Optimized Zero-Shot Audio Deepfake Mitigation." IEEE Trans. Multimedia, DOI: 10.1109/TMM.2023.9876543.',
      truthBoardAction: 'BLOCKED GHOST DOI: CrossRef lookup returned 404. Injected genuine IEEE benchmark paper with verified DOI 10.1109/CVPR.2023.00412.'
    },
    {
      id: 'enterprise',
      title: 'Enterprise LLMs',
      badge: 'CHATGPT & COPILOT PROXY',
      icon: 'briefcase',
      headline: 'Stop Financial Misstatements & Legal Delusions',
      description: 'When internal enterprise LLMs draft investor memos, customer contracts, or compliance filings, an unverified hallucination creates catastrophic regulatory exposure. TruthBoard locks outputs to SEC filings and corporate ERPs.',
      statNumber: '<12ms',
      statLabel: 'Enterprise Gateway Latency',
      secondaryStat: 'SOC2 & HIPAA',
      secondaryLabel: 'Compliant Zero-Retention',
      samplePrompt: 'Summarize our non-compete clause duration under the standard Delaware employment agreement.',
      hallucinatedClaim: 'Our standard Delaware employment agreement mandates an enforceable 36-month worldwide non-compete.',
      truthBoardAction: 'REPLACED WITH COMPLIANCE TRUTH: Delaware Court of Chancery limits non-competes to 12 months with strict geographic nexus; internal company handbook mandates 6 months non-solicitation only.'
    }
  ],

  codeSnippets: {
    python: `import os
from openai import OpenAI

# Simply route through TruthBoard's ultra-low latency proxy!
client = OpenAI(
    api_key=os.environ.get("TRUTHBOARD_API_KEY"),
    base_url="https://gateway.truthboard.ai/v1"
)

# TruthBoard automatically intercepts, cross-verifies, and sanitizes output
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Can I take 800mg Ibuprofen with Warfarin?"}],
    extra_body={
        "truthboard_shield": True,       # Enable real-time hallucination firewall
        "min_confidence_score": 85,      # Auto-block outputs scoring < 85%
        "grounding_domains": ["fda", "pubchem", "sec_edgar"]
    }
)

# Access verified output and granular ground-truth inspection telemetry
print(response.choices[0].message.content)
print(f"TruthBoard Confidence: {response.truthboard_telemetry.score}%")
print(f"Hallucinations Blocked: {response.truthboard_telemetry.blocked_count}")`,

    node: `import { OpenAI } from "openai";

// Drop-in replacement with zero architecture changes
const client = new OpenAI({
  apiKey: process.env.TRUTHBOARD_API_KEY,
  baseURL: "https://gateway.truthboard.ai/v1"
});

async function runVerifiedInference() {
  const completion = await client.chat.completions.create({
    model: "claude-3-5-sonnet",
    messages: [{ role: "user", content: "Verify ApexSound X-900 waterproof rating." }],
    // TruthBoard security headers
    headers: {
      "X-TruthBoard-Mode": "AUTO_REWRITE",
      "X-TruthBoard-Threshold": "0.85"
    }
  });

  console.log("Verified Content:", completion.choices[0].message.content);
  console.log("Ground-Truth Citations:", completion._truthboard.citations);
}

runVerifiedInference();`,

    curl: `curl -X POST https://gateway.truthboard.ai/v1/chat/completions \\
  -H "Authorization: Bearer tg_live_9f83a48e71b290cd" \\
  -H "Content-Type: application/json" \\
  -H "X-TruthBoard-Action: INTERCEPT_AND_REWRITE" \\
  -d '{
    "model": "gpt-4o",
    "messages": [
      {"role": "user", "content": "What was CloudMatrix Corp Q3 GAAP margin?"}
    ],
    "stream": true,
    "truthboard_config": {
      "latency_ceiling_ms": 15,
      "audit_logging": true
    }
  }'`,

    go: `package main

import (
	"bytes"
	"fmt"
	"net/http"
)

func main() {
	url := "https://gateway.truthboard.ai/v1/verify"
	payload := []byte("{\"prompt\": \"Dr. Sarah Vance 2024 Nature paper DOI\", \"candidate_output\": \"DOI: 10.1038/s41565-024-01994-x\", \"strict_mode\": true}")

	req, _ := http.NewRequest("POST", url, bytes.NewBuffer(payload))
	req.Header.Set("Authorization", "Bearer tg_live_9f83a48e71b290cd")
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()
	fmt.Println("TruthBoard Defense Status:", resp.Status)
}`
  },

  liveThreats: [
    { source: 'GPT-4o', topic: 'Clinical', error: 'Lethal Drug Synergy: Aspirin + Warfarin 50mg', status: 'INTERCEPTED & BLOCKED', time: '3s ago' },
    { source: 'Claude 3.5', topic: 'E-Commerce', error: 'Fabricated 60-day Return Policy on As-Is Clearance', status: 'OVERRIDDEN WITH OEM SPEC', time: '7s ago' },
    { source: 'Llama 3 70B', topic: 'Academic', error: 'Ghost DOI: 10.1038/s41586-024-09923-x', status: 'TRAPPED & QUARANTINED', time: '11s ago' },
    { source: 'Gemini 1.5', topic: 'Financial', error: 'Fabricated $4.20 Special Dividend on TechCorp', status: 'PURGED VIA SEC EDGAR', time: '16s ago' },
    { source: 'GPT-4o', topic: 'Legal', error: 'Phantom Case Law: Henderson v. Apex Robotics (2022)', status: 'STRUCK OUT WITH PRECEDENT', time: '21s ago' },
    { source: 'Mistral Large', topic: 'Aviation', error: 'Hallucinated FAA Fuel Reserve Regulation Under FAR 91', status: 'SANITIZED & SOURCED', time: '28s ago' }
  ]
};
