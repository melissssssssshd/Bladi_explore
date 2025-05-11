import mongoose, { Schema } from "mongoose";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  verificationCode: string;
  isVerified: boolean;
  verificationCodeExpiration: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  verificationCode: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationCodeExpiration: {
    type: Date,
  },
}, {
  timestamps: true,
});

userSchema.pre("save", async function (this: any, next) {
  // Les champs de vérification ne sont plus automatiquement générés
  // Ils seront gérés lors de l'inscription via l'endpoint
  
  // Mettre à jour les champs en minuscules pour le prénom et le nom
  this.firstName = this.firstName.toLowerCase()
  this.lastName = this.lastName.toLowerCase()
  
  this.updatedAt = new Date();
  next();
});

export const User = mongoose.models.User || mongoose.model("User", userSchema);
