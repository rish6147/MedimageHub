const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Registration Function
exports.register = async (req, res) => {
  const { name, email, password, uniqueId } = req.body;

  try {
    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user with uniqueId
    user = new User({
      name,
      email,
      password: hashedPassword,
      uniqueId, // Include the uniqueId field here
    });

    // Save the user to the database
    await user.save();

    // Generate a JWT token with uniqueId included in the payload
    const token = jwt.sign(
      { id: user._id, uniqueId: user.uniqueId }, // using uniqueId in the token payload
      'yourSecretKey', // Secret key
      { expiresIn: '1h' } // Token expiration
    );

    res.json({ token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Login Function
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    // Compare provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    // Generate a JWT token with uniqueId in the payload
    const token = jwt.sign(
      { id: user._id, uniqueId: user.uniqueId }, // using uniqueId in the token payload
      'yourSecretKey', // Secret key
      { expiresIn: '1h' } // Token expiration
    );

    res.json({ token });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};
