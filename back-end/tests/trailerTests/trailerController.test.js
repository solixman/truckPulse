const trailerController = require("../../controllers/trailerController");
const trailerService = require("../../services/trailerService");

jest.mock("../../services/trailerService");

describe("Trailer Controller", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, query: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  test("creates a trailer", async () => {
    req.body = { licensePlate: "TR123", model: "ModelX" };
    trailerService.create.mockResolvedValue(req.body);

    await trailerController.create(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ trailer: req.body });
  });

  test("gets all trailers", async () => {
    const trailers = [{ licensePlate: "TR1" }];
    trailerService.getAll.mockResolvedValue(trailers);

    await trailerController.getAll(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ trailers });
  });

  test("gets one trailer", async () => {
    req.params.id = "id123";
    const trailer = { licensePlate: "TR123" };
    trailerService.getOne.mockResolvedValue(trailer);

    await trailerController.getById(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(trailer);
  });

  test("updates a trailer", async () => {
    req.params.id = "id123";
    req.body = { licensePlate: "NEW123" };
    const updated = { licensePlate: "NEW123" };
    trailerService.update.mockResolvedValue(updated);

    await trailerController.update(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Trailer updated successfully", trailer: updated });
  });

  test("deletes a trailer", async () => {
    req.params.id = "id123";
    const deleted = { licensePlate: "TR123" };
    trailerService.deleteTrailer.mockResolvedValue(deleted);

    await trailerController.deleteTrailer(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Trailer deleted successfully", trailer: deleted });
  });
});
