import { OmnichannelManager } from './page-objects';
import { test, expect } from './utils/test';

test.use({ storageState: 'admin-session.json' });

test.describe.serial('omnichannel-manager', () => {
	let poOmnichannelManagers: OmnichannelManager;

	test.beforeEach(async ({ page }) => {
		poOmnichannelManagers = new OmnichannelManager(page);

		await page.goto('/omnichannel');
		await poOmnichannelManagers.sidenav.linkManagers.click();
	});

	test('Managers', async ({ page }) => {
		await test.step('expect add "user1" as manager', async () => {
			await poOmnichannelManagers.inputUsername.type('user1 ', { delay: 1000 });
			await page.keyboard.press('Enter');
			await poOmnichannelManagers.btnAdd.click();

			await expect(poOmnichannelManagers.firstRowInTable('user1')).toBeVisible();
		});
		await test.step('expect remove "user1" as manager', async () => {
			await poOmnichannelManagers.btnDeleteSelectedAgent('user1').click();
			await poOmnichannelManagers.btnModalRemove.click();

			await expect(poOmnichannelManagers.firstRowInTable('user1')).toBeHidden();
		});
	});
});
