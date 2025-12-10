const tireController = require("../../controllers/tireController");
const tireService = require("../../services/tireService");

jest.mock("../../services/tireService");

describe("Tire Controller", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, query: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  test("creates a tire", async () => {
    req.body = { brand: "Michelin" };
    tireService.create.mockResolvedValue(req.body);

    await tireController.create(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ tire: req.body });
  });

  test("gets all tires", async () => {
    const tires = [{ brand: "Goodyear" }];
    tireService.getAll.mockResolvedValue(tires);

    await tireController.getAll(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ tires });
  });

  test("gets one tire", async () => {
    req.params.id = "id123";
    const tire = { brand: "Michelin" };
    tireService.getOne.mockResolvedValue(tire);

    await tireController.getById(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(tire);
  });

  test("updates a tire", async () => {
    req.params.id = "id123";
    req.body = { brand: "Pirelli" };
    const updated = { brand: "Pirelli" };
    tireService.update.mockResolvedValue(updated);

    await tireController.update(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Tire updated successfully",
      tire: updated,
    });
  });

  test("deletes a tire", async () => {
    req.params.id = "id123";
    const deleted = { brand: "Michelin" };
    tireService.deleteTire.mockResolvedValue(deleted);

    await tireController.deleteTire(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Tire deleted successfully",
      tire: deleted,
    });
  });
});
