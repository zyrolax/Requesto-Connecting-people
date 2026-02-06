import mongoose from 'mongoose';

const email = 'raghav.mitt9@gmail.com';

mongoose.connect('mongodb://localhost:27017/connect')
    .then(async () => {
        console.log('Connected to MongoDB');

        const User = mongoose.model('User', new mongoose.Schema({
            email: String,
            role: String
        }));

        const res = await User.updateOne({ email }, { $set: { role: 'admin' } });

        if (res.matchedCount === 0) {
            console.log(`User ${email} not found.`);
        } else {
            console.log(`Successfully promoted ${email} to admin.`);
        }

        await mongoose.disconnect();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
