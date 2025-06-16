

const getBookingApprovedEmail = (userName, itemName, bookingDate, isVenue) => {
  const itemType = isVenue ? 'venue' : 'service';
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #28a745;">Congratulations, ${userName}! 🎉</h2>
      <p>Your booking request for the ${itemType} <strong>${itemName}</strong> on <strong>${bookingDate}</strong> has been successfully <strong>Approved</strong>.</p>
      <p>We're excited to help you host your event!</p>
      <p>If you have any questions or need further assistance, please don't hesitate to contact us.</p>
      <p>Best regards,<br/>The Eventify Team</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="font-size: 0.8em; color: #777;">This is an automated email, please do not reply.</p>
    </div>
  `;
};

const getBookingRejectedEmail = (userName, itemName, bookingDate, isVenue) => {
  const itemType = isVenue ? 'venue' : 'service';
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #dc3545;">Dear ${userName}, 😔</h2>
      <p>We regret to inform you that your booking request for the ${itemType} <strong>${itemName}</strong> on <strong>${bookingDate}</strong> has been <strong>Rejected</strong>.</p>
      <p>This could be due to various reasons, such as unavailability on the requested date or other operational considerations. We apologize for any inconvenience this may cause.</p>
      <p>Please feel free to browse other available venues or services, or try a different date for your event.</p>
      <p>Thank you for your understanding.<br/>The Eventify Team</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="font-size: 0.8em; color: #777;">This is an automated email, please do not reply.</p>
    </div>
  `;
};


const getBookingConfirmedEmail = (userName, itemName, bookingDate, isVenue) => {
  const itemType = isVenue ? 'venue' : 'service';
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #007bff;">Your Booking for ${itemName} is Confirmed! ✅</h2>
      <p>Dear ${userName},</p>
      <p>This is a confirmation that your booking for the ${itemType} <strong>${itemName}</strong> on <strong>${bookingDate}</strong> is now <strong>Confirmed</strong>.</p>
      <p>All set for your event!</p>
      <p>If you have any questions, please contact the provider directly or reach out to us.</p>
      <p>Thank you for using Eventify!<br/>The Eventify Team</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="font-size: 0.8em; color: #777;">This is an automated email, please do not reply.</p>
    </div>
  `;
};

// Add email template for cancellation if you implement 'cancel' action in the future
const getBookingCancelledEmail = (userName, itemName, bookingDate, isVenue) => {
    const itemType = isVenue ? 'venue' : 'service';
    return `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #6c757d;">Your Booking for ${itemName} has been Cancelled.</h2>
        <p>Dear ${userName},</p>
        <p>We are writing to inform you that your booking for the ${itemType} <strong>${itemName}</strong> on <strong>${bookingDate}</strong> has been <strong>Cancelled</strong>.</p>
        <p>We apologize for any inconvenience this may cause.</p>
        <p>If you have any questions, please contact the provider directly or reach out to us.</p>
        <p>Thank you for your understanding.<br/>The Eventify Team</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 0.8em; color: #777;">This is an automated email, please do not reply.</p>
      </div>
    `;
  };


module.exports = {
  getBookingApprovedEmail,
  getBookingRejectedEmail,
  getBookingConfirmedEmail,
  getBookingCancelledEmail // Export the new cancellation template
};