import { Schema, model  } from "mongoose";
import { FlashSalesModel } from '../types'

const FlashSalesSchema = new Schema<FlashSalesModel>({
    startDate:  {
        type: Date,
        required: [true, 'Please provide start date'],
    },
    endDate:  {
        type: Date,
        required: [true, 'Please provide end date'],
    }
});

export default model<FlashSalesModel>('FlashSales', FlashSalesSchema);