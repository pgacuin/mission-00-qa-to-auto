import { Page, Locator, expect } from '@playwright/test';

export class ShipmentIntakePage {
  readonly page: Page;
  readonly newShipmentButton: Locator;
  readonly originInput: Locator;
  readonly destinationInput: Locator;
  readonly weightInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // TODO FOR LEARNER: Replace these brittle CSS/XPath selectors with resilient getByRole / getByLabel locators
    this.newShipmentButton = page.locator('div.toolbar > button.btn-primary:nth-child(1)');
    this.originInput = page.locator('//form[@id="shipment-form"]//input[1]');
    this.destinationInput = page.locator('//form[@id="shipment-form"]//input[2]');
    this.weightInput = page.locator('input.form-control-sm[type="number"]');
    this.submitButton = page.locator('div.modal-footer > button.btn-success');
  }

  async createShipment(origin: string, destination: string, weightKg: number) {
    await this.newShipmentButton.click();
    await this.originInput.fill(origin);
    await this.destinationInput.fill(destination);
    await this.weightInput.fill(String(weightKg));
    await this.submitButton.click();
  }

  async expectShipmentQueued(origin: string, destination: string) {
    // TODO FOR LEARNER: Assert the manifest row displays both origin/destination and the DISPATCH_QUEUED badge
    const row = this.page.getByRole('row', { name: new RegExp(`${origin}.*${destination}`, 'i') });
    await expect(row).toBeVisible();
    await expect(row.getByText('DISPATCH_QUEUED')).toBeVisible();
  }
}
