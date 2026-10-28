import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { USERS } from '../test-data/users';

test.describe('Products page', () => {
  let inventory: InventoryPage;

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(USERS.standard);
    inventory = new InventoryPage(page);
  });

  test('shows six products, each with a name and price @smoke', async () => {
    await expect(inventory.items).toHaveCount(6);
    for (const price of await inventory.getPrices()) {
      expect(price).toBeGreaterThan(0);
    }
  });

  test('sorts by price low to high', async () => {
    await inventory.sortBy('lohi');
    const prices = await inventory.getPrices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('sorts by price high to low', async () => {
    await inventory.sortBy('hilo');
    const prices = await inventory.getPrices();
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });

  test('sorts by name Z to A', async () => {
    await inventory.sortBy('za');
    const names = await inventory.itemNames.allTextContents();
    expect(names).toEqual([...names].sort().reverse());
  });
});
