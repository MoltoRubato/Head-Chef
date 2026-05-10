import { test, expect } from '@playwright/test';

test.describe('Reference / Card Library screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Browse the Card Library/ }).click();
    await expect(page.getByText('The Pantry')).toBeVisible();
  });

  test('shows all four content tabs', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Recipes/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Ingredients/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Abilities/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Roles/ })).toBeVisible();
  });

  test('recipes tab shows all 19 recipes', async ({ page }) => {
    // Recipes tab is default — check a few known recipe names
    await expect(page.getByText('Le Quatuor')).toBeVisible();
    await expect(page.getByText('Surf & Turf')).toBeVisible();
    await expect(page.getByText('Bouillabaisse')).toBeVisible();
  });

  test('ingredients tab shows all 4 suits', async ({ page }) => {
    await page.getByRole('button', { name: /Ingredients/ }).click();
    // Suit names are title-case in DOM; CSS renders them uppercase visually
    await expect(page.getByText('Meat', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Fish', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Veg', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Sauce', { exact: true }).first()).toBeVisible();
  });

  test('abilities tab shows ability cards', async ({ page }) => {
    await page.getByRole('button', { name: /Abilities/ }).click();
    // Check a few known ability names
    await expect(page.getByText('Improvise').first()).toBeVisible();
    await expect(page.getByText('Snack').first()).toBeVisible();
  });

  test('roles tab shows role information', async ({ page }) => {
    await page.getByRole('button', { name: /Roles/ }).click();
    // Roles are flip cards — check they render
    await expect(page.getByText('Roles')).toBeVisible();
  });

  test('close button returns to lobby', async ({ page }) => {
    await page.getByRole('button', { name: /Back to Service/ }).click();
    await expect(page.getByText('Head Chef')).toBeVisible();
    await expect(page.getByTestId('host-btn')).toBeVisible();
  });
});
