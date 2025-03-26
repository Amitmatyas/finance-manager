// הגדרות EmailJS
const emailjsConfig = {
    PUBLIC_KEY: "PsDDfAH8bMiKGAGM2",
    SERVICE_ID: "service_hz4dvn9",
    LOGIN_TEMPLATE: "template_login",
    TRANSACTION_TEMPLATE: "template_transaction"
};

// אתחול EmailJS
emailjs.init(emailjsConfig.PUBLIC_KEY);

// פונקציה שמייצרת את התאריך והשעה בפורמט הנכון
function getCurrentDateTime() {
    const now = new Date();
    return now.getUTCFullYear() + '-' + 
           String(now.getUTCMonth() + 1).padStart(2, '0') + '-' + 
           String(now.getUTCDate()).padStart(2, '0') + ' ' + 
           String(now.getUTCHours()).padStart(2, '0') + ':' + 
           String(now.getUTCMinutes()).padStart(2, '0') + ':' + 
           String(now.getUTCSeconds()).padStart(2, '0');
}

// פונקציה שמופעלת בעת התחברות
function onLoginDetected(user) {  // מקבלת את פרטי המשתמש שהתחבר
    const emailData = {
        to_email: user.email,        // האימייל של המשתמש הספציפי
        name: user.displayName,      // השם של המשתמש הספציפי
        local_time: getCurrentDateTime(),  // הזמן הנוכחי
        user_login: user.username,   // שם המשתמש הספציפי
        device_info: navigator.userAgent
    };

    emailjs.send(emailjsConfig.SERVICE_ID, emailjsConfig.LOGIN_TEMPLATE, emailData)
        .then(() => console.log("נשלח מייל התחברות למשתמש:", user.email))
        .catch(error => console.error("שגיאה:", error));
}

// פונקציה שמופעלת בעת ביצוע עסקה
function onTransactionDetected(user, transactionDetails) {  // מקבלת את המשתמש ופרטי העסקה
    const emailData = {
        to_email: user.email,        // האימייל של המשתמש הספציפי
        name: user.displayName,      // השם של המשתמש הספציפי
        local_time: getCurrentDateTime(),  // הזמן הנוכחי
        user_login: user.username,   // שם המשתמש הספציפי
        amount: transactionDetails.amount,
        description: transactionDetails.description,
        new_balance: transactionDetails.newBalance,
        isIncome: transactionDetails.type === 'income'
    };

    emailjs.send(emailjsConfig.SERVICE_ID, emailjsConfig.TRANSACTION_TEMPLATE, emailData)
        .then(() => console.log("נשלח מייל עסקה למשתמש:", user.email))
        .catch(error => console.error("שגיאה:", error));
}
