import mongoose, {Schema, models} from "mongoose"


const invoiceModal = new Schema({
    customer: {
        type: Object,
        required: true
    },
    amount: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        required: true,
        default: "Unpaid"
    },
    sent: {
        type: Number,
        default: 0,
        required: true
    }
},{
    timestamps: true
});



export const invoice = models?.Invoice || mongoose.model("Invoice", invoiceModal)