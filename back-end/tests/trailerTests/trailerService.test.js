
jest.mock("../../models/Trailer", () => {
  return {
    findOne: jest.fn(),
    create: jest.fn(),
    find: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    skip: jest.fn().mockResolvedValue([]),
    findById: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };
});

const Trailer = require("../../models/Trailer");
const trailerService = require("../../services/trailerService");


describe("Trailer Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("creates a new trailer when licensePlate is unique", async () => {
    Trailer.findOne.mockResolvedValue(null);
    Trailer.create.mockResolvedValue({ licensePlate: "TR123" });

    const trailer = await trailerService.create({ licensePlate: "TR123", model: "ModelX" });

    expect(Trailer.findOne).toHaveBeenCalledWith({ licensePlate: "TR123" });
    expect(trailer.licensePlate).toBe("TR123");
  });

  test("throws error if licensePlate already exists", async () => {
    Trailer.findOne.mockResolvedValue({ licensePlate: "TR123" });

    await expect(trailerService.create({ licensePlate: "TR123", model: "ModelX" }))
      .rejects
      .toThrow("License plate already exists");
  });

  test("gets all trailers with filters", async () => {
    const trailers = [{ licensePlate: "TR1" }, { licensePlate: "TR2" }];
    Trailer.find.mockReturnValue({ limit: jest.fn().mockReturnThis(), skip: jest.fn().mockResolvedValue(trailers) });

    const result = await trailerService.getAll({ status: "available" }, 0);
    expect(result).toEqual(trailers);
    expect(Trailer.find).toHaveBeenCalledWith({ status: "available" });
  });

  test("gets one trailer by id", async () => {
    Trailer.findById.mockResolvedValue({ licensePlate: "TR123" });

    const trailer = await trailerService.getOne("id123");
    expect(trailer.licensePlate).toBe("TR123");
  });

  test("throws error if trailer not found", async () => {
    Trailer.findById.mockResolvedValue(null);

    await expect(trailerService.getOne("id123"))
      .rejects
      .toThrow("Trailer not found");
  });

  test("updates a trailer safely", async () => {
    const fakeTrailer = { licensePlate: "TR123", save: jest.fn().mockResolvedValue(true) };
    Trailer.findById.mockResolvedValue(fakeTrailer);
    Trailer.findOne.mockResolvedValue(null);

    const updated = await trailerService.update("id123", { licensePlate: "NEW123", model: "ModelY" });
    expect(fakeTrailer.licensePlate).toBe("NEW123");
    expect(fakeTrailer.model).toBe("ModelY");
  });

  test("throws error when updating with duplicate licensePlate", async () => {
    const fakeTrailer = { licensePlate: "TR123", save: jest.fn() };
    Trailer.findById.mockResolvedValue(fakeTrailer);
    Trailer.findOne.mockResolvedValue({ licensePlate: "NEW123" });

    await expect(trailerService.update("id123", { licensePlate: "NEW123" }))
      .rejects
      .toThrow("License plate already exists");
  });

  test("deletes a trailer", async () => {
    Trailer.findByIdAndDelete.mockResolvedValue({ licensePlate: "TR123" });

    const deleted = await trailerService.deleteTrailer("id123");
    expect(deleted.licensePlate).toBe("TR123");
  });

  test("throws error if deleting non-existent trailer", async () => {
    Trailer.findByIdAndDelete.mockResolvedValue(null);

    await expect(trailerService.deleteTrailer("id123"))
      .rejects
      .toThrow("Trailer not found");
  });
});
