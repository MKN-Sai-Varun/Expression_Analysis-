import mongoose from 'mongoose'; // Importing mongoose
import bcrypt from 'bcryptjs';   // Importing bcrypt for encrypting the entrered password

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['admin', 'kid'] },  // Creating a user schema consisting of Usename,Pass,role
});



const User = mongoose.model('User', UserSchema); // Creating the schema
export default User; // Exporting