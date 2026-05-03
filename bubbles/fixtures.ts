import { test as base, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { GoogleOAuthPage } from './pages/GoogleOAuthPage';
import { HomePage } from './pages/HomePage';

type BubblesPages = {
  loginPage: LoginPage;
  googleOAuthPage: GoogleOAuthPage;
  homePage: HomePage;
};

export const test = base.extend<BubblesPages>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  googleOAuthPage: async ({ page }, use) => {
    await use(new GoogleOAuthPage(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
});

export { expect };
