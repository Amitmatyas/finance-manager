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
    now.setHours(now.getHours() + 2);
    
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const day = String(now.getUTCDate()).padStart(2, '0');
    const hours = String(now.getUTCHours()).padStart(2, '0');
    const minutes = String(now.getUTCMinutes()).padStart(2, '0');
    const seconds = String(now.getUTCSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// פונקציה לשליחת מייל עם דיבאג מפורט
async function sendEmailWithDetailedLogging(email, templateId, additionalData = {}) {
    // וודא שהפרמטרים תקינים
    if (!email || !isValidEmail(email)) {
        console.error("שגיאה: כתובת מייל לא תקינה");
        return false;
    }

    try {
        // קבלת כתובת IP (אופציונלי)
        let ipAddress = 'לא זוהה';
        try {
            const ipResponse = await fetch('https://api.ipify.org?format=json');
            const ipData = await ipResponse.json();
            ipAddress = ipData.ip;
        } catch (ipError) {
            console.warn("לא ניתן היה לקבל כתובת IP:", ipError);
        }

        // הכנת נתוני המייל
        const emailData = {
            to_email: email,
            from_name: "Finance Manager",
            user_login: email.split('@')[0],
            local_time: getCurrentDateTime(),
            device_info: navigator.userAgent,
            ip_address: ipAddress,
            ...additionalData  // הוספת נתונים נוספים אם יש
        };

        console.log("מנסה לשלוח מייל עם הנתונים הבאים:", emailData);

        // בדיקת אתחול EmailJS
        if (typeof emailjs === 'undefined') {
            console.error("שגיאה: EmailJS לא אותחל");
            return false;
        }

        // שליחת המייל
        const response = await emailjs.send(
            emailjsConfig.SERVICE_ID, 
            templateId, 
            emailData
        );

        console.log("המייל נשלח בהצלחה:", response);
        return true;

    } catch (error) {
        // טיפול מפורט בשגיאות
        console.error("שגיאה בשליחת המייל:", {
            message: error.message,
            name: error.name,
            status: error.status,
            text: error.text
        });
        return false;
    }
}

// פונקציות עיקריות לשליחת מייל
async function onLoginDetected(email) {
    return sendEmailWithDetailedLogging(
        email, 
        emailjsConfig.LOGIN_TEMPLATE
    );
}

async function onTransactionDetected(email, transactionDetails) {
    return sendEmailWithDetailedLogging(
        email, 
        emailjsConfig.TRANSACTION_TEMPLATE, 
        {
            amount: transactionDetails.amount,
            description: transactionDetails.description || 'ללא תיאור',
            new_balance: transactionDetails.newBalance,
            transaction_type: transactionDetails.type === 'income' ? 'הכנסה' : 'הוצאה'
        }
    );
}

// בדיקת אתחול EmailJS בעת טעינת העמוד
window.onload = function() {
    try {
        emailjs.init(emailjsConfig.PUBLIC_KEY);
        console.log("EmailJS אותחל בהצלחה");
    } catch (error) {
        console.error("שגיאה באתחול EmailJS:", error);
    }
};

// ייצוא הפונקציות
window.onLoginDetected = onLoginDetected;
window.onTransactionDetected = onTransactionDetected;
