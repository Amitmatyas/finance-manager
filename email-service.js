// קונפיגורציה של EmailJS
const emailjsConfig = {
    PUBLIC_KEY: "PsDDfAH8bMiKGAGM2",
    SERVICE_ID: "service_hz4dvn9",
    LOGIN_TEMPLATE: "template_login",
    TRANSACTION_TEMPLATE: "template_transaction"
};

// פונקציה שמחזירה את התאריך והשעה הנוכחיים בפורמט מקומי
function getCurrentDateTime() {
    const now = new Date();
    return now.toLocaleString('he-IL', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'Asia/Jerusalem'
    }).replace(/\./g, '-').replace(',', '');
}

// אתחול EmailJS
(function initEmailJS() {
    emailjs.init(emailjsConfig.PUBLIC_KEY);
    console.log("EmailJS initialized successfully");
})();

// פונקציה לשליחת מייל בעת התחברות
async function onLoginDetected(user) {
    try {
        // בדיקה שיש מייל תקין
        if (!user?.email) {
            console.error("No valid email address provided");
            return false;
        }

        // קבלת כתובת IP של המשתמש
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();

        const emailData = {
            to_email: user.email,  // וודא שזה מגיע
            from_name: "Finance Manager",  // הוסף את זה
            name: user.displayName || user.email.split('@')[0] || 'משתמש יקר',
            local_time: getCurrentDateTime(),
            user_login: user.email.split('@')[0],
            device_info: navigator.userAgent,
            ip_address: ipData.ip
        };

        console.log("Sending login email to:", emailData.to_email);  // לוג לבדיקה

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
        // בדיקה שיש מייל תקין
        if (!user?.email) {
            console.error("No valid email address provided");
            return false;
        }

        const emailData = {
            to_email: user.email,  // וודא שזה מגיע
            from_name: "Finance Manager",  // הוסף את זה
            name: user.displayName || user.email.split('@')[0] || 'משתמש יקר',
            local_time: getCurrentDateTime(),
            user_login: user.email.split('@')[0],
            amount: transactionDetails.amount,
            description: transactionDetails.description || 'ללא תיאור',
            new_balance: transactionDetails.newBalance,
            transaction_type: transactionDetails.type === 'income' ? 'הכנסה' : 'הוצאה'
        };

        console.log("Sending transaction email to:", emailData.to_email);  // לוג לבדיקה

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
