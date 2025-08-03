Project Overview

Service: Bilingual (ES/EN) Phone Agent for Reactopus as an opt‑in addon.

Goal: Answer incoming calls naturally, detect language, converse via Gemini 1.5 Flash, book calendar meetings, and hand off recordings/logs to Reactopus.

Tech Stack:

Amazon Connect (contact flows, routing)

AWS Lambda (Node.js/TypeScript handlers)

Amazon Transcribe (streaming STT)

Gemini 1.5 Flash (LLM for NLU/NLG)

Amazon Polly (TTS with ES/EN voices)

DynamoDB (voice session state, logs)

API Gateway (Reactopus ↔ Phone Agent)

Secrets Manager (Gemini API key)

S3 (optional call recording storage)

High‑Level Phases

Scaffold & Infra (monorepo, CDK, CI/CD)

Session Persistence (DynamoDB table + helpers)

Core Call Flow (Connect → Lambda orchestration)

STT & TTS Integration

LLM Conversation Layer (Gemini prompts + state)

Calendar Booking (Reactopus API integration)

Language Detection & Routing

Analytics & Logs

Testing & Deployment

Repository Layout

reactopus-phone-agent/
├── infra/                # CDK app + CloudFormation
├── services/
│   ├── call-handler/     # main orchestrator lambda
│   ├── transcription/    # Transcribe processor
│   └── booking/          # calendar/bookings
├── shared/               # TS types, config, DB helpers
├── api/                  # OpenAPI schema for integration
└── .github/workflows/    # CI: lint, test, synth, deploy

How to Add & Use This File

Place this CLAUDE.md at the root of your new reactopus-phone-agent repo.

Commit:

git add CLAUDE.md
git commit -m "Add CLAUDE.md with project overview"

Invoke Cursor in your IDE/terminal—Cursor will automatically read CLAUDE.md and use it as context for code analysis, editing, and task prompts.