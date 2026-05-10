import { test, expect } from '@playwright/test';

// Helper: set up 3 players in a room and start the game.
// Returns { pages, roomCode } where pages = [host, p2, p3].
async function setupGame(browser) {
  const contexts = await Promise.all([
    browser.newContext(),
    browser.newContext(),
    browser.newContext(),
  ]);
  const pages = await Promise.all(contexts.map(c => c.newPage()));
  await Promise.all(pages.map(p => p.goto('/')));

  // Host creates room
  await pages[0].getByTestId('name-input').fill('Chef Alice');
  await pages[0].getByTestId('host-btn').click();
  await pages[0].getByTestId('room-code').waitFor({ state: 'visible', timeout: 10000 });
  const roomCode = (await pages[0].getByTestId('room-code').textContent()).trim();

  // Players 2 and 3 join sequentially to avoid race on room-update
  for (const [playerName, page] of [['Chef Bob', pages[1]], ['Chef Carol', pages[2]]]) {
    await page.getByText('Join a Kitchen').click();
    await page.getByTestId('name-input').fill(playerName);
    await page.getByTestId('join-code-input').fill(roomCode);
    await page.getByTestId('join-btn').click();
  }

  // Wait for host to see all 3 players
  await pages[0].getByText('Chef Bob').waitFor({ state: 'visible', timeout: 8000 });
  await pages[0].getByText('Chef Carol').waitFor({ state: 'visible', timeout: 8000 });

  return { pages, contexts, roomCode };
}

test.describe('Room creation', () => {
  test('host creates a room with a valid code', async ({ browser }) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto('/');
    await page.getByTestId('name-input').fill('Chef Solo');
    await page.getByTestId('host-btn').click();

    const roomCode = page.getByTestId('room-code');
    await expect(roomCode).toBeVisible({ timeout: 10000 });
    const code = await roomCode.textContent();
    expect(code.trim()).toMatch(/^[A-Z]+-\d{2}$/);
    await ctx.close();
  });

  test('player can join an existing room', async ({ browser }) => {
    const [ctx1, ctx2] = await Promise.all([browser.newContext(), browser.newContext()]);
    const [p1, p2] = await Promise.all([ctx1.newPage(), ctx2.newPage()]);
    await Promise.all([p1.goto('/'), p2.goto('/')]);

    // Host creates room
    await p1.getByTestId('name-input').fill('Chef Host');
    await p1.getByTestId('host-btn').click();
    await p1.getByTestId('room-code').waitFor({ state: 'visible', timeout: 10000 });
    const code = (await p1.getByTestId('room-code').textContent()).trim();

    // Second player joins
    await p2.getByText('Join a Kitchen').click();
    await p2.getByTestId('name-input').fill('Chef Guest');
    await p2.getByTestId('join-code-input').fill(code);
    await p2.getByTestId('join-btn').click();

    // Both see each other in the room
    await expect(p1.getByText('Chef Guest')).toBeVisible({ timeout: 8000 });
    await expect(p2.getByText('Chef Host')).toBeVisible({ timeout: 8000 });
    await expect(p2.getByTestId('room-code')).toHaveText(code, { timeout: 5000 });

    await Promise.all([ctx1.close(), ctx2.close()]);
  });

  test('shows error when joining a non-existent room code', async ({ page }) => {
    await page.goto('/');
    await page.getByText('Join a Kitchen').click();
    await page.getByTestId('name-input').fill('Chef Test');
    await page.getByTestId('join-code-input').fill('FAKE-00');
    await page.getByTestId('join-btn').click();
    await expect(page.getByText('Room not found')).toBeVisible({ timeout: 8000 });
  });
});

test.describe('Pre-game lobby', () => {
  test('start button requires all players to be ready', async ({ browser }) => {
    const { pages, contexts } = await setupGame(browser);
    const [p1] = pages;

    // Start button is disabled (not all ready)
    const startBtn = p1.getByTestId('start-btn');
    await expect(startBtn).toBeDisabled();

    // All players mark ready
    await pages[0].getByTestId('ready-btn').click();
    await pages[1].getByTestId('ready-btn').click();
    await pages[2].getByTestId('ready-btn').click();

    // Now start button is enabled for host
    await expect(startBtn).toBeEnabled({ timeout: 8000 });

    await Promise.all(contexts.map(c => c.close()));
  });

  test('host can update traitor count setting', async ({ browser }) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto('/');
    await page.getByTestId('name-input').fill('Chef Host');
    await page.getByTestId('host-btn').click();
    await page.getByTestId('room-code').waitFor({ state: 'visible', timeout: 10000 });

    // Click "2 · Rival × 2" traitor option
    await page.getByText('2 · Rival × 2').click();
    // No error — settings just update silently
    await expect(page.getByTestId('room-code')).toBeVisible();

    await ctx.close();
  });
});

