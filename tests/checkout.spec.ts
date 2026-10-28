import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { USERS, CUSTOMER } from '../test-data/users';

test.describe('Checkout', () => {
  let checkout: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(USERS.standard);
    const inventory = new InventoryPage(page);
    await inventory.addToCart('Sauce Labs Backpack');
    await inventory.addToCart('Sauce Labs Bike Light');
    await inventory.openCart();
    await new CartPage(page).checkout();
    checkout = new CheckoutPage(page);
  });

  test('completes an order end to end @smoke', async ({ page }) => {
    await checkout.fillInfo(CUSTOMER.firstName, CUSTOMER.lastName, CUSTOMER.postalCode);
    await checkout.finishButton.click();
    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(checkout.completeHeader).toHaveText('Thank you for your order!');
  });

  test('order total equals item total plus tax', async () => {
    await checkout.fillInfo(CUSTOMER.firstName, CUSTOMER.lastName, CUSTOMER.postalCode);
    const itemTotal = await checkout.amount(checkout.itemTotal);
    const tax = await checkout.amount(checkout.tax);
    const total = await checkout.amount(checkout.total);
    expect(total).toBeCloseTo(itemTotal + tax, 2);
  });

  test('item total matches the sum of product prices', async () => {
    await checkout.fillInfo(CUSTOMER.firstName, CUSTOMER.lastName, CUSTOMER.postalCode);
    // Backpack $29.99 + Bike Light $9.99
    expect(await checkout.amount(checkout.itemTotal)).toBeCloseTo(39.98, 2);
  });

  const missingFields = [
    { field: 'first name', data: ['', CUSTOMER.lastName, CUSTOMER.postalCode], message: 'First Name is required' },
    { field: 'last name', data: [CUSTOMER.firstName, '', CUSTOMER.postalCode], message: 'Last Name is required' },
    { field: 'postal code', data: [CUSTOMER.firstName, CUSTOMER.lastName, ''], message: 'Postal Code is required' },
  ];

  for (const { field, data, message } of missingFields) {
    test(`missing ${field} blocks checkout`, async () => {
      await checkout.fillInfo(data[0], data[1], data[2]);
      await expect(checkout.error).toContainText(message);
    });
  }
});
