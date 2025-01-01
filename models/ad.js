import e from "express";
import mongoose from "mongoose";
const { Schema, ObjectId, model } = mongoose;

const adSchema = new Schema(
  {
    photos: [{}],
    price: {
      type: String,
      maxLength: 255,
      index: true,
    },
    address: {
      type: String,
      maxLength: 255,
      index: true,
    },
    propertyType: {
      type: String,
      default: "House",
      enum: ["House", "Apartment", "Land", "Townhouse"],
    },
    bedrooms: Number,
    bathrooms: Number,
    landsize: Number,
    landsizetype: String,
    carpark: Number,
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    googleMaps: {},
    title: {
      type: String,
      maxLength: 255,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
      lowercase: true,
    },
    description: {},
    features: {},
    nearby: {},
    postedBy: { type: ObjectId, ref: "User" },
    published: {
      type: Boolean,
      default: true,
    },
    action: {
      type: String,
      default: "Sell",
      enum: ["Sell", "Rent"],
    },
    views: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      default: "In market",
      enum: [
        "In market",
        "Deposit taken",
        "Under offer",
        "Contact agent",
        "Sold",
        "Rented",
        "Off market",
      ],
    },
    inspectionTime: {},
  },
  { timestamps: true }
);

adSchema.index({ location: "2dsphere" });
export default model("Ad", adSchema);
