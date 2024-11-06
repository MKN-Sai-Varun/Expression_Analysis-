router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        
        const user = await User.findOne({ username });
        if (!user) {
            console.log('User not found:', username);
            return res.status(400).json({ message: "Invalid username" });
        }

        console.log('User found:', user);

        
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match:', isMatch); 

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

      
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, message: "Login successful" });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: "Server error" });
}
});
