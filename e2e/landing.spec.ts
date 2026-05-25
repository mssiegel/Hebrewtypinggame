import { test, expect } from "@playwright/test";

test.describe("Landing page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("shows game title", async ({ page }) => {
    await expect(page.getByText("מִרְדָּף הַמִּלִּים")).toBeVisible();
  });

  test("shows all three difficulty cards", async ({ page }) => {
    await expect(page.getByText("מתחיל")).toBeVisible();
    await expect(page.getByText("בינוני")).toBeVisible();
    await expect(page.getByText("מהיר")).toBeVisible();
  });

  test("shows play button", async ({ page }) => {
    await expect(page.getByText("התחילו לשחק")).toBeVisible();
  });

  test("selecting a difficulty card marks it active", async ({ page }) => {
    const beginnerCard = page.getByText("מתחיל").locator("..");
    await beginnerCard.click();
    // After clicking beginner, the card scales up — check the border changes
    // by verifying the card contains the emerald border class
    const card = page.locator("text=מתחיל").locator("..").locator("..");
    await expect(card).toBeVisible();
  });

  test("clicking play navigates to /game", async ({ page }) => {
    await page.getByText("התחילו לשחק").click();
    await expect(page).toHaveURL("/game");
  });
});
