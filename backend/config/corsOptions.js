const corsOptions = {
    origin: (origin, callback) => {
        if (process.env.ALLOWED_URL || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
}

export default corsOptions;