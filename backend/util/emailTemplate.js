// utils/emailTemplates.js
const nodemailer = require("nodemailer");

// Create reusable transporter object
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "mr.bijaystha42@gmail.com",
    pass: "pqfygudcylmnntjg",
  },
});

// Template for order confirmation email
const orderConfirmationTemplate = (orderDetails) => {
  const addressHtml = orderDetails.shippingAddress
    ? `
      <div style="margin: 15px 0; padding: 15px; background: #f9f9f9; border-radius: 5px;">
        <h3 style="margin-top: 0; color: #444;">Shipping Address</h3>
        <p>${orderDetails.shippingAddress.address || "Not specified"},</p>
        <p>${orderDetails.shippingAddress.city || ""}, ${
        orderDetails.shippingAddress.postalCode || ""
      }</p>
        <p>${orderDetails.shippingAddress.country || ""}</p>
      </div>
    `
    : "<p>Shipping address not provided</p>";

  return `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <div style="background: #2a6496; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">Thank You For Your Order!</h1>
      </div>
      
      <div style="padding: 20px;">
        <p>Dear Customer,</p>
        <p>Your order has been received and is being processed. Here are your order details:</p>
        
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h2 style="margin-top: 0; color: #2a6496;">Order #${
            orderDetails._id
          }</h2>
          <p style="margin-bottom: 0;"><strong>Order Date:</strong> ${new Date(
            orderDetails.orderDate
          ).toLocaleDateString()}</p>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background-color: #2a6496; color: white;">
              <th style="padding: 10px; text-align: left;">Item</th>
              <th style="padding: 10px; text-align: center;">Qty</th>
              <th style="padding: 10px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${orderDetails.items
              .map(
                (item) => `
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px;">${item.name}</td>
                <td style="padding: 10px; text-align: center;">${
                  item.quantity
                }</td>
                <td style="padding: 10px; text-align: right;">Rs ${item.price.toFixed(
                  2
                )}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Subtotal:</td>
              <td style="padding: 10px; text-align: right;">Rs ${orderDetails.totalAmount.toFixed(
                2
              )}</td>
            </tr>
            <tr>
              <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Shipping:</td>
              <td style="padding: 10px; text-align: right;">Rs ${orderDetails.shippingFee.toFixed(
                2
              )}</td>
            </tr>
            <tr style="font-size: 1.1em;">
              <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Total:</td>
              <td style="padding: 10px; text-align: right; font-weight: bold;">Rs ${(
                orderDetails.totalAmount + orderDetails.shippingFee
              ).toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
        
        ${addressHtml}
        
        <div style="margin-top: 30px; padding: 15px; background: #f9f9f9; border-radius: 5px;">
          <h3 style="margin-top: 0; color: #444;">Next Steps</h3>
          <p>We'll send you another email when your order ships. You can also check your order status in your account dashboard.</p>
        </div>
        
        <p style="margin-top: 30px;">Thank you for shopping with us!</p>
        <p>The LinuBayo Team</p>
      </div>
      
      <div style="background: #f5f5f5; padding: 15px; text-align: center; font-size: 0.8em; color: #777;">
        <p>If you have any questions, please contact our support team at support@linubayo.com</p>
      </div>
    </div>
  `;
};

// Template for order status update email
const orderStatusUpdateTemplate = (order, status) => {
  return `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <div style="background: #2a6496; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">Order Status Update</h1>
      </div>
      
      <div style="padding: 20px;">
        <p>Dear Customer,</p>
        <p>The status of your order <strong>#${
          order._id
        }</strong> has been updated:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <div style="display: inline-block; padding: 15px 30px; background: #f5f5f5; border-radius: 5px;">
            <h2 style="margin: 0; color: #2a6496;">${status}</h2>
          </div>
        </div>
        
        <div style="margin-top: 30px; padding: 15px; background: #f9f9f9; border-radius: 5px;">
          <h3 style="margin-top: 0; color: #444;">Order Summary</h3>
          <p><strong>Order Date:</strong> ${new Date(
            order.orderDate
          ).toLocaleDateString()}</p>
          <p><strong>Total Amount:</strong> Rs ${order.totalAmount.toFixed(
            2
          )}</p>
        </div>
        
        <p style="margin-top: 30px;">You can view your order details and track its progress in your account dashboard.</p>
        
        <p>Thank you for shopping with us!</p>
        <p>The LinuBayo Team</p>
      </div>
      
      <div style="background: #f5f5f5; padding: 15px; text-align: center; font-size: 0.8em; color: #777;">
        <p>If you have any questions, please contact our support team at support@linubayo.com</p>
      </div>
    </div>
  `;
};

// Function to send order confirmation email
const sendOrderConfirmationEmail = async (userEmail, orderDetails) => {
  const mailOptions = {
    from: '"LinuBayo" <noreply@linubayo.com>',
    to: userEmail,
    subject: `Your Order #${orderDetails._id} Confirmation`,
    html: orderConfirmationTemplate(orderDetails),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Order confirmation email sent to ${userEmail}`);
  } catch (error) {
    console.error(`Error sending order confirmation email: ${error}`);
  }
};

// Function to send order status update email
const sendOrderStatusUpdateEmail = async (order, status) => {
  if (!order.user || !order.user.email) return;

  const mailOptions = {
    from: '"LinuBayo" <noreply@linubayo.com>',
    to: order.user.email,
    subject: `Order #${order._id} Status Update: ${status}`,
    html: orderStatusUpdateTemplate(order, status),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Status update email sent for order #${order._id}`);
  } catch (error) {
    console.error(`Error sending status update email: ${error}`);
  }
};

module.exports = {
  sendOrderConfirmationEmail,
  sendOrderStatusUpdateEmail,
};
