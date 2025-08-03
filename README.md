# Reactopus Phone Agent

## Project Overview

The Reactopus Phone Agent is a bilingual (Spanish/English) AI-powered phone service designed as an opt-in addon for Reactopus. This intelligent phone agent handles incoming calls naturally, automatically detects the caller's language, conducts conversations using Google's Gemini 1.5 Flash LLM, books calendar meetings, and seamlessly integrates with the Reactopus platform by providing call recordings and conversation logs.

The service provides a complete voice-first customer interaction experience, allowing businesses to offer 24/7 multilingual phone support with advanced natural language understanding and automated appointment scheduling capabilities.

## Goals

- **Natural Conversation**: Provide human-like phone interactions using advanced AI
- **Multilingual Support**: Seamlessly handle both Spanish and English conversations with automatic language detection
- **Meeting Scheduling**: Integrate with calendar systems to book appointments during calls
- **Seamless Integration**: Hand off call recordings, transcripts, and interaction logs to the Reactopus platform
- **Scalable Architecture**: Build on AWS infrastructure for reliable, scalable service delivery
- **Real-time Processing**: Provide immediate speech-to-text, AI processing, and text-to-speech responses

## Architecture

```
[Architecture Diagram Placeholder]

High-level flow:
Incoming Call → Amazon Connect → Lambda Orchestrator → Transcription (Amazon Transcribe) 
→ AI Processing (Gemini 1.5 Flash) → Response Generation → Text-to-Speech (Amazon Polly) 
→ Call Response → Session Storage (DynamoDB) → Integration with Reactopus API
```

*Detailed architecture diagram to be added showing the complete call flow, AWS services integration, and data persistence layers.*

## Tech Stack

### AWS Services
- **AWS Amplify Gen 2**: Modern full-stack development platform for building and deploying the application
- **Amazon Connect**: Contact center service for call routing and contact flows
- **AWS Lambda**: Serverless compute for handling call processing logic (Node.js/TypeScript)
- **Amazon Transcribe**: Real-time speech-to-text conversion with streaming capabilities
- **Amazon Polly**: Text-to-speech service with Spanish and English voice options
- **DynamoDB**: NoSQL database for voice session state management and call logs
- **API Gateway**: RESTful API interface for Reactopus integration
- **AWS Secrets Manager**: Secure storage for API keys and sensitive configuration
- **Amazon S3**: Optional storage for call recordings and media files

### AI & External Services
- **Gemini 1.5 Flash**: Google's advanced language model for natural language understanding and generation

### Development & Deployment
- **TypeScript/Node.js**: Primary development languages
- **AWS CDK**: Infrastructure as Code for resource provisioning
- **GitHub Actions**: CI/CD pipeline for automated testing and deployment

## Repository Structure

```
reactopus-phone-agent/
├── infra/                # CDK app + CloudFormation templates
├── services/
│   ├── call-handler/     # Main orchestrator Lambda function
│   ├── transcription/    # Amazon Transcribe processor
│   └── booking/          # Calendar and booking integration
├── shared/               # TypeScript types, configuration, DB helpers
├── api/                  # OpenAPI schema for Reactopus integration
├── .github/workflows/    # CI: lint, test, synth, deploy
└── README.md            # This file
```

## Development Phases

1. **Scaffold & Infrastructure**: Monorepo setup, CDK configuration, CI/CD pipeline
2. **Session Persistence**: DynamoDB table design and helper functions
3. **Core Call Flow**: Amazon Connect integration with Lambda orchestration
4. **STT & TTS Integration**: Real-time speech processing pipeline
5. **LLM Conversation Layer**: Gemini prompts and conversation state management
6. **Calendar Booking**: Reactopus API integration for appointment scheduling
7. **Language Detection & Routing**: Multilingual conversation handling
8. **Analytics & Logs**: Comprehensive monitoring and logging
9. **Testing & Deployment**: End-to-end testing and production deployment

## Getting Started

*Setup instructions to be added as development progresses*

## Contributing

*Contributing guidelines to be established*

## License

*License information to be added*