const mongoose = require("mongoose");

const itemSchema = mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  Quantity: {
    type: Number,
    required: true,
    default: 0,
  },
  MarketPrice: {
    type: Number,
    required: true,
  },
  SellerValue: {
    type: Number,
    required: true,
  },
  AllianceValue: {
    type: Number,
    required: true,
  },
  ItemPhoto: {
    data: Buffer,
    contentType: String,
  },
});

itemSchema.pre("save", (next) => {
  this.SellerValue = this.MarketPrice * 0.8;
  this.AllianceValue = this.MarketPrice * 0.838;
  next();
});

module.exports = mongoose.model("Items", itemSchema);
