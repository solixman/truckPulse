const tripService = require("../../services/tripService");
const Trip = require("../../models/Trip");
const fs = require("fs");
const path = require("path");


jest.mock("pdfkit", () => {
  return jest.fn().mockImplementation(() => {
    return {
      fontSize: jest.fn().mockReturnThis(),
      text: jest.fn().mockReturnThis(),
      moveDown: jest.fn().mockReturnThis(),
      pipe: jest.fn().mockReturnThis(),
      end: jest.fn(),
    };
  });
});

jest.mock("fs", () => ({
  createWriteStream: jest.fn(),
}));

describe("Trip Service - generatePDF", () => {
  const user = { id: "driver1" };
  const tripId = "trip1";
  let fakeTrip;

  beforeEach(() => {
    jest.clearAllMocks();

    fakeTrip = {
      _id: tripId,
      startingPoint: "City A",
      destination: "City B",
      startDate: "2025-12-14",
      startMileage: 1000,
      truck: { _id: "truck1", driver: "driver1", model: "Volvo" },
      trailer: { _id: "trailer1", model: "Schmitz" },
      status: "toDo",
      notes: "Handle with care",
    };
  });

  test("generates a PDF successfully for assigned driver", async () => {
    jest.spyOn(Trip, "findById").mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      then: (cb) => cb(fakeTrip),
    });

    const filePath = await tripService.generatePDF(user, tripId);

    expect(filePath).toContain(`trip_${tripId}.pdf`);
  });

  test("throws error if trip does not exist", async () => {
    jest.spyOn(Trip, "findById").mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      then: (cb) => cb(null),
    });

    await expect(tripService.generatePDF(user, tripId)).rejects.toThrow(
      "Trip not found"
    );
  });

  test("throws error if trip is not assigned to this driver", async () => {
    const anotherTrip = { ...fakeTrip, truck: { driver: "otherDriver" } };
    jest.spyOn(Trip, "findById").mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      then: (cb) => cb(anotherTrip),
    });

    await expect(tripService.generatePDF(user, tripId)).rejects.toThrow(
      "This trip is not assigned to you"
    );
  });
});
