import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { USERS } from '../test-data/users';

test.describe('Login', () => {
  let login: LoginPage;

  test.beforeEach(async ({ page }) => {
    login = new LoginPage(page);
    await login.goto();
  });

  test('valid user lands on the products page @smoke', async ({ page }) => {
    await login.login(USERS.standard);
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.getByTestId('title')).toHaveText('Products');
  });

  test('locked-out user sees an error and stays on login', async ({ page }) => {
    await login.login(USERS.lockedOut);
    await expect(login.error).toContainText('this user has been locked out');
    await expect(page).not.toHaveURL(/inventory\.html/);
  });

  test('wrong password shows a credentials error', async () => {
    await login.login(USERS.standard, 'wrong_password');
    await expect(login.error).toContainText('Username and password do not match');
  });

  test('empty username is rejected', async () => {
    await login.loginButton.click();
    await expect(login.error).toContainText('Username is required');
  });

  test('empty password is rejected', async () => {
    await login.username.fill(USERS.standard);
    await login.loginButton.click();
    await expect(login.error).toContainText('Password is required');
  });

  test('protected page redirects to login when not signed in', async ({ page }) => {
    await page.goto('/inventory.html');
    await expect(login.error).toContainText("You can only access '/inventory.html' when you are logged in");
  });
});
