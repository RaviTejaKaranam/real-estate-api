import express from "express";
import * as ad from "../controllers/ad.js";
import { requireSignIn, isAdmin } from "../middlewares/auth.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload-image", requireSignIn, upload.any(), ad.uploadImage);
router.delete("/remove-image", requireSignIn, ad.removeImage);
router.post("/create-ad", requireSignIn, ad.createAd);
router.get("/ad/:slug", ad.read);
router.get("/ads-for-sell/:page", ad.adsForSell);
router.get("/ads-for-rent/:page", ad.adsForRent);
router.put("/update-ad/:slug", ad.updateAd);
router.delete("/delete-ad/:slug", ad.deleteAd);
router.get("/user-ads/:page", requireSignIn, ad.userAds);
router.put("/update-ad-status/:slug", requireSignIn, ad.updateAdStatus);
router.post("/contact-agent", requireSignIn, ad.contactAgent);
router.get("/enquired-ads/:page", requireSignIn, ad.enquiredAds);
router.put("/toggle-wishlist/:adId", requireSignIn, ad.toggleWishlist);
router.get("/wishlist/:page", requireSignIn, ad.wishlist);
router.post("/search-ads", ad.searchAds);

// admin route
router.put(
  "/toggle-published/:adId",
  requireSignIn,
  isAdmin,
  ad.togglePublished
);

export default router;
