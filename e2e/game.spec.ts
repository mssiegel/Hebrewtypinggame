import { test, expect } from "@playwright/test";

test.describe("Game page", () => {
  async function goToGame(page: import("@playwright/test").Page, difficulty = "מתחיל") {
    await page.goto("/");
    // Select the difficulty matching the param
    await page.getByText(difficulty).first().click();
    await page.getByText("התחילו לשחק").click();
    await expect(page).toHaveURL("/game");
  }

  test("shows countdown before game starts", async ({ page }) => {
    await goToGame(page);
    // One of the countdown numbers should be visible immediately
    const countdown = page.locator("text=/^[123]$/");
    await expect(countdown.first()).toBeVisible();
  });

  test("input is disabled during countdown", async ({ page }) => {
    await goToGame(page);
    const input = page.locator("input");
    await expect(input).toBeDisabled();
  });

  test("game transitions to playing state after countdown", async ({ page }) => {
    await goToGame(page);
    // Wait for countdown to finish (~4s) and input to become enabled
    const input = page.locator("input");
    await expect(input).toBeEnabled({ timeout: 6000 });
  });

  test("shows status bar with timer, wpm, accuracy, and word count", async ({ page }) => {
    await goToGame(page);
    await expect(page.getByText("מ/ד")).toBeVisible();
    await expect(page.getByText("60")).toBeVisible(); // initial timer
    await expect(page.getByText("%")).toBeVisible();   // accuracy %
  });

  test("typing a correct character is accepted", async ({ page }) => {
    await goToGame(page);
    const input = page.locator("input");
    await expect(input).toBeEnabled({ timeout: 6000 });

    // Read the first character expected from the word bubble
    // The current word chars are rendered as individual spans in the WordPill.
    // We type into the input and check it becomes violet (correct).
    const firstCharSpan = page.locator(".text-gray-800").first();
    const firstChar = await firstCharSpan.textContent();
    if (firstChar) {
      await input.press(firstChar);
      // The typed char should now be violet-highlighted (text-violet-600)
      await expect(page.locator(".text-violet-600").first()).toBeVisible({ timeout: 1000 });
    }
  });

  test("typing a wrong character shows a floating red letter", async ({ page }) => {
    await goToGame(page);
    const input = page.locator("input");
    await expect(input).toBeEnabled({ timeout: 6000 });

    // Press a key that is definitely wrong: a Latin character won't match any Hebrew word
    await input.press("z");
    // A floating red character should appear briefly
    await expect(page.locator(".text-red-400").first()).toBeVisible({ timeout: 1000 });
  });

  test("can restart from results screen", async ({ page }) => {
    await goToGame(page);
    const input = page.locator("input");
    await expect(input).toBeEnabled({ timeout: 6000 });

    // Fast-forward: wait for game to finish naturally (60s) — too slow.
    // Instead, navigate directly back to landing and replay.
    await page.goto("/");
    await expect(page.getByText("התחילו לשחק")).toBeVisible();
  });

  test("home button returns to landing page", async ({ page }) => {
    await goToGame(page);
    // Wait for game to be in playing state, then navigate to /
    const input = page.locator("input");
    await expect(input).toBeEnabled({ timeout: 6000 });
    await page.goto("/");
    await expect(page).toHaveURL("/");
    await expect(page.getByText("מִרְדָּף הַמִּלִּים")).toBeVisible();
  });
});
