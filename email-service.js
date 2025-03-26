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
    return now.toLocaleString('he-IL', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }).replace(/\./g, '-');
}

// אתחול EmailJS
(function initEmailJS() {
    emailjs.init(emailjsConfig.PUBLIC_KEY);
    console.log("EmailJS initialized successfully");
})();

// פונקציה שמופעלת בעת התחברות
async function onLoginDetected(user) {
    try {
        console.log("Attempting to send login email to:", user.email);

        const emailData = {
            to_email: user.email,
            name: user.displayName || 'משתמש יקר',
            local_time: getCurrentDateTime(),
            user_login: user.email.split('@')[0],
            device_info: navigator.userAgent
        };

        const response = await emailjs.send(emailjsConfig.SERVICE_ID, emailjsConfig.LOGIN_TEMPLATE, emailData);
        console.log("Login email sent successfully:", response);
        return response;
    } catch (error) {
        console.error("Failed to send login email:", error);
        // לא נזרוק את השגיאה כדי שהתהליך ימשיך
    }
}

// פונקציה שמופעלת בעת ביצוע עסקה
async function onTransactionDetected(user, transactionDetails) {
    try {
        console.log("Attempting to send transaction email to:", user.email);

        const emailData = {
            to_email: user.email,
            name: user.displayName || 'משתמש יקר',
            local_time: getCurrentDateTime(),
            user_login: user.email.split('@')[0],
            amount: transactionDetails.amount,
            description: transactionDetails.description || 'ללא תיאור',
            new_balance: transactionDetails.newBalance,
            transaction_type: transactionDetails.type === 'income' ? 'הכנסה' : 'הוצאה'
        };

        const response = await emailjs.send(emailjsConfig.SERVICE_ID, emailjsConfig.TRANSACTION_TEMPLATE, emailData);
        console.log("Transaction email sent successfully:", response);
        return response;
    } catch (error) {
        console.error("Failed to send transaction email:", error);
        // לא נזרוק את השגיאה כדי שהתהליך ימשיך
    }
}

// חשוב - מייצא את הפונקציות לחלון הגלובלי
window.onLoginDetected = onLoginDetected;
window.onTransactionDetected = onTransactionDetected;
