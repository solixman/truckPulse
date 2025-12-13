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

  // -------- CREATE --------
  test("creates a trip", async () => {
    const fakeTrip = { _id: "1" };
    tripService.create.mockResolvedValue(fakeTrip);

    await tripController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ trip: fakeTrip });
  });

  // -------- GET ALL --------
  test("gets all trips", async () => {
    const fakeTrips = [{ _id: "1" }, { _id: "2" }];
    tripService.getAll.mockResolvedValue(fakeTrips);

    await tripController.getAll(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ trips: fakeTrips });
  });

  // -------- GET ONE --------
  test("gets one trip", async () => {
    const fakeTrip = { _id: "1" };
    req.params.id = "1";
    tripService.getOne.mockResolvedValue(fakeTrip);

    await tripController.getById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(fakeTrip);
  });

  // -------- UPDATE --------
  test("updates a trip as Admin", async () => {
    req.params.id = "1";
    req.body.user = { role: "Admin" };
    const fakeTrip = { _id: "1" };
    tripService.update.mockResolvedValue(fakeTrip);

    await tripController.update(req, res);

    expect(tripService.update).toHaveBeenCalledWith(req.body.user, "1", req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Trip updated successfully", trip: fakeTrip });
  });

  test("updates a trip as Driver", async () => {
    req.params.id = "1";
    req.body.user = { role: "Driver", id: "driver1" };
    const fakeTrip = { _id: "1" };
    tripService.updateByDriver.mockResolvedValue(fakeTrip);

    await tripController.update(req, res);

    expect(tripService.updateByDriver).toHaveBeenCalledWith(req.body.user, "1", req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Trip updated successfully", trip: fakeTrip });
  });

  test("throws error on unauthorized role", async () => {
    req.params.id = "1";
    req.body.user = { role: "Guest" };

    await tripController.update(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized role" });
  });

  // -------- DELETE --------
  test("deletes a trip", async () => {
    req.params.id = "1";
    const fakeTrip = { _id: "1" };
    tripService.deleteTrip.mockResolvedValue(fakeTrip);

    await tripController.deleteTrip(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Trip deleted successfully", trip: fakeTrip });
  });

  // -------- ASSIGN TRUCK --------
  test("assigns a truck successfully", async () => {
    req.params.id = "1";
    req.body.truckId = "truck1";
    const fakeResult = { trip: { _id: "1" }, truck: { _id: "truck1" } };
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

  // -------- ASSIGN TRAILER --------
  test("assigns a trailer successfully", async () => {
    req.params.id = "1";
    req.body.trailerId = "trailer1";
    const fakeResult = { trip: { _id: "1" }, trailer: { _id: "trailer1" } };
    tripService.assignTrailer.mockResolvedValue(fakeResult);

    await tripController.assignTrailer(req, res);

    expect(tripService.assignTrailer).toHaveBeenCalledWith("1", "trailer1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      trip: fakeResult.trip,
      trailer: fakeResult.trailer,
      message: "trailer assigned successfully",
    });
  });

  test("handles assignTrailer error", async () => {
    req.params.id = "1";
    req.body.trailerId = "trailer1";
    tripService.assignTrailer.mockRejectedValue(new Error("Trailer not available"));

    await tripController.assignTrailer(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Trailer not available" });
  });
});
