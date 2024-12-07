import mongoose from 'mongoose'; // Importing mongoose
import bcrypt from 'bcryptjs';   // Importing bcrypt for encrypting the entrered password

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['admin', 'kid'] },  // Creating a user schema consisting of Usename,Pass,role
});

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10); // Encrypts the password and saves it
    next();
});

const User = mongoose.model('User', UserSchema); // Creating the schema
export default User; // Exporting