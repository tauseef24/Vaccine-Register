const Admin = require('../models/Admin');
const VaccinationCentre = require('../models/VaccinationCentre');

// Admin login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the admin exists in the database
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Verify the password
    if (admin.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Successful login
    return res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Add vaccination centre
exports.addVaccinationCentre = async (req, res) => {
  const { name, address, workingHours } = req.body;

  try {
    // Create a new vaccination centre
    const newCentre = new VaccinationCentre({ name, address, workingHours });
    await newCentre.save();

    return res.status(201).json({ message: 'Vaccination centre added successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get dosage details (group by centres)
exports.getDosageDetails = async (req, res) => {
  try {
    // Group vaccination centres by dosage details
    const dosageDetails = await VaccinationCentre.aggregate([
      {
        $group: {
          _id: null,
          centreId: { $first: '$_id' },
          centreName: { $first: '$name' },
          totalDosage: { $sum: '$dosage' },
        },
      },
    ]);

    return res.status(200).json({ dosageDetails });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Remove vaccination centre
exports.removeVaccinationCentre = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if the vaccination centre exists
    const centre = await VaccinationCentre.findById(id);

    if (!centre) {
      return res.status(404).json({ message: 'Vaccination centre not found' });
    }

    // Delete the vaccination centre
    await centre.remove();

    return res.status(200).json({ message: 'Vaccination centre removed successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
