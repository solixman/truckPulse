// tests/tripTests/tripService.test.js
jest.mock("../../models/Trip");

const Trip = require("../../models/Trip");
const tripService = require("../../services/tripService");

describe("Trip Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("creates a new trip", async () => {
    const fakeTrip = { _id: "1", startingPoint: "A", destination: "B" };
    Trip.create.mockResolvedValue(fakeTrip);

    const result = await tripService.create({
      startingPoint: "A",
      destination: "B",
      status: "toDo",
    });

    expect(result).toHaveProperty("_id", "1");
    expect(result.startingPoint).toBe("A");
    expect(result.destination).toBe("B");
  });

  test("returns all trips", async () => {
    const fakeTrips = [{ _id: "1" }, { _id: "2" }];

    // Mock find().populate().populate().limit().skip()
    Trip.find.mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      skip: jest.fn().mockResolvedValue(fakeTrips),
    });

    const result = await tripService.getAll({}, 0);
    expect(result.length).toBe(2);
    expect(result[0]._id).toBe("1");
  });

  test("gets one trip", async () => {
    const fakeTrip = { _id: "1" };

    // Mock findById().populate().populate() chain to resolve to fakeTrip
    const populateMock = jest.fn().mockReturnThis();
    Trip.findById.mockReturnValue({
      populate: populateMock, // first populate
      populate: populateMock, // second populate
      then: (cb) => cb(fakeTrip), // allows await to resolve
    });

    const result = await tripService.getOne("1");
    expect(result._id).toBe("1");
  });

  test("updates a trip", async () => {
    const fakeTrip = {
      _id: "1",
      status: "toDo",
      save: jest.fn().mockResolvedValue({ status: "done" }),
    };
    Trip.findById.mockResolvedValue(fakeTrip);

    const result = await tripService.update("1", { status: "done" });
    expect(result.status).toBe("done");
  });

  test("deletes a trip", async () => {
    Trip.findByIdAndDelete.mockResolvedValue({ _id: "1" });

    const result = await tripService.deleteTrip("1");
    expect(result._id).toBe("1");
  });
});
