jest.mock("../../models/Tire", () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndDelete: jest.fn(),
}));

const Tire = require("../../models/Tire");
const tireService = require("../../services/tireService");

describe("Tire Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("creates a new tire", async () => {
    const tireData = { brand: "Michelin", size: "17", status: "inStorage" };
    Tire.create.mockResolvedValue(tireData);

    const tire = await tireService.create(tireData);
    expect(tire).toEqual(tireData);
    expect(Tire.create).toHaveBeenCalledWith(tireData);
  });

  test("gets all tires with filters", async () => {
    const tires = [{ brand: "Pirelli" }, { brand: "Goodyear" }];
    Tire.find.mockResolvedValue(tires);

    const result = await tireService.getAll({ brand: "Pirelli" });
    expect(Tire.find).toHaveBeenCalledWith({ brand: "Pirelli" });
    expect(result).toEqual(tires);
  });

  test("gets one tire by id", async () => {
    const tire = { brand: "Michelin" };
    Tire.findById.mockResolvedValue(tire);

    const result = await tireService.getOne("id123");
    expect(result).toEqual(tire);
  });

  test("throws error if tire not found (getOne)", async () => {
    Tire.findById.mockResolvedValue(null);
    await expect(tireService.getOne("id123")).rejects.toThrow("Tire not found");
  });

  test("updates a tire successfully", async () => {
    const fakeTire = { brand: "Michelin", size: "17", status: "inStorage", save: jest.fn() };
    Tire.findById.mockResolvedValue(fakeTire);

    const updated = await tireService.update("id123", { brand: "Pirelli" });
    expect(fakeTire.brand).toBe("Pirelli");
    expect(fakeTire.save).toHaveBeenCalled();
  });

  test("throws error if tire not found (update)", async () => {
    Tire.findById.mockResolvedValue(null);
    await expect(tireService.update("id123", { brand: "Pirelli" })).rejects.toThrow("Tire not found");
  });

  test("deletes a tire successfully", async () => {
    const tire = { brand: "Michelin" };
    Tire.findByIdAndDelete.mockResolvedValue(tire);

    const deleted = await tireService.deleteTire("id123");
    expect(deleted).toEqual(tire);
  });

  test("throws error if deleting non-existent tire", async () => {
    Tire.findByIdAndDelete.mockResolvedValue(null);
    await expect(tireService.deleteTire("id123")).rejects.toThrow("Tire not found");
  });
});