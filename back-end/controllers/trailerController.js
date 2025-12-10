const trailerService = require("../services/trailerService");

async function create(req, res) {
  try {
    const trailer = await trailerService.create(req.body);
    return res.status(200).json({ trailer });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message });
  }
}

async function getAll(req, res) {
  try {
    const filters = req.query || {};
    const skip = parseInt(req.query.skip) || 0;
    const trailers = await trailerService.getAll(filters, skip);
    return res.status(200).json({ trailers });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message });
  }
}

async function getById(req, res) {
  try {
    const trailer = await trailerService.getOne(req.params.id);
    return res.status(200).json(trailer);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message });
  }
}

async function update(req, res) {
  try {
    const trailer = await trailerService.update(req.params.id, req.body);
    return res
      .status(200)
      .json({ message: "Trailer updated successfully", trailer });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message });
  }
}

async function deleteTrailer(req, res) {
  try {
    const trailer = await trailerService.deleteTrailer(req.params.id);
    return res
      .status(200)
      .json({ message: "Trailer deleted successfully", trailer });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message });
  }
}

module.exports = { create, getAll, getById, update, deleteTrailer };
