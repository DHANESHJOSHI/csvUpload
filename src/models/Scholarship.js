import mongoose from 'mongoose';

const InstallmentSchema = new mongoose.Schema(
  {
    installmentNumber: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending',
    },
    dateCompleted: { type: Date, default: null },
    amount: { type: Number, default: 0 },
  },
  { _id: false } // No need for each installment to have its own unique ID
);

const ScholarshipSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    contactNumber: { type: String, required: true },
    age: { type: Number, required: true },
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
    category: { type: String, required: true },
    pwdPercentage: { type: Number, default: 0 }, // PWD percentage
    isMinority: { type: Boolean, default: false },
    guardianOccupation: { type: String, required: true },
    familyAnnualIncome: { type: Number, required: true },
    tenthGradePercentage: { type: Number, required: true },
    twelfthGradePercentage: { type: Number, required: true },
    graduationPercentage: { type: Number, required: true },
    fieldOfStudy: { type: String, required: true },
    postGraduationCompleted: { type: Boolean, required: true },
    cseAttempts: { type: Number, required: true },
    selectedForUPSCMains: { type: Boolean, default: false },
    selectedForUPSCInterviews: { type: Boolean, default: false },
    scholarshipID: { type: String, required: true },
    scholarshipAwarded: { type: Boolean, default: false },
    totalAmount: { type: Number, default: 0 },
    amountDisbursed: { type: Number, default: 0 },
    disbursementDate: { type: Date, default: null },
    installments: [InstallmentSchema], // Array to store installments
    natureOfCoaching: { type: String, required: true },
    coachingState: { type: String, required: true },
    coachingName: { type: String, required: true },
    psychometricReport: { type: String, required: true },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Create the Scholarship model
const Scholarship = mongoose.models.Scholarship || mongoose.model('Scholarship', ScholarshipSchema);

export default Scholarship;
