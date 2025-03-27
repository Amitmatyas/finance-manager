// קונפיגורציה של EmailJS
const emailjsConfig = {
    PUBLIC_KEY: "PsDDfAH8bMiKGAGM2",
    SERVICE_ID: "service_hz4dvn9",
    LOGIN_TEMPLATE: "template_login",
    TRANSACTION_TEMPLATE: "template_transaction"
};

// פונקציה לאימות כתובת מייל
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// פונקציה שמחזירה את התאריך והשעה הנוכחיים בפורמט הרצוי
function getCurrentDateTime() {
    const now = new Date();
    // הוספת שעתיים לזמן UTC כדי לקבל את הזמן בישראל
    now.setHours(now.getHours() + 2);
    
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
async function onLoginDetected(email) {
    try {
        // בדיקת תקינות כתובת המייל
        if (!email || !isValidEmail(email)) {
            console.error("Invalid or missing email address");
            return false;
        }

        // קבלת כתובת IP של המשתמש
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();

        const emailData = {
            to_name: email,
            from_name: "Finance Manager",
            user_login: email.split('@')[0],
            local_time: getCurrentDateTime(),
            device_info: navigator.userAgent,
            ip_address: ipData.ip
        };

        console.log("Sending login email with data:", emailData);
        
        try {
            const response = await emailjs.send(
                emailjsConfig.SERVICE_ID,
                emailjsConfig.LOGIN_TEMPLATE,
                emailData
            );
            console.log("Login email sent successfully:", response);
            return true;
        } catch (emailError) {
            console.error("Detailed EmailJS error:", emailError);
            return false;
        }
    } catch (error) {
        console.error("Failed to send login email:", error);
        return false;
    }
}

// פונקציה לשליחת מייל בעת ביצוע עסקה
async function onTransactionDetected(email, transactionDetails) {
    try {
        // בדיקת תקינות כתובת המייל
        if (!email || !isValidEmail(email)) {
            console.error("Invalid or missing email address");
            return false;
        }

        const emailData = {
            to_name: email,
            from_name: "Finance Manager",
            user_login: email.split('@')[0],
            local_time: getCurrentDateTime(),
            amount: transactionDetails.amount,
            description: transactionDetails.description || 'ללא תיאור',
            new_balance: transactionDetails.newBalance,
            transaction_type: transactionDetails.type === 'income' ? 'הכנסה' : 'הוצאה'
        };

        console.log("Sending transaction email with data:", emailData);
        
        try {
            const response = await emailjs.send(
                emailjsConfig.SERVICE_ID,
                emailjsConfig.TRANSACTION_TEMPLATE,
                emailData
            );
            console.log("Transaction email sent successfully:", response);
            return true;
        } catch (emailError) {
            console.error("Detailed EmailJS error:", emailError);
            return false;
        }
    } catch (error) {
        console.error("Failed to send transaction email:", error);
        return false;
    }
}

// ייצוא הפונקציות
window.onLoginDetected = onLoginDetected;
window.onTransactionDetected = onTransactionDetected;
