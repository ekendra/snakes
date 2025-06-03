// pi-integration.js

// Initialize the Pi SDK
Pi.init({ version: "2.0", sandbox: true }); // Set sandbox to false for production

// Authenticate the user
const scopes = ['payments'];
function onIncompletePaymentFound(payment) {
  // Handle incomplete payments here
  console.log("Incomplete payment found:", payment);
}

Pi.authenticate(scopes, onIncompletePaymentFound)
  .then(function(auth) {
    console.log("Authenticated user:", auth.user.uid);
    // You can now enable Pi payment features
  })
  .catch(function(error) {
    console.error("Authentication failed:", error);
  });

// Example function to request a payment
function requestPayment(amount, memo, metadata) {
  Pi.createPayment(
    {
      amount: amount,
      memo: memo,
      metadata: metadata,
    },
    {
      onReadyForServerApproval: function(paymentId) {
        // Send paymentId to your server to approve the payment
        console.log("Payment ready for server approval:", paymentId);
      },
      onReadyForServerCompletion: function(paymentId, txid) {
        // Send paymentId and txid to your server to complete the payment
        console.log("Payment ready for server completion:", paymentId, txid);
      },
      onCancel: function(paymentId) {
        // Handle payment cancellation
        console.log("Payment cancelled:", paymentId);
      },
      onError: function(error, payment) {
        // Handle payment error
        console.error("Payment error:", error, payment);
      },
    }
  );
}
