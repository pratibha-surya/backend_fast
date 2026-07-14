import PDFDocument from "pdfkit";

import Order from "../models/Order.js";

import ApiError from "../utils/ApiError.js";

export const generateInvoice = async (
  userId,
  orderId,
  role,
  res
) => {

  const query = { _id: orderId };
  if (role !== "admin") {
    query.user = userId;
  }

  const order = await Order.findOne(query)

    .populate("user")
    .populate("address")
    .populate("coupon")
    .populate("items.product");

  if (!order) {
    throw new ApiError(
      404,
      "Order not found"
    );
  }

  const doc = new PDFDocument({
    margin: 50,
  });

  res.setHeader(
    "Content-Type",
    "application/pdf"
  );

  res.setHeader(
    "Content-Disposition",
    `attachment; filename=invoice-${order.orderNumber}.pdf`
  );

  doc.pipe(res);

  /*
  ----------------------------------------
  Company
  ----------------------------------------
  */

  doc
    .fontSize(24)
    .text("YOUR STORE", {
      align: "center",
    });

  doc.moveDown();

  doc.fontSize(12);

  doc.text(`Invoice : ${order.orderNumber}`);

  doc.text(
    `Date : ${order.createdAt.toDateString()}`
  );

  doc.moveDown();

  /*
  ----------------------------------------
  Customer
  ----------------------------------------
  */

  doc.fontSize(18).text("Customer");

  doc.moveDown(0.5);

  doc.text(order.address.fullName);

  doc.text(order.address.mobile);

  doc.text(order.address.addressLine1);

  doc.text(order.address.city);

  doc.text(order.address.state);

  doc.text(order.address.country);

  doc.moveDown();

  /*
  ----------------------------------------
  Products
  ----------------------------------------
  */

  doc.fontSize(18).text("Products");

  doc.moveDown();

  order.items.forEach((item) => {

    doc.text(item.name);

    doc.text(
      `Qty : ${item.quantity}`
    );

    doc.text(
      `Price : ₹${item.price}`
    );

    doc.text(
      `Total : ₹${item.total}`
    );

    doc.moveDown();

  });

  /*
  ----------------------------------------
  Summary
  ----------------------------------------
  */

  doc.fontSize(18).text("Summary");

  doc.moveDown();

  doc.text(
    `Subtotal : ₹${order.subTotal}`
  );

  doc.text(
    `Discount : ₹${order.discount}`
  );

  doc.text(
    `Tax : ₹${order.tax}`
  );

  doc.text(
    `Shipping : ₹${order.shippingCharge}`
  );

  doc.moveDown();

  doc.fontSize(16);

  doc.text(
    `Grand Total : ₹${order.grandTotal}`
  );

  doc.moveDown();

  doc.text(
    `Payment : ${order.paymentStatus}`
  );

  doc.moveDown(2);

  doc.text(
    "Thank you for shopping ❤️",
    {
      align: "center",
    }
  );

  doc.end();

};