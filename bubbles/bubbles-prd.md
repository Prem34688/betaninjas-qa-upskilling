# Product Requirements Document: Bubbles Web Application

**Product:** Bubbles (usebubbles.com / app.usebubbles.com)
**Version:** 2.0
**Date:** 2026-04-29

---

## Overview

Bubbles is an async video collaboration tool. This PRD covers the **Critical Happy Path** for authentication — navigation entry points, login, logout, and signup flows — to drive automated Playwright test generation against both the marketing site and the web app.

> All paths apply to **both desktop and mobile** unless prefixed with "(Desktop only)."

---

## URLs

| Environment | URL |
|-------------|-----|
| Production homepage | `https://www.usebubbles.com` |
| Staging homepage | `http://link.usebubbles.com/staging-website` |
| Web app | `https://app.usebubbles.com` |

---

## Feature 1: Homepage Navigation Entry Points

### User Story
As a visitor on the Bubbles homepage, I want clear entry points to log in or sign up so that I can reach the app quickly.

### Acceptance Criteria
- [ ] Clicking **Log in** on the homepage (`https://usebubbles.com/`) navigates to `app.usebubbles.com`
- [ ] Clicking **Try free in <1 min** on the homepage navigates to `app.usebubbles.com`
- [ ] Scrolling down to the **Get Started Free** CTA in the homepage header and clicking it navigates to `app.usebubbles.com`

### Edge Cases
- All three entry points must work on both desktop and mobile viewports
- Navigation must succeed on both production (`https://www.usebubbles.com`) and staging (`http://link.usebubbles.com/staging-website`)

---

## Feature 2: Login

### User Story
As an existing user, I want to log in to Bubbles using my preferred authentication method so that I can access my account and land on the Bubbles Home screen.

---

### 2a. Login — Google One-Tap (Homepage)

#### Flow
`Homepage → Google One-Tap prompt → Select Google account → Login completes → Bubbles Home screen`

#### Acceptance Criteria
- [ ] Google One-Tap prompt is displayed on the homepage for unauthenticated visitors
- [ ] Selecting a Google account from the One-Tap prompt authenticates the user
- [ ] On successful authentication, the user lands on the Bubbles Home screen at `app.usebubbles.com`
- [ ] Applies to both production and staging homepages

---

### 2b. Login — Continue with Google (In-App)

#### Flow
`app.usebubbles.com → Click "Continue with Google" → Google OAuth consent → Login completes → Bubbles Home screen`

#### Acceptance Criteria
- [ ] A **Continue with Google** button is visible on the login/signup form at `app.usebubbles.com`
- [ ] Clicking it opens the Google OAuth consent flow
- [ ] Completing OAuth authenticates the user and lands them on the Bubbles Home screen

---

### 2c. Login — Continue with Microsoft (In-App)

#### Flow
`app.usebubbles.com → Click "Continue with Microsoft" → Microsoft OAuth consent → Login completes → Bubbles Home screen`

#### Acceptance Criteria
- [ ] A **Continue with Microsoft** button is visible on the login/signup form at `app.usebubbles.com`
- [ ] Clicking it opens the Microsoft OAuth consent flow
- [ ] Completing OAuth authenticates the user and lands them on the Bubbles Home screen

---

### 2d. Login — Name & Email on Create Account Form (Existing User)

#### Flow
`app.usebubbles.com → Create an account form → Enter Name + existing Work Email → Continue with email → Receive OTP → Enter OTP → Login completes → Bubbles Home screen`

#### Acceptance Criteria
- [ ] The **Create an account** form accepts a name and work email
- [ ] Submitting a work email that already has an account triggers an OTP to that email (passwordless login)
- [ ] Entering the correct OTP completes login and lands the user on the Bubbles Home screen

---

### 2e. Login — Log In Form via Work Email (OTP)

#### Flow
`app.usebubbles.com → Log in form → Enter work email → Continue with email → Receive OTP → Enter OTP → Login completes → Bubbles Home screen`

