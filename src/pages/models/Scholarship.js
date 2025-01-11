import mongoose from 'mongoose';

const ScholarshipSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, required: true, default: 'pending' },

});

const Scholarship = mongoose.models.Scholarship || mongoose.model('Scholarship', ScholarshipSchema);

export default Scholarship;
