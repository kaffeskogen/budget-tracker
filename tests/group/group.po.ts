import { Locator, Page } from "@playwright/test";

export class GroupPage {
  page: Page;
  groupMenu: Locator;
  renameGroupButton: Locator;
  deleteGroupButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.groupMenu = page.getByTestId("group-menu");
    this.renameGroupButton = page.getByTestId("rename-group");
    this.deleteGroupButton = page.getByTestId("delete-group");
  }

  async goto() {
    await this.page.goto('/');
    await this.page.getByRole('link', { name: 'Food' }).click();
  }

  async deleteGroup() {
    await this.groupMenu.click();
    await this.deleteGroupButton.click();
  }

}