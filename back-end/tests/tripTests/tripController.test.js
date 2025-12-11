// tests/tripTests/tripController.test.js
jest.mock("../../services/tripService");
const tripService = require("../../services/tripService");
const tripController = require("../../controllers/tripController");

describe("Trip Controller", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, query: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  test("creates a trip", async () => {
    const fakeTrip = { _id: "1", startingPoint: "A", destination: "B" };
    tripService.create.mockResolvedValue(fakeTrip);

    await tripController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ trip: fakeTrip });
  });

  test("gets all trips", async () => {
    const fakeTrips = [{ _id: "1" }, { _id: "2" }];
    tripService.getAll.mockResolvedValue(fakeTrips);

    await tripController.getAll(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ trips: fakeTrips });
  });

  test("gets one trip by ID", async () => {
    req.params.id = "1";
    const fakeTrip = { _id: "1" };
    tripService.getOne.mockResolvedValue(fakeTrip);

    await tripController.getById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(fakeTrip);
  });

  test("updates a trip", async () => {
    req.params.id = "1";
    const fakeTrip = { _id: "1" };
    tripService.update.mockResolvedValue(fakeTrip);

    await tripController.update(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Trip updated successfully",
      trip: fakeTrip,
    });
  });

  test("deletes a trip", async () => {
    req.params.id = "1";
    const fakeTrip = { _id: "1" };
    tripService.deleteTrip.mockResolvedValue(fakeTrip);

    await tripController.deleteTrip(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      trip: fakeTrip,
      message: "Trip deleted successfully",
    });
  });
});
