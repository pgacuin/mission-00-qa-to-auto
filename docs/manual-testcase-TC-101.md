# Legacy Manual Test Case: TC-101 — Shipment Intake & Dispatch Queueing

* **Module:** LogiStream Dispatch Portal (`/dispatch`)
* **Priority:** High (Release Blocker)
* **Average Manual Execution Time:** 6 minutes per run
* **Preconditions:** User is logged in with `Dispatcher` role permissions.

## Manual Execution Steps

| Step | Action | Expected Result |
| :--- | :--- | :--- |
| 1 | Navigate to `/dispatch`. | Dispatch Operations dashboard loads. |
| 2 | Click the **New Shipment** button. | Shipment intake form/modal opens. |
| 3 | Enter **Origin:** `Manila Hub` | Origin field displays `Manila Hub`. |
| 4 | Enter **Destination:** `Cebu Port` | Destination field displays `Cebu Port`. |
| 5 | Enter **Weight (kg):** `4500` | Weight field displays `4500`. |
| 6 | Click **Create Shipment**. | Form submits and closes. |
| 7 | *Human Pause:* Wait 3 seconds for manifest table refresh. | Table finishes loading. |
| 8 | Locate the row for `Manila Hub` to `Cebu Port`. | Row appears with status badge `DISPATCH_QUEUED`. |
