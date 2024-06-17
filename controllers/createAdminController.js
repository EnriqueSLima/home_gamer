module.exports = {

  createAdminUser: async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please fill all fields' });
    }

    const user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ error: 'A user account already exists with this email' });
    }

    try {
      await User.create({ name, email, password: bcrypt.hashSync(password, 8), role: 'admin' });
      res.status(201).json({ message: 'Admin user created successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error creating admin user' });
    }
  },
};
