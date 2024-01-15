import { test, expect } from "@playwright/test";
import { GroupPage } from "./group.po";

let groupPage: GroupPage;

test.beforeEach(async ({ page }) => {
  groupPage = new GroupPage(page);
  await groupPage.goto();
});


test("can delete groups", async () => {
  await groupPage.deleteGroup();
  expect(groupPage.page.url()).toBe("/home");
});