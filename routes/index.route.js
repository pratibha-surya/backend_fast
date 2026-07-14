import express from "express"
import authRouter from "./auth.routes.js"
import userRouter from "./user.routes.js"
import categoryRouter from "./category.routes.js"
import subcategoryRouter from "./subcategory.routes.js"
import brandRouter from "./brand.routes.js"
import productRouter from "./product.routes.js"
import cartRouter from "./cart.routes.js"
import addressRouter from "./address.route.js"
import wishlistRouter from "./wishlist.route.js"
import couponRoute from "./coupon.routes.js"
import orderRouter from "./order.route.js"
import paymentRoute from "./payment.route.js"
import reviewRoute from "./review.routes.js"
import attributeRoute from "./attribute.routes.js"
import invoiceRoute from "./invoice.route.js"
import dashboardRoute from "./dashboard.route.js"
import notificationRoute from "./notification.route.js"
import bannerRoute from "./banner.route.js"
import offerRoute from "./offer.route.js"

 const app=express()
 app.use(express.json())
  app.use("/auth",authRouter)
  app.use("/user", userRouter)
  app.use("/categories",categoryRouter)
  app.use("/subcategory", subcategoryRouter)
  app.use("/brands", brandRouter)
  app.use("/products", productRouter)
  app.use("/carts", cartRouter)
  app.use("/address", addressRouter)
  app.use("/wishlists", wishlistRouter)
  app.use("/coupons", couponRoute)
  app.use("/orders",orderRouter)
  app.use("/payments", paymentRoute)
  app.use("/review", reviewRoute)
  app.use ("/attribute", attributeRoute)
  app.use("/invoice",invoiceRoute)
  app.use("/dashboard", dashboardRoute)
  app.use("/notification", notificationRoute)
  app.use("/banner", bannerRoute)
  app.use("/offers", offerRoute)
   
     export default app