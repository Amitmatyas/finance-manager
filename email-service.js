// הגדרות EmailJS
const emailjsConfig = {
    PUBLIC_KEY: "PsDDfAH8bMiKGAGM2",  // שים את ה-Public Key שלך כאן
    SERVICE_ID: "service_hz4dvn9",     // שים את ה-Service ID שלך כאן
    LOGIN_TEMPLATE: "template_login",
    TRANSACTION_TEMPLATE: "template_transaction"
};

// אתחול EmailJS
emailjs.init(emailjsConfig.PUBLIC_KEY);

// פונקציה שמופעלת בעת התחברות
function onLoginDetected() {
    const emailData = {
        to_email: "financemanager.amitmatyas@gmail.com",
        name: "משתמש",
        local_time: "2025-03-26 20:12:13",
        user_login: "Amitmatyas",
        device_info: navigator.userAgent
    };

    emailjs.send(emailjsConfig.SERVICE_ID, emailjsConfig.LOGIN_TEMPLATE, emailData)
        .then(() => console.log("נשלח מייל התחברות"))
        .catch(error => console.error("שגיאה:", error));
}

// פונקציה שמופעלת בעת ביצוע עסקה
function onTransactionDetected(amount, description, balance, isIncome) {
    const emailData = {
        to_email: "financemanager.amitmatyas@gmail.com",
        name: "משתמש",
        local_time: "2025-03-26 20:12:13",
        user_login: "Amitmatyas",
        amount: amount,
        description: description,
        new_balance: balance,
        isIncome: isIncome
    };

    emailjs.send(emailjsConfig.SERVICE_ID, emailjsConfig.TRANSACTION_TEMPLATE, emailData)
        .then(() => console.log("נשלח מייל עסקה"))
        .catch(error => console.error("שגיאה:", error));
}
