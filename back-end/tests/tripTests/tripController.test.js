jest.mock("../../services/tripService");
const tripService = require("../../services/tripService");
const tripController = require("../../controllers/tripController");

describe("Trip Controller", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {}, query: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    jest.clearAllMocks();
  });

  test("creates a trip", async () => {
    const fakeTrip = { _id: "1" };
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

  test("gets one trip", async () => {
    const fakeTrip = { _id: "1" };
    req.params.id = "1";
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
  });

  test("deletes a trip", async () => {
    req.params.id = "1";
    const fakeTrip = { _id: "1" };
    tripService.deleteTrip.mockResolvedValue(fakeTrip);

    await tripController.deleteTrip(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  // --- assignTruck tests ---
  test("assigns a truck successfully", async () => {
    req.params.id = "1";
    req.body.truckId = "truck1";
    const fakeResult = {
      trip: { _id: "1" },
      truck: { _id: "truck1" },
    };

    tripService.assignTruck.mockResolvedValue(fakeResult);

    await tripController.assignTruck(req, res);

    expect(tripService.assignTruck).toHaveBeenCalledWith("1", "truck1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      trip: fakeResult.trip,
      truck: fakeResult.truck,
      message: "Truck assigned successfully",
    });
  });

  test("handles assignTruck error", async () => {
    req.params.id = "1";
    req.body.truckId = "truck1";
    tripService.assignTruck.mockRejectedValue(new Error("Truck not available"));

    await tripController.assignTruck(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Truck not available" });
  });
});
