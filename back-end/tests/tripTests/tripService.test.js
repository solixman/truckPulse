jest.mock("../../models/Trip", () => ({
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndDelete: jest.fn(),
}));

const Trip = require("../../models/Trip");
const tripService = require("../../services/tripService");
const truckService = require("../../services/truckService");
const trailerService = require("../../services/trailerService");
const maintenanceService = require("../../services/maintenanceServie");

describe("Trip Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // -------- CREATE --------
  test("creates a new trip", async () => {
    const fakeTrip = { _id: "1", startingPoint: "A", destination: "B" };
    Trip.create.mockResolvedValue(fakeTrip);

    const result = await tripService.create({ startingPoint: "A", destination: "B" });

    expect(result._id).toBe("1");
    expect(result.startingPoint).toBe("A");
    expect(result.destination).toBe("B");
  });

  // -------- GET ALL --------
  test("returns all trips", async () => {
    const fakeTrips = [{ _id: "1" }, { _id: "2" }];
    Trip.find.mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      skip: jest.fn().mockResolvedValue(fakeTrips),
    });

    const result = await tripService.getAll({}, 0);
    expect(result.length).toBe(2);
  });

  // -------- GET ONE --------
  test("gets one trip", async () => {
    const fakeTrip = { _id: "1", truck: null, trailer: null };
    Trip.findById.mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      then: (cb) => cb(fakeTrip),
    });

    const result = await tripService.getOne("1");
    expect(result._id).toBe("1");
  });

  // -------- DELETE --------
  test("deletes a trip", async () => {
    Trip.findByIdAndDelete.mockResolvedValue({ _id: "1" });
    const result = await tripService.deleteTrip("1");
    expect(result._id).toBe("1");
  });

  // -------- ASSIGN TRUCK --------
  test("assigns a truck successfully", async () => {
    const fakeTrip = { _id: "trip1", truck: null, save: jest.fn().mockResolvedValue(true), startMileage: 0 };
    const fakeTruck = { _id: "truck1", status: "available", mileage: 1000, save: jest.fn().mockResolvedValue(true), driver: "driver1" };

    Trip.findById.mockReturnValue({ populate: jest.fn().mockReturnThis(), then: (cb) => cb(fakeTrip) });
    jest.spyOn(truckService, "getOne").mockResolvedValue(fakeTruck);

    const result = await tripService.assignTruck("trip1", "truck1");

    expect(fakeTrip.truck).toBe(fakeTruck._id);
    expect(fakeTrip.startMileage).toBe(fakeTruck.mileage);
    expect(fakeTruck.status).toBe("unavailable");
    expect(fakeTrip.save).toHaveBeenCalled();
    expect(fakeTruck.save).toHaveBeenCalled();
    expect(result).toEqual({ trip: fakeTrip, truck: fakeTruck });
  });

  // -------- ASSIGN TRAILER --------
  test("assigns a trailer successfully", async () => {
    const fakeTrip = { _id: "trip1", trailer: null, save: jest.fn().mockResolvedValue(true) };
    const fakeTrailer = { _id: "trailer1", status: "available", save: jest.fn().mockResolvedValue(true) };

    Trip.findById.mockReturnValue({ populate: jest.fn().mockReturnThis(), then: (cb) => cb(fakeTrip) });
    jest.spyOn(trailerService, "getOne").mockResolvedValue(fakeTrailer);

    const result = await tripService.assignTrailer("trip1", "trailer1");

    expect(fakeTrip.trailer).toBe(fakeTrailer._id);
    expect(fakeTrailer.status).toBe("unavailable");
    expect(fakeTrip.save).toHaveBeenCalled();
    expect(fakeTrailer.save).toHaveBeenCalled();
    expect(result).toEqual({ trip: fakeTrip, trailer: fakeTrailer });
  });

  // -------- UPDATE BY DRIVER --------
  test("updates a trip by driver and applies maintenance", async () => {
    const fakeTruck = { _id: "truck1", driver: "driver1", save: jest.fn().mockResolvedValue(true) };
    const fakeTrailer = { _id: "trailer1", save: jest.fn().mockResolvedValue(true) };
    const fakeTrip = {
      _id: "trip1",
      truck: fakeTruck,
      trailer: fakeTrailer,
      startMileage: 1000,
      status: "inProgress",
      save: jest.fn().mockResolvedValue(true),
    };

    Trip.findById.mockReturnValue({ populate: jest.fn().mockReturnThis(), then: (cb) => cb(fakeTrip) });
    jest.spyOn(maintenanceService, "applyMaintenance").mockResolvedValue({ truck: fakeTruck, trailer: fakeTrailer });

    const result = await tripService.updateByDriver(
      { id: "driver1" },
      "trip1",
      { startMileage: 1000, endMileage: 1500, status: "done" }
    );

    expect(maintenanceService.applyMaintenance).toHaveBeenCalledWith(fakeTruck, fakeTrailer, fakeTrip);
    expect(result).toBe(fakeTrip);
    expect(fakeTrip.save).toHaveBeenCalled();
  });
});
