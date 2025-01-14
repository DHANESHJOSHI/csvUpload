// import mongoose from 'mongoose';

// const ScholarshipSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     email: { type: String, required: true },
//     status: { type: String, required: true, default: 'pending' },
//     scholarshipName: { type: String, required: true },
//     gender: { type: String, required: true },
// });

// const Scholarship = mongoose.models.Scholarship || mongoose.model('Scholarship', ScholarshipSchema);

// export default Scholarship;

// trash code
// analytics: {
//     totalApplications: { type: Number, default: 0 },
//     maleApplications: { type: Number, default: 0 },
//     femaleApplications: { type: Number, default: 0 },
//     otherGenderApplications: { type: Number, default: 0 },
//     statusCount: {
//       selected: { type: Number, default: 0 },
//       notSelected: { type: Number, default: 0 },
//     },
//   },


import mongoose from 'mongoose';

const ScholarshipSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    status: {
      type: String,
      enum: ['Selected', 'Not Selected'], 
      default: 'Not Selected',
      required: true,
    },
    scholarshipName: { type: String, required: true },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'], 
      required: true,
    },
    state: { type: String, required: true },
  },
  {
    timestamps: true, 
  }
);

const Scholarship =
  mongoose.models.Scholarship || mongoose.model('Scholarship', ScholarshipSchema);

export default Scholarship;
