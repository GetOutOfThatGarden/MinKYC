# Phase 1: Robust Ingestion & Foundation

## Objective
Transition the MinKYC mobile app to a universal Expo foundation and implement high-reliability identity ingestion via MRZ OCR and NFC scanning.

## Strategy
We will first establish a production-grade Expo environment using Development Builds and custom Config Plugins to maintain low-level NFC access. Then, we will implement a dual-stage ingestion flow: MRZ scanning via OCR for automated key extraction, followed by a PACE-compliant NFC read. Finally, we will verify the entire flow with automated E2E tests and mock profiles.

## Cluster Wave Execution

### Wave 1: Foundation
- **[A] Architecture (01-01)**: Transition to Expo and setup custom NFC Config Plugins.

### Wave 2: Core Ingestion
- **[F] Frontend & [A] Architecture (01-02)**: Implement MRZ OCR scanning using `react-native-vision-camera`.
- **[A] Architecture & [F] Frontend (01-03)**: Integrate high-reliability, PACE-compliant NFC reader.

### Wave 3: Quality & Verification
- **[T] Testing (01-04)**: Create automated E2E tests for the scanning flow.
- **[V] Verification**: Final manual verification on a physical Android device.

## Progress Tracking
- [x] 01-01: Universal Expo Foundation
- [x] 01-02: MRZ OCR Scanning
- [x] 01-03: High-Reliability NFC
- [x] 01-04: Testing & Quality Assurance

## Success Criteria
- [x] App builds and runs on standard Android devices using Expo Development Builds.
- [x] NFC scanning successfully reads ePassport data using automated MRZ extraction.
- [x] Scanning flow is verified by automated E2E tests.
