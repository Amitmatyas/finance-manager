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

// פונקציה שמחזירה את התאריך והשעה הנוכחיים בפורמט הרצוי (שעון ישראל)
function getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    // השתמש ב-toLocaleTimeString כדי לקבל את השעה המקומית (ישראל)
    const localTimeString = now.toLocaleTimeString('he-IL', { hour12: false });
    const [hours, minutes, seconds] = localTimeString.split(':');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// פונקציה לשליחת מייל עם דיבאג מפורט
async function sendEmailWithDetailedLogging(to_email, templateId, additionalData = {}) {
    // בדיקות תקינות
    if (!to_email || to_email.trim() === '') {
        console.error('שגיאה: כתובת המייל ריקה');
        return false;
    }

    if (!isValidEmail(to_email)) {
        console.error(`שגיאה: כתובת המייל ${to_email} אינה תקינה`);
        return false;
    }

    try {
        // הכנת נתוני המייל
        const emailData = {
            to_email: to_email.trim(), // הגדרנו את זה ראשון
            from_name: "Finance Manager",
            display_name: to_email.split('@')[0],
            user_login: to_email.split('@')[0],
            local_time: getCurrentDateTime(),
            ip_address: additionalData.loginDetails?.ipAddress || "אין נתונים",
            device_model: additionalData.loginDetails?.deviceModel || "אין נתונים",
            device_type: additionalData.loginDetails?.deviceType || "אין נתונים",
            ...additionalData
        };

        console.log("מנסה לשלוח מייל עם הנתונים המפורטים:", JSON.stringify(emailData, null, 2));

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
async function onLoginDetected(email, loginDetails = {}) { // מקבל כעת גם loginDetails
    console.log('onLoginDetected נקראה עם אימייל:', email, ' ופרטי התחברות:', loginDetails);

    if (!email) {
        console.error('שגיאה: לא סופק אימייל למשלוח הודעת התחברות.');
        return false;
    }

    const emailSent = await sendEmailWithDetailedLogging(
        email,
        emailjsConfig.LOGIN_TEMPLATE,
        { loginDetails: loginDetails } // מעביר את פרטי ההתחברות
    );
    if (emailSent) {
        console.log('מייל התחברות נשלח בהצלחה');
        return true;
    } else {
        console.log('מייל התחברות לא נשלח עקב שגיאה.');
        return false;
    }
}

async function onTransactionDetected({ amount, description, type, newBalance, userEmail }) {
    console.log('onTransactionDetected נקראה עם פרטים:', { amount, description, type, newBalance, userEmail });

    if (userEmail) {
        console.log('כתובת המייל של המשתמש:', userEmail);
        const transactionTypeHebrew = type === 'income' ? 'הכנסה' : 'הוצאה';
        const emailSent = await sendEmailWithDetailedLogging(
            userEmail,
            emailjsConfig.TRANSACTION_TEMPLATE,
            {
                amount: amount,
                description: description || 'ללא תיאור',
                new_balance: newBalance,
                transaction_type: transactionTypeHebrew, // שימוש במשתנה העברי
                local_time: getCurrentDateTime()
            }
        );
        if (emailSent) {
            console.log('מייל עסקה נשלח בהצלחה');
            return true;
        } else {
            console.log('מייל עסקה לא נשלח עקב שגיאה.');
            return false;
        }
    } else {
        console.error('שגיאה: לא סופקה כתובת מייל למשלוח הודעת עסקה.');
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
