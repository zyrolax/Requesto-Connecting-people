import mongoose from 'mongoose';

const email = 'raghavbest1mittal@gmail.com';

mongoose.connect('mongodb://localhost:27017/connect')
    .then(async () => {
        console.log('Connected to MongoDB');

        // Define schema inline to avoid importing from app
        const User = mongoose.model('User', new mongoose.Schema({
            email: String,
            role: String
        }));

        const res = await User.updateOne({ email }, { $set: { role: 'provider' } });

        if (res.matchedCount === 0) {
            console.log(`User ${email} not found.`);
            // Optional: Create if not exists for testing? 
            // Better to wait for user to login first. I'll log a warning.
            console.log('Note: User must have logged in at least once to be found.');
        } else {
            console.log(`Successfully promoted ${email} to provider.`);
        }

        await mongoose.disconnect();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
