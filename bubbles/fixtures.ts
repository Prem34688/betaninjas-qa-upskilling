import { test as base, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { GoogleOAuthPage } from './pages/GoogleOAuthPage';

type BubblesPages = {
  loginPage: LoginPage;
  googleOAuthPage: GoogleOAuthPage;
};

export const test = base.extend<BubblesPages>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  googleOAuthPage: async ({ page }, use) => {
    await use(new GoogleOAuthPage(page));
  },
});

export { expect };
