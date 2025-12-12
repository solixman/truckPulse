// tests/tripTests/tripService.test.js
jest.mock("../../models/Trip", () => ({
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndDelete: jest.fn(),
}));

const Trip = require("../../models/Trip");
const tripService = require("../../services/tripService");
const truckService = require("../../services/truckService");

describe("Trip Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ----------- CRUD TESTS -----------
  test("creates a new trip", async () => {
    const fakeTrip = { _id: "1", startingPoint: "A", destination: "B" };
    Trip.create.mockResolvedValue(fakeTrip);

    const result = await tripService.create({
      startingPoint: "A",
      destination: "B",
      status: "toDo",
    });

    expect(result._id).toBe("1");
    expect(result.startingPoint).toBe("A");
    expect(result.destination).toBe("B");
  });

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

  test("gets one trip", async () => {
    const fakeTrip = { _id: "1", truck: null, trailer: null };
    Trip.findById.mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      then: (cb) => cb(fakeTrip),
    });

    const result = await tripService.getOne("1");
    expect(result._id).toBe("1");
  });

  // test("updates a trip", async () => {
  //   const fakeTrip = {
  //     _id: "1",
  //     status: "toDo",
  //     save: jest.fn().mockResolvedValue({ status: "done" }),
  //   };
  //   Trip.findById.mockResolvedValue(fakeTrip);

  //   const result = await tripService.update("1", { status: "done" });
  //   expect(result.status).toBe("done");
  // });

  test("deletes a trip", async () => {
    Trip.findByIdAndDelete.mockResolvedValue({ _id: "1" });
    const result = await tripService.deleteTrip("1");
    expect(result._id).toBe("1");
  });

  // ----------- ASSIGN TRUCK TESTS -----------
  test("assigns a truck successfully", async () => {
    const fakeTrip = { _id: "trip1", truck: null, save: jest.fn().mockResolvedValue(true) };
    const fakeTruck = { _id: "truck1", status: "available", save: jest.fn().mockResolvedValue(true) };

    // Mock getOne directly from Mongoose behavior
    Trip.findById.mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      then: (cb) => cb(fakeTrip),
    });

    jest.spyOn(truckService, "getOne").mockResolvedValue(fakeTruck);

    const result = await tripService.assignTruck("trip1", "truck1");

    expect(fakeTrip.truck).toBe(fakeTruck._id);
    expect(fakeTruck.status).toBe("unavailable");
    expect(fakeTrip.save).toHaveBeenCalled();
    expect(fakeTruck.save).toHaveBeenCalled();
    expect(result).toEqual({ trip: fakeTrip, truck: fakeTruck });
  });

  test("throws error if trip already has a truck", async () => {
    const fakeTrip = { _id: "trip1", truck: "exists", save: jest.fn() };
    const fakeTruck = { _id: "truck1", status: "available", save: jest.fn() };

    Trip.findById.mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      then: (cb) => cb(fakeTrip),
    });
    jest.spyOn(truckService, "getOne").mockResolvedValue(fakeTruck);

    await expect(tripService.assignTruck("trip1", "truck1")).rejects.toThrow(
      "This trip already has a truck assigned"
    );
  });

  test("throws error if truck is not available", async () => {
    const fakeTrip = { _id: "trip1", truck: null, save: jest.fn() };
    const fakeTruck = { _id: "truck1", status: "unavailable", save: jest.fn() };

    Trip.findById.mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      then: (cb) => cb(fakeTrip),
    });
    jest.spyOn(truckService, "getOne").mockResolvedValue(fakeTruck);

    await expect(tripService.assignTruck("trip1", "truck1")).rejects.toThrow(
      "can't sign this truck it'sunavailable"
    );
  });
});
