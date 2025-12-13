jest.mock("../../models/MaintenanceRules");

const MaintenanceRules = require("../../models/MaintenanceRules");
const maintenanceService = require("../../services/maintenanceServie");

describe("Maintenance Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("getAll returns rules", async () => {
    const fakeRules = [{ type: "truck" }, { type: "trailer" }];
    MaintenanceRules.find.mockResolvedValue(fakeRules);

    const result = await maintenanceService.getAll();
    expect(result).toBe(fakeRules);
  });

  test("create a new rule", async () => {
    const fakeRule = { type: "truck", kms: 10000, save: jest.fn() };
    MaintenanceRules.mockImplementation(() => fakeRule);

    const result = await maintenanceService.create({ type: "truck", kms: 10000 });
    expect(result).toBe(fakeRule);
    expect(fakeRule.save).toHaveBeenCalled();
  });

  test("update a rule", async () => {
    const fakeRule = { type: "truck", kms: 10000, save: jest.fn() };
    MaintenanceRules.findById.mockResolvedValue(fakeRule);

    const result = await maintenanceService.update("1", { kms: 15000 });
    expect(result).toBe(fakeRule);
    expect(fakeRule.kms).toBe(15000);
    expect(fakeRule.save).toHaveBeenCalled();
  });

  test("applyMaintenance sets truck and trailer status if KMS exceeded", async () => {
    const fakeTruck = { status: "available", save: jest.fn() };
    const fakeTrailer = { status: "available", save: jest.fn() };
    const fakeTrip = { startMileage: 0, endMileage: 10000 };

    MaintenanceRules.findOne
      .mockResolvedValueOnce({ type: "truck", kms: 5000 })
      .mockResolvedValueOnce({ type: "trailer", kms: 8000 });

    const result = await maintenanceService.applyMaintenance(fakeTruck, fakeTrailer, fakeTrip);

    expect(fakeTruck.status).toBe("inMaintenance");
    expect(fakeTrailer.status).toBe("inMaintenance");
    expect(fakeTruck.save).toHaveBeenCalled();
    expect(fakeTrailer.save).toHaveBeenCalled();
  });
});
