import { chromium } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../.env.bubbles') });

const AUTH_FILE = path.resolve(__dirname, '.auth/user.json');

async function globalSetup() {
  // Skip if auth state already exists and is fresh (less than 12 hours old)
  if (fs.existsSync(AUTH_FILE)) {
    const age = Date.now() - fs.statSync(AUTH_FILE).mtimeMs;
    if (age < 12 * 60 * 60 * 1000) {
      console.log('Auth state is fresh — skipping login setup.');
      return;
    }
  }

  fs.mkdirSync(path.dirname(AUTH_FILE), { recursive: true });

  const browser = await chromium.launch({ headless: false, channel: 'chrome' });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(process.env.BUBBLES_BASE_URL ?? 'https://app.usebubbles.com');

  console.log('\n-----------------------------------------------------------');
  console.log('ACTION REQUIRED: Log in with Google in the browser window.');
  console.log('When you land on the Bubbles Home screen, come back here');
  console.log('and press Enter to save the session.');
  console.log('-----------------------------------------------------------\n');

  // Wait for user to complete manual login
  await page.waitForURL(/app\.usebubbles\.com/, { timeout: 120_000 });

  await context.storageState({ path: AUTH_FILE });
  console.log(`Auth state saved to ${AUTH_FILE}`);

  await browser.close();
}

export default globalSetup;
