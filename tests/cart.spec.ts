import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { USERS } from '../test-data/users';

test.describe('Cart', () => {
  let inventory: InventoryPage;

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(USERS.standard);
    inventory = new InventoryPage(page);
  });

  test('cart badge counts added items @smoke', async () => {
    await inventory.addToCart('Sauce Labs Backpack');
    await expect(inventory.cartBadge).toHaveText('1');
    await inventory.addToCart('Sauce Labs Bike Light');
    await expect(inventory.cartBadge).toHaveText('2');
  });

  test('removing the only item clears the badge', async () => {
    await inventory.addToCart('Sauce Labs Backpack');
    await inventory.removeFromCart('Sauce Labs Backpack');
    await expect(inventory.cartBadge).toBeHidden();
  });

  test('cart lists exactly the items that were added', async ({ page }) => {
    await inventory.addToCart('Sauce Labs Backpack');
    await inventory.addToCart('Sauce Labs Fleece Jacket');
    await inventory.openCart();
    const cart = new CartPage(page);
    await expect(cart.itemNames).toHaveText(['Sauce Labs Backpack', 'Sauce Labs Fleece Jacket']);
  });

  test('cart contents survive a page reload', async ({ page }) => {
    await inventory.addToCart('Sauce Labs Onesie');
    await page.reload();
    await expect(inventory.cartBadge).toHaveText('1');
  });
});
