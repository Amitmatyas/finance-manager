// קונפיגורציה של EmailJS
const emailjsConfig = {
    PUBLIC_KEY: "PsDDfAH8bMiKGAGM2",  // המפתח שלך
    SERVICE_ID: "service_hz4dvn9",     // מזהה השירות שלך
    LOGIN_TEMPLATE: "template_login",   // שם תבנית התחברות
    TRANSACTION_TEMPLATE: "template_transaction"  // שם תבנית עסקה
};

// הפונקציה שמאתחלת את EmailJS
(function initEmailJS() {
    emailjs.init(emailjsConfig.PUBLIC_KEY);
    console.log("EmailJS initialized successfully");
})();

// פונקציה שמופעלת בעת התחברות
function onLoginDetected(user) {
    console.log("Sending login email to:", user.email);  // לוג לבדיקה

    const emailData = {
        to_email: user.email,
        name: user.displayName || 'משתמש יקר',
        local_time: "2025-03-26 20:38:25",
        user_login: "Amitmatyas",
        device_info: navigator.userAgent
    };

    emailjs.send(emailjsConfig.SERVICE_ID, emailjsConfig.LOGIN_TEMPLATE, emailData)
        .then(function(response) {
            console.log("Email sent successfully:", response);
        })
        .catch(function(error) {
            console.error("Email sending failed:", error);
        });
}

// פונקציה שמופעלת בעת ביצוע עסקה
function onTransactionDetected(user, transactionDetails) {
    console.log("Sending transaction email to:", user.email);  // לוג לבדיקה

    const emailData = {
        to_email: user.email,
        name: user.displayName || 'משתמש יקר',
        local_time: "2025-03-26 20:38:25",
        user_login: "Amitmatyas",
        amount: transactionDetails.amount,
        description: transactionDetails.description,
        new_balance: transactionDetails.newBalance,
        isIncome: transactionDetails.type === 'income'
    };

    emailjs.send(emailjsConfig.SERVICE_ID, emailjsConfig.TRANSACTION_TEMPLATE, emailData)
        .then(function(response) {
            console.log("Email sent successfully:", response);
        })
        .catch(function(error) {
            console.error("Email sending failed:", error);
        });
}

// חשוב - מייצא את הפונקציות לחלון הגלובלי
window.onLoginDetected = onLoginDetected;
window.onTransactionDetected = onTransactionDetected;
