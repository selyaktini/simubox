import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('home introduces the atlas and opens Explore', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /An atlas of models/ })).toBeVisible();
  await expect(page.locator('.hero-preview img')).toHaveAttribute('src', '/previews/lorenz.svg');
  await page.getByRole('link', { name: /Explore the collection/ }).click();
  await expect(page).toHaveURL('/simulations/');
  await expect(page.getByRole('link', { name: 'Explore', exact: true }).first()).toHaveAttribute('aria-current', 'page');
});

test('search and filters compose, update the URL, and restore on back', async ({ page }) => {
  await page.goto('/simulations/');
  const entries = page.locator('.collection-entry:visible');
  await expect(entries).toHaveCount(3);
  await page.getByLabel('SEARCH THE ATLAS').fill('Yahya');
  await expect(entries).toHaveCount(2);
  await expect(page).toHaveURL(/q=Yahya/);
  await page.getByLabel('AVAILABILITY').selectOption('candidate');
  await expect(entries).toHaveCount(2);
  await page.getByLabel('TOPIC').selectOption('Fractals');
  await expect(entries).toHaveCount(1);
  await expect(page).toHaveURL(/topic=Fractals/);
  await page.goBack();
  await expect(page.getByLabel('TOPIC')).toHaveValue('all');
  await expect(entries).toHaveCount(2);
  await page.getByRole('button', { name: /Dynamical systems/ }).click();
  await expect(page.getByText('No matching models')).toBeVisible();
  await expect(page.getByRole('button', { name: /Dynamical systems/ })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Show all experiments' }).click();
  await expect(entries).toHaveCount(3);
  await expect(page).toHaveURL('/simulations/');
});

test('candidate page shows scientific context and source without a player', async ({ page }) => {
  await page.goto('/simulations/chaos-lab/');
  await expect(page.getByRole('heading', { name: 'Study the source project' })).toBeVisible();
  await expect(page.getByText('Fixed geometric configuration')).toBeVisible();
  await expect(page.getByText('1947ade448fc8dd07f21256a3387000e01a2e7af')).toBeVisible();
  await expect(page.getByRole('link', { name: /Open source repository/ })).toHaveAttribute('href', 'https://github.com/yahyabmo/the-double-pendulum');
  await expect(page.locator('iframe')).toHaveCount(0);
});

test('Lorenz model runs with controls, presets, and restricted iframe', async ({ page }) => {
  await page.goto('/simulations/lorenz-attractor/');
  await expect(page.getByRole('heading', { name: 'Scientific model' })).toBeVisible();
  await expect(page.locator('.katex-display')).toBeVisible();
  const iframe = page.locator('#player');
  await expect(iframe).toHaveAttribute('sandbox', 'allow-scripts');
  const frame = iframe.contentFrame();
  await expect(frame.getByRole('button', { name: 'Pause' })).toBeVisible();
  await expect(page.locator('#loading')).toBeHidden();
  await frame.getByRole('button', { name: 'Pause' }).click();
  await expect(frame.locator('#status')).toContainText('Paused');
  await frame.getByRole('button', { name: 'Steady' }).click();
  await expect(frame.locator('#rho')).toHaveValue('12');
  await expect(frame.locator('#status')).toContainText('t = 0.0');
  await frame.getByRole('button', { name: 'Classical' }).click();
  await expect(frame.locator('#rho')).toHaveValue('28');
  await frame.getByRole('button', { name: 'Reset trajectory' }).click();
  await expect(frame.locator('#status')).toContainText('t = 0.0');
  await frame.getByRole('button', { name: 'Resume' }).click();
  await expect(frame.locator('#status')).toContainText('Running');
});

test('fullscreen control expands and closes the workspace', async ({ page }) => {
  await page.goto('/simulations/lorenz-attractor/');
  await page.getByRole('button', { name: 'Enter fullscreen experiment' }).click();
  await expect.poll(() => page.evaluate(() => document.fullscreenElement?.id)).toBe('workspace');
  await page.getByRole('button', { name: 'Exit fullscreen experiment' }).click();
  await expect.poll(() => page.evaluate(() => document.fullscreenElement)).toBeNull();
});

test('keyboard shortcuts work on the plot without stealing slider keys', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  expect(new URL(page.url()).hash).toBe('#main');
  await page.goto('/simulations/lorenz-attractor/');
  const frame = page.locator('#player').contentFrame();
  await frame.locator('#plot').focus();
  await page.keyboard.press('Space');
  await expect(frame.locator('#status')).toContainText('Paused');
  await page.keyboard.press('r');
  await expect(frame.locator('#status')).toContainText('t = 0.0');
  const rho = frame.locator('#rho');
  await rho.focus();
  const before = Number(await rho.inputValue());
  await page.keyboard.press('ArrowRight');
  expect(Number(await rho.inputValue())).toBeGreaterThan(before);
});

test('reduced-motion preference opens the Lorenz model paused', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/simulations/lorenz-attractor/');
  await expect(page.locator('#player').contentFrame().getByRole('button', { name: 'Resume' })).toBeVisible();
});

test('responsive pages avoid horizontal overflow at target widths', async ({ page }) => {
  for (const width of [320, 375, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: width < 600 ? 844 : 900 });
    for (const path of ['/', '/simulations/', '/simulations/lorenz-attractor/', '/simulations/chaos-lab/']) {
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
      expect(overflow, `${path} at ${width}px`).toBe(false);
    }
  }
});

test('automated accessibility checks find no detectable violations', async ({ page }) => {
  for (const path of ['/', '/simulations/', '/simulations/lorenz-attractor/', '/simulations/chaos-lab/']) {
    await page.goto(path, { waitUntil: 'networkidle' });
    const result = await new AxeBuilder({ page }).analyze();
    expect(result.violations.map(violation => violation.id), path).toEqual([]);
  }
});
