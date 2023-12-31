import express, { Request, Response }  from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import  'express-async-errors'
import morgan from 'morgan'
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimiter from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import {v2 as cloudinary} from 'cloudinary';

// middleware
import { errorHandlerMiddleware, notFoundMiddleware, authenticateUser } from './middlewares'

// DB
import connectDB from './db/connect';

// routes
import { authenticationRouter, userRouter, productRouter, reviewRouter, orderRouter, flashSalesRouter } from './routes'

const app = express();
dotenv.config();

// cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

if(process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'))
}

const corsOptions = {
    origin: process.env.CORSORIGIN,
    credentials: true,
};

app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, //15 mins
    max: 100,
  })
);
app.use(cors(corsOptions));
app.use(express.json());
app.use(fileUpload({ useTempFiles: true })); //useTempFiles allow to use req.files.image.tempFilePath in controller
app.use(helmet());
app.use(mongoSanitize());
app.use(cookieParser(process.env.JWT_SECRET));

app.get('/', (req: Request, res: Response) => res.send('<h3> Insight Nest! </h3>'))

app.use('/api/v1/auth', authenticationRouter)
app.use('/api/v1/user', authenticateUser, userRouter)
app.use('/api/v1/product', productRouter)
app.use('/api/v1/review', reviewRouter)
app.use('/api/v1/order', authenticateUser, orderRouter)
app.use('/api/v1/flash-sales', flashSalesRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL!);
        app.listen(port, () => {
            console.log(`⚡️ Server is listening on port ${port}...`)
        })
    } catch (error) {
        console.log(error);
    }
}

start()