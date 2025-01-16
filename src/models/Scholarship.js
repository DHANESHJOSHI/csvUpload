import mongoose from 'mongoose';

const InstallmentSchema = new mongoose.Schema(
  {
    installmentString: { type: String, required: false },
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending',
    },
    dateCompleted: { type: Date, default: null },
    amount: { type: String, default: 0 },
  },
  { _id: false } // No need for each installment to have its own unique ID
);

const ScholarshipSchema = new mongoose.Schema(
  {
    name: { type: String, required: false },
    email: { type: String, required: true },
    contactString: { type: String, required: false },
    age: { type: String, required: false },
    status: {
      type: String,
      enum: ['Selected', 'Not Selected'],
      default: 'Not Selected',
      required: false,
    },
    scholarshipName: { type: String, required: false },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: false,
    },
    state: { type: String, required: false },
    category: { type: String, required: false },
    pwdPercentage: { type: String, default: 0 }, // PWD percentage
    isMinority: { type: String, default: false },
    guardianOccupation: { type: String, required: false },
    familyAnnualIncome: { type: String, required: false },
    tenthGradePercentage: { type: String, required: false },
    twelfthGradePercentage: { type: String, required: false },
    graduationPercentage: { type: String, required: false },
    fieldOfStudy: { type: String, required: false },
    postGraduationCompleted: { type: String, required: false },
    cseAttempts: { type: String, required: false },
    selectedForUPSCMains: { type: String, default: false },
    selectedForUPSCInterviews: { type: String, default: false },
    scholarshipID: { type: String, required: false },
    scholarshipAwarded: { type: String, default: false },
    totalAmount: { type: String, default: 0 },
    amountDisbursed: { type: String, default: 0 },
    disbursementDate: { type: Date, default: null },
    installments: [InstallmentSchema], // Array to store installments
    natureOfCoaching: { type: String, required: false },
    coachingState: { type: String, required: false },
    coachingName: { type: String, required: false },
    psychometricReport: { type: String, required: false },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Create the Scholarship model
const Scholarship = mongoose.models.Scholarship || mongoose.model('Scholarship', ScholarshipSchema);

export default Scholarship;
