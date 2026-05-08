import { test, expect } from '@playwright/test';

test('login button opens auth modal', async ({ page }) => {
  await page.goto('/');
  await page.click('button.btn-login');
  await expect(page.locator('.modal-content')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Iniciar Sesión' })).toBeVisible();
});

test('auth modal can switch to register', async ({ page }) => {
  await page.goto('/');
  await page.click('button.btn-login');
  await page.click('text=Regístrate aquí');
  await expect(page.getByRole('heading', { name: 'Crear Cuenta' })).toBeVisible();
});

test('auth modal has form fields', async ({ page }) => {
  await page.goto('/');
  await page.click('button.btn-login');
  await expect(page.locator('.modal-content')).toBeVisible();
  await expect(page.getByLabel(/Email/)).toBeVisible();
  await expect(page.getByLabel(/Contraseña/)).toBeVisible();
});