jest.mock("../../services/truckService");
const truckService = require("../../services/truckService");
const truckController = require("../../controllers/truckController");



describe("Truck Controller", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, query: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  test("creates a truck", async () => {
    truckService.create.mockResolvedValue({ licensePlate: "A" });
    await truckController.create(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("gets all trucks", async () => {
    truckService.getAll.mockResolvedValue([{ licensePlate: "A" }]);
    await truckController.getAll(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("gets one truck", async () => {
    req.params.id = "1";
    truckService.getOne.mockResolvedValue({ _id: "1" });
    await truckController.getById(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("updates a truck", async () => {
    req.params.id = "1";
    truckService.update.mockResolvedValue({ _id: "1" });
    await truckController.update(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("deletes a truck", async () => {
    req.params.id = "1";
    truckService.deleteTruck.mockResolvedValue({ _id: "1" });
    await truckController.deleteTruck(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
