# Automation Triage Decision Matrix — Shipment Intake Module

Complete the **Decision & Engineering Rationale** column below to justify what should be automated at the UI layer, shifted to API tests, or kept manual.

| Test Scenario | Target Layer (UI / API / Manual) | Engineering Rationale |
| :--- | :--- | :--- |
| **TC-101:** End-to-end shipment creation and `DISPATCH_QUEUED` badge verification | `UI (Playwright)` | High regression frequency; verifies critical end-user workflow and DOM state transition. |
| **TC-102:** Negative weight (`-50 kg`) and missing origin field validation | `TODO FOR LEARNER` | *(Explain why API-level validation is faster and less brittle than UI tests)* |
| **TC-103:** Interactive map pin drag-and-drop visual alignment on mobile viewports | `TODO FOR LEARNER` | *(Explain why visual/ergonomic polish is best suited for exploratory manual QA)* |
