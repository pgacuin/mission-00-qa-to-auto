import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('============================================================');
console.log('  LogiStream QA Lab - Mission 00 Bridge Validator');
console.log('============================================================\n');

const rootDir = path.join(__dirname, '..');
let score = 0;
const totalPoints = 100;

const triagePath = path.join(rootDir, 'docs/triage-matrix-TC-101.md');
const pageObjectPath = path.join(rootDir, 'src/pages/ShipmentIntakePage.ts');
const specPath = path.join(rootDir, 'tests/manual-to-auto-tc101.spec.ts');
const tsConfigPath = path.join(rootDir, 'tsconfig.json');

for (const requiredFile of [triagePath, pageObjectPath, specPath, tsConfigPath]) {
  if (!fs.existsSync(requiredFile)) {
    console.error(`❌ Missing required file: ${path.relative(rootDir, requiredFile)}`);
    process.exit(1);
  }
}

const triageContent = fs.readFileSync(triagePath, 'utf8');
const pageObjectContent = fs.readFileSync(pageObjectPath, 'utf8');
const specContent = fs.readFileSync(specPath, 'utf8');

// 1. Check for leftover TODOs and forbidden waitForTimeout (20 pts)
const combinedCode = `${pageObjectContent}\n${specContent}`;
if (
  triageContent.includes('TODO FOR LEARNER') ||
  pageObjectContent.includes('TODO FOR LEARNER') ||
  specContent.includes('TODO FOR LEARNER')
) {
  console.error('❌ Found remaining "TODO FOR LEARNER" markers. Complete all tasks first.');
  process.exit(1);
}

if (combinedCode.includes('waitForTimeout')) {
  console.error('❌ Anti-pattern detected: "waitForTimeout" is forbidden in Mission 00.');
  process.exit(1);
}
score += 20;
console.log('✅ [20/20] No TODO markers or waitForTimeout calls found.');

// 2. Check Triage Matrix answers for TC-102 (API) and TC-103 (Manual) (20 pts)
const rows = triageContent
  .split('\n')
  .map((line) => line.trim())
  .filter((line) => line.startsWith('|') && !line.startsWith('| :---') && !line.includes('Test Scenario'));

const tc102Row = rows.find((r) => r.includes('TC-102')) ?? '';
const tc103Row = rows.find((r) => r.includes('TC-103')) ?? '';

const tc102Cells = tc102Row.split('|').map((c) => c.trim()).filter(Boolean);
const tc103Cells = tc103Row.split('|').map((c) => c.trim()).filter(Boolean);

const hasValidTc102 =
  tc102Cells.length >= 3 &&
  /\bapi\b/i.test(tc102Cells[1]) &&
  tc102Cells[2].length >= 15;

const hasValidTc103 =
  tc103Cells.length >= 3 &&
  /\bmanual\b/i.test(tc103Cells[1]) &&
  tc103Cells[2].length >= 15;

if (!hasValidTc102 || !hasValidTc103) {
  console.error('❌ Triage Matrix check failed:');
  if (!hasValidTc102) {
    console.error('   - TC-102 should target "API" with a clear engineering rationale.');
  }
  if (!hasValidTc103) {
    console.error('   - TC-103 should target "Manual" with a clear engineering rationale.');
  }
  process.exit(1);
}
score += 20;
console.log('✅ [20/20] Triage Matrix answers validated (TC-102 -> API, TC-103 -> Manual).');

// 3. Check Page Object refactoring & Test Spec calls (20 pts)
const forbiddenLocatorPatterns = [
  'nth-child(',
  '//form',
  'form-control-sm',
  'btn-success',
  'div.toolbar'
];

const hasForbiddenLocator = forbiddenLocatorPatterns.some((pattern) =>
  pageObjectContent.includes(pattern)
);

const hasSemanticLocators =
  pageObjectContent.includes('getByRole(') &&
  pageObjectContent.includes('getByLabel(') &&
  pageObjectContent.includes("getByRole('row'");

const hasSpecFlow =
  specContent.includes('createShipment(') &&
  specContent.includes('expectShipmentQueued(');

if (hasForbiddenLocator || !hasSemanticLocators || !hasSpecFlow) {
  console.error('❌ Automation refactoring check failed:');
  if (hasForbiddenLocator) {
    console.error('   - Remove brittle CSS/XPath locators from ShipmentIntakePage.ts.');
  }
  if (!hasSemanticLocators) {
    console.error('   - Use getByRole, getByLabel, and getByRole("row") in ShipmentIntakePage.ts.');
  }
  if (!hasSpecFlow) {
    console.error('   - Call both createShipment(...) and expectShipmentQueued(...) in manual-to-auto-tc101.spec.ts.');
  }
  process.exit(1);
}
score += 20;
console.log('✅ [20/20] Semantic locators, Page Object assertions, and spec flow verified.');

// 4. Strict TypeScript type-checking (15 pts)
console.log('🔍 Running TypeScript compiler check (npx tsc --noEmit)...');
try {
  execSync('npx tsc --noEmit', { stdio: 'inherit' });
  score += 15;
  console.log('✅ [15/15] TypeScript strict type-checking passed.');
} catch {
  console.error('❌ TypeScript compilation failed.');
  process.exit(1);
}

// 5. Execute Playwright test (25 pts)
console.log('\n🚀 Running Playwright test for Mission 00...');
try {
  execSync('npx playwright test tests/manual-to-auto-tc101.spec.ts', { stdio: 'inherit' });
  score += 25;
  console.log('✅ [25/25] Playwright test passed.');
} catch {
  console.error('\n❌ Playwright test execution failed.');
  console.log(`\nFINAL SCORE: ${score} / ${totalPoints}`);
  process.exit(1);
}

console.log('\n============================================================');
console.log(`  MISSION 00 PASSED: ${score} / ${totalPoints}`);
console.log('============================================================');
console.log('🏅 SFIA Competency Codes Achieved (SUCCESSFUL):');
console.log('   • TEST — Testing (SFIA Level 3)');
console.log('   • METL — Methods and tools (SFIA Level 3)');
console.log('   • PRTS — Performance testing (SFIA Level 2–3)');
console.log('   • RELM — Release management (SFIA Level 2–3)');
console.log('============================================================\n');
