// קונפיגורציה של EmailJS
const emailjsConfig = {
    PUBLIC_KEY: "PsDDfAH8bMiKGAGM2",
    SERVICE_ID: "service_hz4dvn9",
    LOGIN_TEMPLATE: "template_login",
    TRANSACTION_TEMPLATE: "template_transaction"
};

// פונקציה שמחזירה את התאריך והשעה הנוכחיים בפורמט הרצוי
function getCurrentDateTime() {
    const now = new Date();
    return now.toISOString().slice(0, 19).replace('T', ' ');
}

// הגדרות קבועות - עכשיו דינמיות
const SYSTEM_CONFIG = {
    get CURRENT_TIME() {
        return getCurrentDateTime();
    },
    USER_LOGIN: "Amitmatyas"
};

// אתחול EmailJS
(function initEmailJS() {
    emailjs.init(emailjsConfig.PUBLIC_KEY);
    console.log("EmailJS initialized successfully");
})();

// פונקציה שמופעלת בעת התחברות
function onLoginDetected(user) {
    console.log("Attempting to send login email to:", user.email);

    const emailData = {
        to_email: user.email,
        name: user.displayName || 'משתמש יקר',
        local_time: SYSTEM_CONFIG.CURRENT_TIME,
        user_login: SYSTEM_CONFIG.USER_LOGIN,
        device_info: navigator.userAgent
    };

    return emailjs.send(emailjsConfig.SERVICE_ID, emailjsConfig.LOGIN_TEMPLATE, emailData)
        .then(function(response) {
            console.log("Login email sent successfully:", response);
        })
        .catch(function(error) {
            console.error("Failed to send login email:", error);
            throw error;
        });
}

// פונקציה שמופעלת בעת ביצוע עסקה
function onTransactionDetected(user, transactionDetails) {
    console.log("Attempting to send transaction email to:", user.email);

    const emailData = {
        to_email: user.email,
        name: user.displayName || 'משתמש יקר',
        local_time: SYSTEM_CONFIG.CURRENT_TIME,
        user_login: SYSTEM_CONFIG.USER_LOGIN,
        amount: transactionDetails.amount,
        description: transactionDetails.description || '',
        new_balance: transactionDetails.newBalance,
        isIncome: transactionDetails.type === 'income'
    };

    return emailjs.send(emailjsConfig.SERVICE_ID, emailjsConfig.TRANSACTION_TEMPLATE, emailData)
        .then(function(response) {
            console.log("Transaction email sent successfully:", response);
        })
        .catch(function(error) {
            console.error("Failed to send transaction email:", error);
            throw error;
        });
}

// חשוב - מייצא את הפונקציות לחלון הגלובלי
window.onLoginDetected = onLoginDetected;
window.onTrans
