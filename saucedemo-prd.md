# Product Requirements Document: SauceDemo E-Commerce Application

**Product:** SauceDemo (saucedemo.com)
**Version:** 1.0
**Date:** 2026-04-23

---

## Overview

SauceDemo is a demo e-commerce web application used for QA training and automation practice. It simulates a real shopping experience including authentication, product browsing, cart management, and checkout.

---

## Feature 1: User Authentication

### User Story
As a shopper, I want to log in with valid credentials so that I can access the store, and be prevented from accessing it without authentication.

### Acceptance Criteria
- [ ] Login page is displayed at the root URL (`/`)
- [ ] Entering valid credentials (`standard_user` / `secret_sauce`) redirects to the inventory page
- [ ] Entering invalid credentials displays an error message: _"Username and password do not match"_
- [ ] Leaving username or password blank displays a field validation error
- [ ] `locked_out_user` credentials display the error: _"Sorry, this user has been locked out"_
- [ ] Clicking the logout link from the burger menu ends the session and redirects to the login page
- [ ] Accessing `/inventory.html` without a session redirects back to the login page

### Edge Cases
- Attempting login with SQL injection or script tags in fields must not crash the app or authenticate
- Session should not persist after explicit logout (back-button should not re-enter the store)
- `error_user` and `performance_glitch_user` must authenticate successfully despite degraded behaviour

---

## Feature 2: Product Inventory

### User Story
As a shopper, I want to browse all available products, sort them by name or price, so that I can quickly find what I am looking for.

### Acceptance Criteria
- [ ] Inventory page displays all 6 products with name, image, description, and price
- [ ] Default sort order is **Name (A→Z)**
- [ ] Sorting dropdown offers: Name (A→Z), Name (Z→A), Price (Low→High), Price (High→Low)
- [ ] Selecting each sort option reorders the product list accordingly
- [ ] Product names and prices displayed match expected catalogue data
- [ ] Each product card shows an **Add to cart** button

### Edge Cases
- Sorting with one item already in the cart must not reset the cart count
- Products must remain fully visible at common viewport sizes (desktop and tablet)
- No products should appear duplicated or missing after any sort operation

---

## Feature 3: Shopping Cart

### User Story
As a shopper, I want to add and remove products from my cart so that I can control what I intend to purchase before checking out.

### Acceptance Criteria
- [ ] Clicking **Add to cart** on any product adds it to the cart and changes the button label to **Remove**
- [ ] The cart badge on the header icon increments by 1 for each product added
- [ ] Clicking **Remove** removes the product from the cart and reverts the button label to **Add to cart**
- [ ] The cart badge decrements correctly when a product is removed
- [ ] Navigating to `/cart.html` shows all added products with name, quantity (1), and price
- [ ] Clicking **Remove** inside the cart removes the item from the cart list
- [ ] An empty cart shows no items and the badge disappears
- [ ] **Continue Shopping** returns the user to the inventory page

### Edge Cases
- Adding all 6 products must show a badge count of 6
- Cart contents must persist when navigating between inventory and cart pages
- Removing a product from the cart page must not affect other items in the cart

---

## Feature 4: Checkout Flow

### User Story
As a shopper, I want to complete my purchase by filling in my details and reviewing my order so that I receive confirmation that my order was placed.

### Acceptance Criteria
- [ ] Clicking **Checkout** from the cart navigates to Step 1 (customer information form)
- [ ] Step 1 requires **First Name**, **Last Name**, and **Zip/Postal Code**
- [ ] Submitting with any field empty shows a validation error identifying the missing field
- [ ] Valid form submission navigates to Step 2 (order overview)
- [ ] Step 2 displays all cart items, item total, tax, and order total
- [ ] Item total equals the sum of all individual product prices
- [ ] Clicking **Finish** on Step 2 navigates to the order confirmation page
- [ ] Confirmation page displays: _"Thank you for your order!"_ and a success message
- [ ] **Back Home** button on confirmation returns to the inventory page with an empty cart

### Edge Cases
- Submitting the checkout form with only whitespace in required fields must trigger validation errors
- Navigating back from Step 2 to Step 1 must retain entered form values
- Completing checkout must clear the cart (badge removed, cart page is empty)
- Accessing `/checkout-step-two.html` directly without going through Step 1 must not cause a crash

---

## Feature 5: Product Detail Page

### User Story
As a shopper, I want to view detailed information about a product so that I can make an informed purchase decision before adding it to my cart.

### Acceptance Criteria
- [ ] Clicking a product name or image on the inventory page navigates to its detail page
- [ ] Detail page displays the product's name, full description, image, and price
- [ ] An **Add to cart** button is present and functional on the detail page
- [ ] Adding to cart from the detail page increments the cart badge
- [ ] If the product is already in the cart, the button displays **Remove**
- [ ] Clicking **Remove** on the detail page removes the item from the cart
- [ ] **Back to products** link returns the user to the inventory page with sort order preserved

### Edge Cases
- Directly navigating to a product detail URL must render the correct product
- Cart state set on the inventory page must be reflected correctly on the detail page
- After removing a product from the detail page, returning to inventory must show the **Add to cart** button for that product

---

## Out of Scope

- Payment processing (no real transactions occur)
- User registration or account management
- Order history or email notifications
- Mobile native applications

---

## Test Users Reference

| Username               | Behaviour                                      |
|------------------------|------------------------------------------------|
| `standard_user`        | Normal, fully functional experience            |
| `locked_out_user`      | Blocked at login with error message            |
| `problem_user`         | Broken images and UI defects                   |
| `performance_glitch_user` | Intentional login and action delays         |
| `error_user`           | Random errors on certain interactions          |
| `visual_user`          | Visual/layout defects for visual testing       |

**Password for all accounts:** `secret_sauce`
