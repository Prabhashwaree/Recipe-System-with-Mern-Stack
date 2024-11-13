const express = require("express");
const {
  getAllIngredients,
  getIngredient,
  addIngredient,
  updateIngredient,
  deleteIngredient,
  rateIngredient,
  addComment,
  deleteComment,
} = require("../controllers/ingredientController");
const ROLES_LIST = require("../config/rolesList");
const verifyJwt = require("../middleware/verifyJwt");
const verifyRoles = require("../middleware/verifyRoles");

const router = express.Router();

router
  .route("/")
  .get(getAllIngredients)
  .post(
    [verifyJwt, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Vendor, ROLES_LIST.ProUser)],
    addIngredient
  );

router
  .route("/rate/:id")
  .put(
    [verifyJwt, verifyRoles(ROLES_LIST.BasicUser, ROLES_LIST.Vendor, ROLES_LIST.ProUser)],
    rateIngredient
  );

router
  .route("/:id")
  .get(getIngredient)
  .put(
    [verifyJwt, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Vendor, ROLES_LIST.ProUser)],
    updateIngredient
  )
  .delete(
    [verifyJwt, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Vendor, ROLES_LIST.ProUser)],
    deleteIngredient
  );

router
  .route("/comment/:id")
  .put(
    [verifyJwt, verifyRoles(ROLES_LIST.BasicUser, ROLES_LIST.Vendor, ROLES_LIST.ProUser)],
    addComment
  );

router
  .route("/comment/:ingredientId/:commentId")
  .delete(
    [verifyJwt, verifyRoles(ROLES_LIST.BasicUser, ROLES_LIST.Vendor, ROLES_LIST.ProUser)],
    deleteComment
  );

module.exports = router;
