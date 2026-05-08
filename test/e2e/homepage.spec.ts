import { test, expect } from '@playwright/test';

test('homepage loads correctly', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Negro Barbershop/i);
});

test('hero section is visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.hero')).toBeVisible();
});

test('footer is visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.site-footer')).toBeVisible();
});