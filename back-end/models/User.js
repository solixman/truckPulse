const {Schema,model}=require('mongoose');

const ROLES = ['Driver','Admin'];

const userSchema= new Schema({
     name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ROLES, 
  },

  phone: {
    type: String,
  },

  address: {
    type: String,
  },

  avatar: {
    type: String,
    default: 'https://imgs.search.brave.com/jHDp_R14w-tbRDiYsyiOCGDeCSPE4WqsVfFwiXVDyow/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzExLzY4LzUwLzU3/LzM2MF9GXzExNjg1/MDU3OTRfSUJDRWlh/ZnNJckhGSjA5ZTY1/UDJ2aDUxMTVDMVhJ/N2UuanBn',
  },

  isActive: {
    type: Boolean,
    default: true,
  },

  dateOfBirth: {
    type: Date,
  },
  resetToken: {
    type: String,
  },

  refreshToken: {
    type: String,
  }

}, {timestamps: true });


module.exports=model('User',userSchema)