const Ingredients = require("../models/ingredientsModel");

const getAllIngredients = async (req, res, next) => {
  try {
    const ingredients = await Ingredients.find().sort({ createdAt: -1 }).populate("vendor", "name");
    res.status(200).send(ingredients);
  } catch (error) {
    next(error);
  }
};

const getIngredient = async (req, res, next) => {
  try {
    const ingredient = await Ingredients.findById(req.params.id)
      .populate("vendor", "name")
      .populate("comments.user", ["name", "profilePicture"]);

    if (!ingredient) return res.status(404).json({ message: "Ingredient not found" });

    res.status(200).send(ingredient);
  } catch (error) {
      next(error);
    }
  };

  const addIngredient = async (req, res, next) => {
    try {
      const { title, description, image ,quantity,price} = req.body;
      if (!title || !description || !image || !quantity || !price) {
        return res.status(422).json({ message: "Insufficient data" });
      }
      const ingredient = Ingredients({ ...req.body, vendor: req.user });
      await ingredient.save();
      res.status(201).json({ success: "Ingredient added successfully" });
    } catch (error) {
      next(error);
    }
  };

  const updateIngredient = async (req, res, next) => {
    try {
      const { title, description, image ,quantity ,price} = req.body;
      if (!title || !description || !image  || !quantity || !price) {
        return res.status(422).json({ message: "Insufficient data" });
      }

      const foundIngredient = await Ingredients.findById(req.params.id);
      if (!foundIngredient) return res.status(404).json({ message: "Ingredient not found" });

      if (foundIngredient.vendor.toString() !== req.user) return res.status(401).json({ message: "Unauthorized" });

      foundIngredient.title = title;
      foundIngredient.description = description;
      foundIngredient.image = image;
      foundIngredient.quantity = quantity;

      const updatedIngredient = await foundIngredient.save();
      res.status(201).json(updatedIngredient);
    } catch (error) {
      next(error);
    }
  };

const deleteIngredient = async (req, res, next) => {
  try {
    const foundIngredient = await Ingredients.findById(req.params.id);
    if (!foundIngredient) return res.status(404).json({ message: "Ingredient not found" });

    if (foundIngredient.vendor.toString() !== req.user) return res.status(401).json({ message: "Unauthorized" });

    await foundIngredient.deleteOne();
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const rateIngredient = async (req, res, next) => {
  try {
    const { rating } = req.body;
    const ingredient = await Ingredients.findById(req.params.id);
    if (!ingredient) return res.status(404).json({ message: "Ingredient not found" });

    const existingRating = ingredient.ratings.find((rate) => rate.user.equals(req.user));
    if (existingRating) return res.status(400).json({ message: "User has already rated this ingredient" });

    ingredient.ratings.push({ user: req.user, rating });
    await ingredient.save();

    res.status(201).json({ message: "Rating added successfully" });
  } catch (error) {
    next(error);
  }
};

const addComment = async (req, res, next) => {
  try {
    const { comment } = req.body;
    if (!comment) return res.status(400).json({ message: "Comment is required" });

    const ingredient = await Ingredients.findById(req.params.id);
    if (!ingredient) return res.status(404).json({ message: "Ingredient not found" });

    ingredient.comments.push({ user: req.user, comment });
    await ingredient.save();

    res.status(201).json({ message: "Comment added successfully" });
  } catch (error) {
    next(error);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const { ingredientId, commentId } = req.params;
    const ingredient = await Ingredients.findById(ingredientId);
    if (!ingredient) return res.status(404).json({ message: "Ingredient not found" });

    const commentIndex = ingredient.comments.findIndex((comment) => comment._id.equals(commentId));
    if (commentIndex === -1) return res.status(404).json({ message: "Comment not found" });

    ingredient.comments.splice(commentIndex, 1);
    await ingredient.save();

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllIngredients,
  getIngredient,
  addIngredient,
  updateIngredient,
  deleteIngredient,
  rateIngredient,
  addComment,
  deleteComment,
};
