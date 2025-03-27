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
    // הוספת שעתיים לזמן UTC כדי לקבל את הזמן בישראל
    now.setHours(now.getHours() + 2);
    
    // פורמט התאריך לפי YYYY-MM-DD HH:MM:SS
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const day = String(now.getUTCDate()).padStart(2, '0');
    const hours = String(now.getUTCHours()).padStart(2, '0');
    const minutes = String(now.getUTCMinutes()).padStart(2, '0');
    const seconds = String(now.getUTCSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// אתחול EmailJS
(function initEmailJS() {
    emailjs.init(emailjsConfig.PUBLIC_KEY);
    console.log("EmailJS initialized successfully");
})();

// פונקציה לשליחת מייל בעת התחברות
async function onLoginDetected(user) {
    try {
        // קבלת כתובת IP של המשתמש
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();

        const emailData = {
            to_name: user.email,
            from_name: "Finance Manager",
            name: user.displayName || 'משתמש יקר',
            local_time: getCurrentDateTime(), // זמן דינמי!
            user_login: user.email.split('@')[0], // שם משתמש דינמי!
            device_info: navigator.userAgent,
            ip_address: ipData.ip
        };

        console.log("Sending login email with data:", emailData);

        const response = await emailjs.send(
            emailjsConfig.SERVICE_ID,
            emailjsConfig.LOGIN_TEMPLATE,
            emailData
        );
        console.log("Login email sent successfully:", response);
        return true;
    } catch (error) {
        console.error("Failed to send login email:", error);
        return false;
    }
}

// פונקציה לשליחת מייל בעת ביצוע עסקה
async function onTransactionDetected(user, transactionDetails) {
    try {
        const emailData = {
            to_name: user.email,
            from_name: "Finance Manager",
            name: user.displayName || 'משתמש יקר',
            local_time: getCurrentDateTime(), // זמן דינמי!
            user_login: user.email.split('@')[0], // שם משתמש דינמי!
            amount: transactionDetails.amount,
            description: transactionDetails.description || 'ללא תיאור',
            new_balance: transactionDetails.newBalance,
            transaction_type: transactionDetails.type === 'income' ? 'הכנסה' : 'הוצאה'
        };

        console.log("Sending transaction email with data:", emailData);

        const response = await emailjs.send(
            emailjsConfig.SERVICE_ID,
            emailjsConfig.TRANSACTION_TEMPLATE,
            emailData
        );
        console.log("Transaction email sent successfully:", response);
        return true;
    } catch (error) {
        console.error("Failed to send transaction email:", error);
        return false;
    }
}

// ייצוא הפונקציות
window.onLoginDetected = onLoginDetected;
window.onTransactionDetected = onTransactionDetected;
