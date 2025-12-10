jest.mock("../../models/Truck", () => ({
  create: jest.fn(),
  find: jest.fn().mockReturnThis(),
  findOne: jest.fn(),
  findById: jest.fn(),
  findByIdAndDelete: jest.fn(),
}));

const Truck = require("../../models/Truck");
const truckService = require("../../services/truckService");

describe("Truck Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("creates a new truck when licensePlate is unique", async () => {
    Truck.findOne.mockResolvedValue(null); // no truck with this plate
    Truck.create.mockResolvedValue({ licensePlate: "ABC123" });

    const result = await truckService.create({
      licensePlate: "ABC123",
      model: "Volvo",
      mileage: 10000,
    });

    expect(result.licensePlate).toBe("ABC123");
  });

  test("throws error if licensePlate already exists", async () => {
    Truck.findOne.mockResolvedValue({ licensePlate: "DUPLICATE" }); // plate exists

    await expect(
      truckService.create({
        licensePlate: "DUPLICATE",
        model: "Volvo",
        mileage: 10000,
      })
    ).rejects.toThrow("License plate already exists");
  });

  test("returns list of trucks", async () => {
    Truck.find.mockReturnValue({
      limit: jest.fn().mockReturnThis(),
      skip: jest.fn().mockResolvedValue([{ licensePlate: "A" }, { licensePlate: "B" }]),
    });

    const result = await truckService.getAll({}, 0);
    expect(result.length).toBe(2);
  });

  test("updates a truck", async () => {
    const fakeTruck = {
      _id: "1",
      licensePlate: "OLD",
      status: "available",
      save: jest.fn().mockResolvedValue({ licensePlate: "NEW" }),
    };
    Truck.findById.mockResolvedValue(fakeTruck);
    Truck.findOne.mockResolvedValue(null); // important: simulate unique plate

    const result = await truckService.update("1", { licensePlate: "NEW" });
    expect(result.licensePlate).toBe("NEW");
  });

  test("deletes a truck", async () => {
    Truck.findByIdAndDelete.mockResolvedValue({ _id: "1" });

    const result = await truckService.deleteTruck("1");
    expect(result._id).toBe("1");
  });

  test("gets one truck", async () => {
    Truck.findById.mockResolvedValue({ _id: "1" });

    const result = await truckService.getOne("1");
    expect(result._id).toBe("1");
  });
});
