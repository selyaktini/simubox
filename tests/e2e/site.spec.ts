import { test, expect } from '@playwright/test';
test('home, catalogue, search and filtering', async ({ page }) => {
  await page.goto('/'); await expect(page.getByRole('heading', {name: /Science is easier/})).toBeVisible();
  await page.getByRole('link', {name: 'Explore simulations'}).click();
  await expect(page.getByRole('heading', {name:'Scientific simulations'})).toBeVisible();
  await page.getByLabel('Search catalogue').fill('lorenz'); await expect(page.locator('.sim-card:visible')).toHaveCount(1);
  await page.getByLabel('Search catalogue').fill('zzzz'); await expect(page.getByText('No matching simulations')).toBeVisible();
  await page.getByRole('button', {name:'Clear filters'}).click(); await page.getByLabel('Scientific field').selectOption('Physics'); await expect(page.locator('.sim-card:visible')).toHaveCount(1);
});
test('reference simulation runs inside restricted iframe', async ({page}) => {
  await page.goto('/simulations/lorenz-attractor/');
  await expect(page.getByText('Scientific model')).toBeVisible();
  const frame = page.locator('#player'); await expect(frame).toHaveAttribute('sandbox','allow-scripts');
  await expect(frame.contentFrame().getByRole('button',{name:'Pause'})).toBeVisible();
  await frame.contentFrame().getByRole('button',{name:'Pause'}).click(); await expect(frame.contentFrame().locator('#status')).toContainText('Paused');
  await frame.contentFrame().getByRole('button',{name:'Reset'}).click(); await expect(frame.contentFrame().locator('#status')).toContainText('t = 0.0');
  await expect(page.getByRole('link',{name:'Repository'})).toHaveAttribute('href',/github.com\/selyaktini\/simubox/);
});
test('external candidate has no broken player', async ({page}) => { await page.goto('/simulations/chaos-lab/'); await expect(page.getByText('Integration under review')).toBeVisible(); await expect(page.locator('iframe')).toHaveCount(0); });
test('mobile navigation and catalogue fit viewport', async ({page}) => { await page.setViewportSize({width:390,height:844}); await page.goto('/'); await expect(page.getByRole('navigation',{name:'Main navigation'})).toBeVisible(); await page.goto('/simulations/'); const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth); expect(overflow).toBe(false); });
test('keyboard navigation reaches content and simulation controls', async ({page}) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link',{name:'Skip to content'})).toBeFocused();
  await page.keyboard.press('Enter');
  expect(new URL(page.url()).hash).toBe('#main');
  await page.goto('/simulations/lorenz-attractor/');
  const frame = page.locator('#player').contentFrame();
  const rho = frame.locator('#rho');
  await rho.focus();
  const before = Number(await rho.inputValue());
  await page.keyboard.press('ArrowRight');
  expect(Number(await rho.inputValue())).toBeGreaterThan(before);
});
