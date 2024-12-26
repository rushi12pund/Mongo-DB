const express = require("express");

const router = express.Router();

// In-memory users array (replace this with a database in production)
let users = [];

// Route: /
// Method: GET
// Description: Get all users
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    data: users,
  });
});

// Route: /:id
// Method: GET
// Description: Get user by ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const user = users.find((each) => each.id == id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User doesn't exist!",
    });
  }

  return res.status(200).json({
    success: true,
    message: "User found!",
    data: user,
  });
});

// Route: /
// Method: POST
// Description: Create a new user
router.post("/", (req, res) => {
  const { id, name, surname, email, subscriptionType, subscriptionDate } = req.body;

  // Check if the user already exists
  const existingUser = users.find((each) => each.id == id);

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "User with the given ID already exists!",
    });
  }

  // Add the new user to the in-memory array
  users.push({
    id,
    name,
    surname,
    email,
    subscriptionType,
    subscriptionDate,
  });

  return res.status(201).json({
    success: true,
    message: "User added successfully!",
    data: users,
  });
});

// Route: /:id
// Method: PUT
// Description: Update a user by their ID
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  const userIndex = users.findIndex((each) => each.id == id);

  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "User doesn't exist!",
    });
  }

  // Update the user
  users[userIndex] = { ...users[userIndex], ...updatedData };

  return res.status(200).json({
    success: true,
    message: "User updated successfully!",
    data: users[userIndex],
  });
});

// Route: /:id
// Method: DELETE
// Description: Delete a user by their ID
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const userIndex = users.findIndex((each) => each.id == id);

  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "User doesn't exist!",
    });
  }

  // Remove the user from the array
  const deletedUser = users.splice(userIndex, 1);

  return res.status(200).json({
    success: true,
    message: "User deleted successfully!",
    data: deletedUser,
  });
});

// Route: /subscription-details/:id
// Method: GET
// Description: Get all the user's subscription details
router.get("/subscription-details/:id", (req, res) => {
  const { id } = req.params;
  const user = users.find((each) => each.id == id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User with the given ID doesn't exist!",
    });
  }

  const getDateInDays = (date) => Math.floor(new Date(date).getTime() / (1000 * 60 * 60 * 24));

  const subscriptionType = (startDate) => {
    let daysToAdd = 0;
    if (user.subscriptionType === "Basic") daysToAdd = 90;
    else if (user.subscriptionType === "Standard") daysToAdd = 180;
    else if (user.subscriptionType === "Premium") daysToAdd = 365;
    return startDate + daysToAdd;
  };

  const subscriptionStartDate = getDateInDays(user.subscriptionDate);
  const subscriptionExpiration = subscriptionType(subscriptionStartDate);
  const currentDate = getDateInDays(new Date());
  const returnDate = user.returnDate ? getDateInDays(user.returnDate) : currentDate;

  const data = {
    ...user,
    isSubscriptionExpired: subscriptionExpiration < currentDate,
    daysLeftForExpiration: subscriptionExpiration > currentDate ? subscriptionExpiration - currentDate : 0,
    fine: returnDate < currentDate ? (subscriptionExpiration < currentDate ? 100 : 50) : 0,
  };

  return res.status(200).json({
    success: true,
    message: "Subscription details retrieved successfully!",
    data,
  });
});

module.exports = router;
