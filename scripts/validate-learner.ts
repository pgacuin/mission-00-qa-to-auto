import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('====================================================');
console.log('  LogiStream QA Lab - Universal Validator');
console.log('====================================================\n');

let score = 0;
const totalPoints = 100;

const rootDir = path.join(__dirname, '..');

// Determine active mission based on existing spec or workflow files
const isMission08 = fs.existsSync(path.join(rootDir, 'tests/senior-release-gate.spec.ts'));
const isMission07 = fs.existsSync(path.join(rootDir, 'tests/incident-simulation.spec.ts'));
const isMission06 = fs.existsSync(path.join(rootDir, '.github/workflows/playwright-ci.yml'));
const isMission05 = fs.existsSync(path.join(rootDir, 'tests/accessibility-contract.spec.ts'));
const isMission04 = fs.existsSync(path.join(rootDir, 'tests/performance-budget.spec.ts'));
const isMission03 = fs.existsSync(path.join(rootDir, 'tests/shipment-state-machine.spec.ts'));
const isMission02 = fs.existsSync(path.join(rootDir, 'tests/customs-uat.spec.ts'));
const isMission00 = fs.existsSync(path.join(rootDir, 'tests/manual-to-auto-tc101.spec.ts'));

let missionName = 'Mission 01';
let specFile = 'tests/dispatch-dashboard.spec.ts';

if (isMission08) {
  missionName = 'Mission 08 (Senior Release Gate)';
  specFile = 'tests/senior-release-gate.spec.ts';
} else if (isMission07) {
  missionName = 'Mission 07 (Capstone)';
  specFile = 'tests/incident-simulation.spec.ts';
} else if (isMission06) {
  missionName = 'Mission 06';
  specFile = 'tests/dispatch-dashboard.spec.ts';
} else if (isMission05) {
  missionName = 'Mission 05';
  specFile = 'tests/accessibility-contract.spec.ts';
} else if (isMission04) {
  missionName = 'Mission 04';
  specFile = 'tests/performance-budget.spec.ts';
} else if (isMission03) {
  missionName = 'Mission 03';
  specFile = 'tests/shipment-state-machine.spec.ts';
} else if (isMission02) {
  missionName = 'Mission 02';
  specFile = 'tests/customs-uat.spec.ts';
} else if (isMission00) {
  missionName = 'Mission 00 (QA-to-Automation Bridge)';
  specFile = 'tests/manual-to-auto-tc101.spec.ts';
}

console.log(`🎯 Active Mission Detected: ${missionName}\n`);

// Common configuration checks
const tsConfigPath = path.join(rootDir, 'tsconfig.json');
if (!fs.existsSync(tsConfigPath)) {
  console.error('❌ Missing required file: tsconfig.json');
  process.exit(1);
}

// Check for TODOs or hardcoded waits across src, tests, and docs
function scanDirectory(dir: string, checkWaits: boolean) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      scanDirectory(fullPath, checkWaits);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.md')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('TODO FOR LEARNER')) {
        console.error(`❌ Incomplete implementation in ${path.relative(rootDir, fullPath)}: Remove all TODO markers.`);
        process.exit(1);
      }
      if (checkWaits && fullPath.endsWith('.ts') && content.includes('waitForTimeout')) {
        console.error(`❌ Anti-pattern detected in ${path.relative(rootDir, fullPath)}: Hardcoded page.waitForTimeout() is strictly forbidden.`);
        process.exit(1);
      }
    }
  }
}

scanDirectory(path.join(rootDir, 'src'), true);
scanDirectory(path.join(rootDir, 'tests'), true);
scanDirectory(path.join(rootDir, 'docs'), false);

console.log('✅ All files complete and free of TODOs or hardcoded waits.');
score += 30;

console.log('🔍 Running TypeScript compiler check (tsc --noEmit)...');
try {
  execSync('npx tsc --noEmit', { stdio: 'inherit' });
  console.log('✅ TypeScript strict type-checking passed.');
  score += 20;
} catch {
  console.error('❌ TypeScript compilation failed.');
  process.exit(1);
}

console.log(`\n🚀 Executing Playwright Test Suite for ${missionName}...`);
try {
  execSync(`npx playwright test ${specFile}`, { stdio: 'inherit' });
  score += 50;
} catch {
  console.error(`\n❌ Playwright test execution failed for ${missionName}.`);
}

console.log(`\n====================================================`);
console.log(`  FINAL GRADE: ${score} / ${totalPoints}`);
console.log(`====================================================`);

if (score === 100) {
  if (isMission08) {
    console.log('\n🏆 MISSION 08 (SENIOR RELEASE GATE) ACHIEVED (SFIA LEVEL 4–5 CERTIFIED) 🚀');
  } else if (isMission07) {
    console.log('\n🏆 FULL MID-LEVEL CURRICULUM COMPLETED: SFIA LEVEL 3–4 CERTIFIED! 🚀');
  } else if (isMission00) {
    console.log('\n🏆 MISSION 00 (QA-TO-AUTOMATION BRIDGE) ACHIEVED — READY FOR MISSION 01! 🚀');
  } else {
    console.log(`\n🏆 ${missionName.toUpperCase()} ACHIEVED (SFIA Level 3–4)`);
  }
  process.exit(0);
} else {
  process.exit(1);
}
