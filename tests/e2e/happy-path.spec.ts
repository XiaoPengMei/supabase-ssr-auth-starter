import { expect, test } from "@playwright/test";

test("signs in once and stays on the protected page after background refresh", async ({ page }) => {
  await page.goto("/sign-in");

  await page.getByLabel("Email address").fill("demo@example.com");
  await page.getByRole("button", { name: "Open protected page" }).click();

  await expect(page.getByRole("heading", { name: "Protected page" })).toBeVisible();
  await expect(page.getByTestId("signed-in-email")).toHaveText("demo@example.com");
  await expect(page.getByText("POST /api/auth/refresh")).toBeVisible();

  await expect
    .poll(async () => Number(await page.getByTestId("refresh-count").textContent()), {
      timeout: 12_000
    })
    .toBeGreaterThan(0);

  await page.waitForTimeout(4_000);
  await page.reload();

  await expect(page.getByRole("heading", { name: "Protected page" })).toBeVisible();
  await page.getByRole("button", { name: "Load protected data" }).click();
  await expect(page.getByTestId("secret-response")).toContainText("no middleware stall");
});
