import app from './app';
import connectDB from './infrastructure/database/mongodb';

const PORT = process.env.PORT || 5001;

// Connect to database before listening
connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
});
