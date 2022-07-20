const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please tell us your first name"],
    },
    lastName: {
      type: String,
      require: [true, "Please tell us your last name"],
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
    },
    phone: String,
    address: String,
    photoPublicId: String,
    photo: {
      type: String,
      default:
        "https://res.cloudinary.com/djwxy9aol/image/upload/v1651972394/fuixnwpb8lq78zazftsn.png",
    },
    identityCard: String,
    identityCardPublicId: String,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
      select: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    posted: {
      type: Number,
      default: 0,
    },
    sales: {
      type: Number,
      default: 0,
    },
    reports: {
      type: Number,
      default: 0,
    },
    referralCode: {
      type: String,
      default: "nill",
    },
    followers: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    emailConfirmToken: {
      type: Number,
      select: false,
    },
    passwordChangedAt: Date,
    passwordResetToken: Number,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//  virtural populate
// userSchema.virtual("wallet", {
//   ref: "Wallet",
//   foreignField: "userId",
//   localField: "_id",
// });

// userSchema.pre(/^find/, function (next) {
//   this.populate("wallet");
//   next();
// });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createEmailConfirmToken = function () {
  const confirmToken = Math.floor(100000 + Math.random() * 900000);
  this.emailConfirmToken = confirmToken;
  return confirmToken;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = Math.floor(100000 + Math.random() * 900000);
  this.passwordResetToken = resetToken;
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
