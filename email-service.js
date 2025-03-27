// קונפיגורציה של EmailJS
const emailjsConfig = {
    PUBLIC_KEY: "YOUR_PUBLIC_KEY", // החלף במפתח הציבורי שלך
    SERVICE_ID: "YOUR_SERVICE_ID", // החלף במזהה השירות שלך
    LOGIN_TEMPLATE: "template_login",
    TRANSACTION_TEMPLATE: "template_transaction"
};

// פונקציה לאימות כתובת מייל
function isValidEmail(email) {
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
    // הפקת האימייל
    const email = document.getElementById('userEmail').textContent; // שימוש בשורה מהHTML

    // בדיקת תקינות האימייל
    if (!isValidEmail(email)) {
        console.error(`שגיאה: כתובת המייל ${email} אינה תקינה`);
        return false;
    }

    try {
        // הכנת נתוני המייל
        const emailData = {
            to_email: email.trim(),
            from_name: "Finance Manager",
            display_name: email.split('@')[0],
            user_login: email.split('@')[0],
            local_time: getCurrentDateTime(),
            ...additionalData
        };

        console.log("מנסה לשלוח מייל עם הנתונים:", emailData);

        // וודא שספריית EmailJS נטענה
        if (typeof emailjs === 'undefined') {
            console.error("שגיאה: EmailJS לא נטען");
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
        console.error("שגיאה בשליחת המייל:", error);
        return false;
    }
}

// פונקציות עיקריות לשליחת מייל
async function onLoginDetected() {
    return sendEmailWithDetailedLogging(
        {}, 
        emailjsConfig.LOGIN_TEMPLATE
    );
}

async function onTransactionDetected(transactionDetails) {
    return sendEmailWithDetailedLogging(
        {}, 
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
    }
}

// קרא לפונקציית האתחול
initEmailJS();

// ייצוא הפונקציות
window.onLoginDetected = onLoginDetected;
window.onTransactionDetected = onTransactionDetected;