#### Acceptance Criteria
- [ ] The **Log in** form at `app.usebubbles.com` accepts a work email address
- [ ] Clicking **Continue with email** sends an OTP to the entered email
- [ ] The user is shown an OTP entry screen
- [ ] Entering the correct OTP completes login
- [ ] The user lands on the Bubbles Home screen after successful login

#### Edge Cases
- Entering an incorrect OTP displays a validation error and allows retry
- An expired OTP shows an appropriate error and allows requesting a new one
- Submitting an empty email field shows a validation error
- Submitting an invalid email format shows a format error

---

### 2f. Login — Log In Form via Google

#### Flow
`app.usebubbles.com → Log in form → Click "Continue with Google" → Google OAuth → Login completes → Bubbles Home screen`

#### Acceptance Criteria
- [ ] The **Log in** form includes a **Continue with Google** option
- [ ] Completing Google OAuth from the log in form lands the user on the Bubbles Home screen

---

### 2g. Login — Log In Form via Microsoft

#### Flow
`app.usebubbles.com → Log in form → Click "Continue with Microsoft" → Microsoft OAuth → Login completes → Bubbles Home screen`

#### Acceptance Criteria
- [ ] The **Log in** form includes a **Continue with Microsoft** option
- [ ] Completing Microsoft OAuth from the log in form lands the user on the Bubbles Home screen

---

## Feature 3: Logout

### User Story
As a logged-in user, I want to log out so that my session is ended securely, and I want to be able to log back in afterwards.

---

### 3a. Logout — Quick Path (Profile Menu)

#### Flow
`Bubbles Home screen → Click Profile → Logout → Confirm Logout → Logged out`

#### Acceptance Criteria
- [ ] Clicking the **Profile** avatar/menu on the Home screen shows a **Logout** option
- [ ] Clicking **Logout** triggers a confirmation step (dialog or prompt)
- [ ] Confirming logout ends the session and redirects the user to the login/home page
- [ ] After logout, accessing `app.usebubbles.com` redirects to the login screen (session is cleared)

---

### 3b. Logout — Settings Path (Profile Settings)

#### Flow
`Bubbles Home screen → Click Profile → Settings → Profile tab → Logout → Confirm Logout → Logged out`

#### Acceptance Criteria
- [ ] Clicking the **Profile** avatar/menu exposes a **Settings** option
- [ ] The Settings page has a **Profile** tab
- [ ] The Profile tab contains a **Logout** button
- [ ] Clicking Logout triggers a confirmation step
- [ ] Confirming logout ends the session and redirects the user to the login/home page
- [ ] Session is fully cleared — accessing `app.usebubbles.com` redirects to login

---

### 3c. Re-Login After Logout

#### Acceptance Criteria
- [ ] After completing logout via either path (3a or 3b), the user can successfully log back in
- [ ] Re-login can be completed via any supported login method (Google, Microsoft, OTP)
- [ ] After re-login, the user lands on the Bubbles Home screen

#### Edge Cases (applies to both 3a and 3b)
- Clicking the browser back button after logout must not restore the authenticated session
- Cancelling the logout confirmation must keep the user logged in on the current page

---

## Feature 4: Sign Up

### User Story
As a new user, I want to create a Bubbles account using my preferred method so that I can complete onboarding and land on the Bubbles Home screen.

---

### 4a. Sign Up — Google One-Tap (Homepage)

#### Flow
`usebubbles.com homepage → Google One-Tap prompt → Select Google account → OAuth consent → Onboarding → Bubbles Home screen`

#### Acceptance Criteria
- [ ] Google One-Tap prompt appears on the homepage for unauthenticated new visitors
- [ ] Selecting a Google account initiates the OAuth consent flow
- [ ] Completing OAuth takes the user through onboarding
- [ ] After onboarding, the user lands on the Bubbles Home screen at `app.usebubbles.com`
- [ ] The account is associated with the selected Google email

#### Edge Cases
- Dismissing One-Tap must not break the page or block other signup methods
- If the Google account is already registered, the user should be logged in (not shown a duplicate error)

---

### 4b. Sign Up — Google OAuth (In-App Form)

#### Flow
`app.usebubbles.com → Click "Continue with Google" → Google OAuth consent → Onboarding → Bubbles Home screen`