test.describe('Game flow', () => {
  test('all 3 players reach the role reveal screen after game starts', async ({ browser }) => {
    const { pages, contexts } = await setupGame(browser);

    // All ready
    await Promise.all(pages.map(p => p.getByTestId('ready-btn').click()));
    await expect(pages[0].getByTestId('start-btn')).toBeEnabled({ timeout: 8000 });

    // Host starts game
    await pages[0].getByTestId('start-btn').click();

    // All see role reveal screen (button appears, disabled until card flipped)
    await Promise.all(
      pages.map(p => p.getByTestId('take-station-btn').waitFor({ state: 'visible', timeout: 15000 }))
    );
    // Button is disabled until the card is flipped
    await expect(pages[0].getByTestId('take-station-btn')).toBeDisabled();

    await Promise.all(contexts.map(c => c.close()));
  });

  test('players acknowledge role and reach the game table', async ({ browser }) => {
    const { pages, contexts } = await setupGame(browser);

    // All ready & start
    await Promise.all(pages.map(p => p.getByTestId('ready-btn').click()));
    await expect(pages[0].getByTestId('start-btn')).toBeEnabled({ timeout: 8000 });
    await pages[0].getByTestId('start-btn').click();

    // All reach role reveal
    await Promise.all(
      pages.map(p => p.getByTestId('take-station-btn').waitFor({ state: 'visible', timeout: 15000 }))
    );

    // Each player flips their role card then continues
    for (const page of pages) {
      await page.getByTestId('role-card').click();
      await expect(page.getByTestId('take-station-btn')).toBeEnabled({ timeout: 3000 });
      await page.getByTestId('take-station-btn').click();
    }

    // All reach the game table — De-Toque button is visible (disabled at 0 dishes)
    await Promise.all(
      pages.map(p => p.getByTestId('detoque-btn').waitFor({ state: 'visible', timeout: 15000 }))
    );

    // De-Toque requires 3 dishes — button should be disabled at game start
    await expect(pages[0].getByTestId('detoque-btn')).toBeDisabled();

    await Promise.all(contexts.map(c => c.close()));
  });

  test('active player can select and play an ingredient', async ({ browser }) => {
    const { pages, contexts } = await setupGame(browser);

    // All ready & start
    await Promise.all(pages.map(p => p.getByTestId('ready-btn').click()));
    await expect(pages[0].getByTestId('start-btn')).toBeEnabled({ timeout: 8000 });
    await pages[0].getByTestId('start-btn').click();

    // Reach game table (seat 0 = Chef Alice = pages[0] is first active player)
    for (const page of pages) {
      await page.getByTestId('role-card').waitFor({ state: 'visible', timeout: 15000 });
      await page.getByTestId('role-card').click();
      await page.getByTestId('take-station-btn').click();
    }
    await Promise.all(
      pages.map(p => p.getByTestId('detoque-btn').waitFor({ state: 'visible', timeout: 15000 }))
    );

    const activePlayer = pages[0]; // seat 0 goes first

    // Status should indicate it's their turn
    await expect(activePlayer.getByText('Choose an ingredient')).toBeVisible({ timeout: 5000 });

    // Click first hand card to select it
    await activePlayer.getByTestId('hand-card-0').click();
    await expect(activePlayer.getByText('Place it on a recipe')).toBeVisible({ timeout: 3000 });

    // Play on kitchen slot 0
    await activePlayer.getByTestId('kitchen-slot-0').click();

    // After play, turn should pass — active player no longer sees "Choose an ingredient"
    await expect(activePlayer.getByText('Choose an ingredient')).not.toBeVisible({ timeout: 5000 });

    await Promise.all(contexts.map(c => c.close()));
  });
});
