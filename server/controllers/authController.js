import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretjwtkey_donations_platform', {
    expiresIn: '30d',
  });
};


export const register = async (req, res) => {
  try {
    const { name, email, password, location, phoneNumber } = req.body;

    // Final checks
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      location,
      phoneNumber
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
        phoneNumber: user.phoneNumber,
        bloodGroup: user.bloodGroup,
        experience: user.experience,
        resume: user.resume,
        skills: user.skills,
        interests: user.interests,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
        phoneNumber: user.phoneNumber,
        bloodGroup: user.bloodGroup,
        experience: user.experience,
        resume: user.resume,
        skills: user.skills,
        interests: user.interests,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.location = req.body.location !== undefined ? req.body.location : user.location;
    user.phoneNumber = req.body.phoneNumber !== undefined ? req.body.phoneNumber : user.phoneNumber;
    user.bloodGroup = req.body.bloodGroup !== undefined ? req.body.bloodGroup : user.bloodGroup;
    user.experience = req.body.experience !== undefined ? req.body.experience : user.experience;
    user.resume = req.body.resume !== undefined ? req.body.resume : user.resume;

    if (req.body.skills !== undefined) user.skills = req.body.skills;
    if (req.body.interests !== undefined) user.interests = req.body.interests;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      token: generateToken(updatedUser._id),
      location: updatedUser.location,
      phoneNumber: updatedUser.phoneNumber,
      bloodGroup: updatedUser.bloodGroup,
      experience: updatedUser.experience,
      resume: updatedUser.resume,
      skills: updatedUser.skills,
      interests: updatedUser.interests
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
