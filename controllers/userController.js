const User = require('../models/User');
const VaccinationCentre = require('../models/VaccinationCentre');

// User login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists in the database
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify the password
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Successful login
    return res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// User signup
exports.signup = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    // Check if the user with the given email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Create a new user
    const newUser = new User({ email, password, name });
    await newUser.save();

    return res.status(201).json({ message: 'Signup successful' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get vaccination centres and working hours
exports.getVaccinationCentres = async (req, res) => {
  try {
    // Retrieve all vaccination centres
    const vaccinationCentres = await VaccinationCentre.find();

    return res.status(200).json({ vaccinationCentres });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Apply for a vaccination slot
exports.applySlot = async (req, res) => {
  const { userId, centreId } = req.body;

  try {
    // Retrieve the vaccination centre
    const vaccinationCentre = await VaccinationCentre.findById(centreId);

    if (!vaccinationCentre) {
      return res.status(404).json({ message: 'Vaccination centre not found' });
    }

    // Check if the centre has available slots
    if (vaccinationCentre.availableSlots <= 0) {
      return res.status(400).json({ message: 'No available slots' });
    }

    // Update the available slots and save the centre
    vaccinationCentre.availableSlots--;
    await vaccinationCentre.save();

    // Assign the slot to the user and save the user
    const user = await User.findById(userId);
    user.slot = vaccinationCentre;
    await user.save();

    return res.status(200).json({ message: 'Slot assigned successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// User logout
exports.logout = async (req, res) => {
  // Perform logout actions, such as clearing session data
  return res.status(200).json({ message: 'Logout successful' });
};
