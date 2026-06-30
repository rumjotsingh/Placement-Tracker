import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { ROLES } from '../constants/index.js';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: Object.values(ROLES), default: ROLES.STUDENT },
    rollNumber: { type: String, trim: true, sparse: true, unique: true },
    branch: { type: String, trim: true },
    graduationYear: { type: Number },
    isActive: { type: Boolean, default: true },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
  },
  { timestamps: true }
);

userSchema.index({ role: 1 });

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
