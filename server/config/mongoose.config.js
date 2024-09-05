const mongoose = require("mongoose")

const dbName = process.env.DB
mongoose.connect(`mongodb+srv://khushibathla91:qwertyuiop@cluster0.p7akh9s.mongodb.net/${dbName}`)
    .then(console.log(`Connected to MongoDB`))
    .catch(err => console.log('MongoDB connection error:', err))