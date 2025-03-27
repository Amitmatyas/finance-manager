// קונפיגורציה של EmailJS
const emailjsConfig = {
    PUBLIC_KEY: "PsDDfAH8bMiKGAGM2",
    SERVICE_ID: "service_hz4dvn9",
    LOGIN_TEMPLATE: "template_login",
    TRANSACTION_TEMPLATE: "template_transaction"
};

// פונקציה לאימות כתובת מייל
function isValidEmail(email) {
    // בדיקה יותר מדויקת של כתובת מייל
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return email && typeof email === 'string' && emailRegex.test(email.trim());
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
async function sendEmailWithDetailedLogging(userData, templateId, additionalData = {}) {
    // בדיקת תקינות האימייל
    if (!userData || !isValidEmail(userData.email)) {
        console.error(`שגיאה: כתובת המייל ${userData.email} אינה תקינה`);
        return false;
    }

    try {
        // הכנת נתוני המייל
        const emailData = {
            to_email: userData.email.trim(),
            from_name: "Finance Manager",
            display_name: userData.displayName || userData.username,
            user_login: userData.username || userData.email.split('@')[0],
            local_time: getCurrentDateTime(),
            ...additionalData
        };
        console.log("מנסה לשלוח מייל עם הנתונים:", emailData);

        // וודא שספריית EmailJS נטענה
        if (typeof emailjs === 'undefined') {
            console.error("שגיאה: EmailJS לא נטען. וודא שהסקריפט נכלל בעמוד");
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
async function onLoginDetected(userData) {
    return sendEmailWithDetailedLogging(
        userData, 
        emailjsConfig.LOGIN_TEMPLATE
    );
}

async function onTransactionDetected(userData, transactionDetails) {
    return sendEmailWithDetailedLogging(
        userData, 
        emailjsConfig.TRANSACTION_TEMPLATE, 
        {
            amount: transactionDetails.amount,
            description: transactionDetails.description || 'ללא תיאור',
            new_balance: transactionDetails.newBalance,
            transaction_type: transactionDetails.type === 'income' ? 'הכנסה' : 'הוצאה'
        }
    );
}

// אתחול EmailJS 
function initEmailJS() {
    if (typeof emailjs !== 'undefined') {
        try {
            emailjs.init(emailjsConfig.PUBLIC_KEY);
            console.log("EmailJS אותחל בהצלחה");
        } catch (error) {
            console.error("שגיאה באתחול EmailJS:", error);
        }
    } else {
        console.error("סקריפט EmailJS לא נטען. אנא וודא שהסקריפט מוכלל בעמוד HTML");
    }
}

// קרא לפונקציית האתחול
initEmailJS();

// ייצוא הפונקציות
window.onLoginDetected = onLoginDetected;
window.onTransactionDetected = onTransactionDetected;
