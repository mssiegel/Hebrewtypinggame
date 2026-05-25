import { expect, type Locator, type Page } from "@playwright/test";

export const GAME_TITLE = "מִרְדָּף הַמִּלִּים";
export const PLAY_BUTTON = "התחילו לשחק";
export const DEFAULT_DIFFICULTY = "מתחיל";

export async function openLanding(page: Page) {
  await page.goto("/");
}

export async function startGame(page: Page, difficulty = DEFAULT_DIFFICULTY) {
  await openLanding(page);
  await page.getByText(difficulty).first().click();
  await page.getByText(PLAY_BUTTON).click();
  await expect(page).toHaveURL("/game");
}

export function gameInput(page: Page): Locator {
  return page.locator("input");
}

export async function waitForPlaying(page: Page): Promise<Locator> {
  const input = gameInput(page);
  await expect(input).toBeEnabled({ timeout: 6_000 });
  return input;
}

export async function typeGameText(page: Page, text: string) {
  const input = gameInput(page);
  await input.focus();
  for (const key of text) {
    await input.dispatchEvent("keydown", { key });
  }
}
