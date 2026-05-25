import { test, expect } from "@playwright/test";
import {
  GAME_TITLE,
  PLAY_BUTTON,
  gameInput,
  startGame,
  typeGameText,
  waitForPlaying,
} from "./helpers.ts";

test.describe("Game page", () => {
  test("shows countdown before game starts", async ({ page }) => {
    await startGame(page);
    const countdown = page.locator("text=/^[123]$/");
    await expect(countdown.first()).toBeVisible();
  });

  test("input is disabled during countdown", async ({ page }) => {
    await startGame(page);
    await expect(gameInput(page)).toBeDisabled();
  });

  test("game transitions to playing state after countdown", async ({ page }) => {
    await startGame(page);
    await waitForPlaying(page);
  });

  test("shows status bar with timer, wpm, accuracy, and word count", async ({ page }) => {
    await startGame(page);
    await expect(page.getByText("מ/ד")).toBeVisible();
    await expect(page.getByText("60")).toBeVisible();
    await expect(page.getByText("%")).toBeVisible();
  });

  test("typing a correct character is accepted", async ({ page }) => {
    await startGame(page);
    await waitForPlaying(page);

    const firstCharSpan = page.locator(".text-gray-800").first();
    const firstChar = await firstCharSpan.textContent();
    expect(firstChar).toBeTruthy();
    await typeGameText(page, firstChar ?? "");
    await expect(page.locator(".text-violet-600").first()).toBeVisible({
      timeout: 1_000,
    });
  });

  test("typing a wrong character shows a floating red letter", async ({ page }) => {
    await startGame(page);
    const input = await waitForPlaying(page);

    await input.press("z");
    await expect(page.locator(".text-red-400").first()).toBeVisible({
      timeout: 1_000,
    });
  });

  test("can restart from results screen", async ({ page }) => {
    await startGame(page);
    await waitForPlaying(page);

    await page.goto("/");
    await expect(page.getByText(PLAY_BUTTON)).toBeVisible();
  });

  test("home button returns to landing page", async ({ page }) => {
    await startGame(page);
    await waitForPlaying(page);
    await page.goto("/");
    await expect(page).toHaveURL("/");
    await expect(page.getByText(GAME_TITLE)).toBeVisible();
  });
});