#### Acceptance Criteria
- [ ] The in-app signup form at `app.usebubbles.com` shows a **Continue with Google** button
- [ ] Clicking it opens the Google OAuth consent flow
- [ ] Completing OAuth takes the user through onboarding
- [ ] After onboarding, the user lands on the Bubbles Home screen

#### Edge Cases
- Closing the Google OAuth popup without completing must return the user to the signup form without errors

---

### 4c. Sign Up — Microsoft OAuth (In-App Form)

#### Flow
`app.usebubbles.com → Click "Continue with Microsoft" → Microsoft OAuth consent → Onboarding → Bubbles Home screen`

#### Acceptance Criteria
- [ ] The in-app signup form at `app.usebubbles.com` shows a **Continue with Microsoft** button
- [ ] Clicking it opens the Microsoft OAuth consent flow
- [ ] Completing OAuth takes the user through onboarding
- [ ] After onboarding, the user lands on the Bubbles Home screen

#### Edge Cases
- Closing the Microsoft OAuth popup without completing must return the user to the signup form without errors

---

### 4d. Sign Up — Name + Work Email (OTP Flow)

#### Flow
`app.usebubbles.com → Enter Name + Work Email → Continue with email → Receive OTP → Enter OTP → Onboarding → Bubbles Home screen`

#### Acceptance Criteria
- [ ] The signup form displays fields for **Name** and **Work Email**
- [ ] Clicking **Continue with email** with valid inputs sends an OTP to the work email
- [ ] The user is shown an OTP entry screen
- [ ] Entering the correct OTP proceeds to the onboarding flow
- [ ] Completing onboarding lands the user on the Bubbles Home screen

#### Edge Cases
- Empty Name field must show a validation error
- Empty Email field must show a validation error
- Invalid email format must show a format validation error

---

### 4e. Sign Up — Didn't Get a Code? (Resend OTP)

#### Flow
`OTP entry screen → Click "Didn't get a code?" → New OTP sent to same email → Enter new OTP → Continue`

#### Acceptance Criteria
- [ ] A **Didn't get a code?** link or button is visible on the OTP entry screen
- [ ] Clicking it sends a new OTP to the same email address
- [ ] A confirmation message or toast confirms the new code has been sent
- [ ] The new OTP is valid and allows the user to proceed

#### Edge Cases
- Rapid repeated clicks must not trigger excessive OTP emails (rate limiting expected)

---

### 4f. Sign Up — Change Email (During OTP Step)

#### Flow
`OTP entry screen → Click "Change email" → Return to signup form → Enter new email → Continue with email → Receive new OTP → Enter OTP → Onboarding → Bubbles Home screen`

#### Acceptance Criteria
- [ ] A **Change email** link or button is visible on the OTP entry screen
- [ ] Clicking it returns the user to the signup form with the email field editable
- [ ] Previously entered **Name** is retained when returning to the form
- [ ] Entering a new email and clicking Continue sends a fresh OTP to the new address
- [ ] The user can complete the full signup flow with the new email

#### Edge Cases
- Changing to the same email must still issue a fresh OTP
- Changing to an already-registered email must handle the conflict gracefully (login prompt or clear error)

---

## Out of Scope

- Password-based authentication (Bubbles uses passwordless / OAuth)
- Account deletion or data export
- In-app collaboration features (bubble creation, sharing, commenting)
- Billing and subscription management
- Mobile native applications (iOS / Android)

---

## Test Environment Notes

| Variable | Purpose |
|----------|---------|
| `BUBBLES_GOOGLE_EMAIL` | Google test account email |
| `BUBBLES_GOOGLE_PASSWORD` | Google test account password |
| `BUBBLES_MS_EMAIL` | Microsoft test account email |
| `BUBBLES_MS_PASSWORD` | Microsoft test account password |
| `BUBBLES_TEST_EMAIL` | Work email for OTP signup tests (use Mailosaur or similar) |
| `BUBBLES_BASE_URL` | `https://app.usebubbles.com` (or staging equivalent) |
| `BUBBLES_HOMEPAGE_URL` | `https://www.usebubbles.com` (or `http://link.usebubbles.com/staging-website`) |
