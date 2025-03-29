// קונפיגורציה של EmailJS
const emailjsConfig = {
    PUBLIC_KEY: "PsDDfAH8bMiKGAGM2",
    SERVICE_ID: "service_hz4dvn9",
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
    // כבר UTC, אין צורך בהזזה נוספת אם השרת של EmailJS מצפה ל-UTC
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const day = String(now.getUTCDate()).padStart(2, '0');
    const hours = String(now.getUTCHours()).padStart(2, '0');
    const minutes = String(now.getUTCMinutes()).padStart(2, '0');
    const seconds = String(now.getUTCSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// פונקציה לשליחת מייל עם דיבאג מפורט
async function sendEmailWithDetailedLogging(userEmail, templateId, additionalData = {}) {
    // בדיקות תקינות
    if (!userEmail || userEmail.trim() === '') {
        console.error('שגיאה: כתובת המייל ריקה');
        return false;
    }

    if (!isValidEmail(userEmail)) {
        console.error(`שגיאה: כתובת המייל ${userEmail} אינה תקינה`);
        return false;
    }

    try {
        // הכנת נתוני המייל
        const emailData = {
            to_email: userEmail.trim(),
            from_name: "Finance Manager",
            display_name: userEmail.split('@')[0],
            user_login: userEmail.split('@')[0],
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
    // קבל את האימייל מהמשתנה הגלובלי currentUser
    if (window.currentUser && window.currentUser.email) {
        return sendEmailWithDetailedLogging(
            window.currentUser.email,
            emailjsConfig.LOGIN_TEMPLATE
        );
    } else {
        console.error('שגיאה: משתמש מחובר לא זמין או שאין לו כתובת מייל.');
        return false;
    }
}

async function onTransactionDetected(transactionDetails) {
    // קבל את האימייל מהמשתנה הגלובלי currentUser
    if (window.currentUser && window.currentUser.email) {
        return sendEmailWithDetailedLogging(
            window.currentUser.email,
            emailjsConfig.TRANSACTION_TEMPLATE,
            {
                amount: transactionDetails.amount,
                description: transactionDetails.description || 'ללא תיאור',
                new_balance: transactionDetails.newBalance,
                transaction_type: transactionDetails.type === 'income' ? 'הכנסה' : 'הוצאה',
                local_time: getCurrentDateTime()
            }
        );
    } else {
        console.error('שגיאה: משתמש מחובר לא זמין או שאין לו כתובת מייל.');
        return false;
    }
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

// אין צורך לייצא את הפונקציות דרך window, מכיוון שהן מוגדרות בקובץ נפרד
// והסקריפט הזה נטען ישירות ב-HTML.
