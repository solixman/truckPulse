jest.mock("../../services/maintenanceServie");
const maintenanceService = require("../../services/maintenanceServie");
const maintenanceController = require("../../controllers/MaintenanceController");

describe("Maintenance Controller", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    jest.clearAllMocks();
  });

  test("gets all rules", async () => {
    const fakeRules = [{ type: "truck" }, { type: "trailer" }];
    maintenanceService.getAll.mockResolvedValue(fakeRules);

    await maintenanceController.getAll(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ rules: fakeRules });
  });

  test("creates a new rule", async () => {
    const fakeRule = { _id: "1", type: "truck", kms: 10000 };
    req.body = { type: "truck", kms: 10000 };
    maintenanceService.create.mockResolvedValue(fakeRule);

    await maintenanceController.create(req, res);

    expect(maintenanceService.create).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "rule created succesfully",
      rule: fakeRule,
    });
  });

  test("updates a rule", async () => {
    const fakeRule = { _id: "1", type: "truck", kms: 15000 };
    req.params.id = "1";
    req.body = { kms: 15000 };
    maintenanceService.update.mockResolvedValue(fakeRule);

    await maintenanceController.update(req, res);

    expect(maintenanceService.update).toHaveBeenCalledWith("1", req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Maintenance rule updated succesfully",
      rule: fakeRule,
    });
  });
});
