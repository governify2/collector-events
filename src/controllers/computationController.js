const createComputation = async (req, res, next) => {
  try {
    const newComputation = await computationService.createComputation(req.body);
    logger.info(`Creating computation with id: ${newComputation._id}`);
    res.sendSuccess(removeMongoFields(newComputation), 'Computation created successfully', 201);
  } catch (error) {
    next(error);
  }
};

const getComputationById = async (req, res, next) => {
  try {
    const computation = await computationService.getComputationById(req.params.id);
    if (!computation) throw new NotFoundError('Computation not found');
    res.sendSuccess(removeMongoFields(computation));
  } catch (error) {
    res.sendError(error);
  }
};

module.exports = {
  createComputation,
  getComputationById,
};
