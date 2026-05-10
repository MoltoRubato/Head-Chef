import { test, expect } from '@playwright/test';

test.describe('Lobby screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('displays Head Chef title and tagline', async ({ page }) => {
    await expect(page.getByText('Head Chef')).toBeVisible();
    await expect(page.getByText('a delicious deduction')).toBeVisible();
  });

  test('host tab is active by default', async ({ page }) => {
    const hostBtn = page.getByTestId('host-btn');
    await expect(hostBtn).toBeVisible();
    await expect(hostBtn).toContainText('Open the Kitchen');
  });

  test('switches to join tab and shows code input', async ({ page }) => {
    await page.getByText('Join a Kitchen').click();
    await expect(page.getByTestId('join-code-input')).toBeVisible();
    await expect(page.getByTestId('join-btn')).toContainText('Enter the Kitchen');
  });

  test('shows error when hosting without a name', async ({ page }) => {
    await page.getByTestId('host-btn').click();
    await expect(page.getByText('Enter your name first')).toBeVisible();
  });

  test('shows error when joining without a name', async ({ page }) => {
    await page.getByText('Join a Kitchen').click();
    await page.getByTestId('join-btn').click();
    await expect(page.getByText('Enter your name first')).toBeVisible();
  });

  test('shows error when joining without a room code', async ({ page }) => {
    await page.getByText('Join a Kitchen').click();
    await page.getByTestId('name-input').fill('Chef Test');
    await page.getByTestId('join-btn').click();
    await expect(page.getByText('Enter a room code')).toBeVisible();
  });

  test('name input accepts text', async ({ page }) => {
    await page.getByTestId('name-input').fill('Chef Marie');
    await expect(page.getByTestId('name-input')).toHaveValue('Chef Marie');
  });

  test('opens reference / card library screen', async ({ page }) => {
    await page.getByRole('button', { name: /Browse the Card Library/ }).click();
    await expect(page.getByText('The Pantry')).toBeVisible();
  });

  test('displays game info panel with correct win conditions', async ({ page }) => {
    await expect(page.getByText('5 served · 4 trashed')).toBeVisible();
    await expect(page.getByText('unlocks after 3 dishes')).toBeVisible();
    await expect(page.getByText('8 total')).toBeVisible();
  });

  test('host creates a room and room code appears', async ({ page }) => {
    await page.getByTestId('name-input').fill('Chef Alice');
    await page.getByTestId('host-btn').click();

    const roomCode = page.getByTestId('room-code');
    await expect(roomCode).toBeVisible({ timeout: 10000 });

    const code = await roomCode.textContent();
    expect(code).toMatch(/^[A-Z]+-\d{2}$/);
  });
});
