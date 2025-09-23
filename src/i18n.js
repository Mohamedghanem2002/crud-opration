import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Get saved language from localStorage or use browser language
const savedLanguage = localStorage.getItem('i18nextLng') || 'en';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        // General
        appName: "Task Manager",
        settings: "Settings",
        dashboard: "Dashboard",
        overview: "Overview of your tasks and progress",
        tasks: "Tasks",
        // projects: {
        //   title: "Projects",
        // },
        profile: "Profile",
        logout: "Log Out",
        searchPlaceholder: "Search tasks, projects...",
        switchLang: "Switch to Arabic",

        // Task-related
        completed: "Completed",
        pending: "Pending",
        dueToday: "Due Today",
        taskCompletionTrend: "Task Completion Trend",
        monthlyTasks: "Monthly Tasks",
        addTask: "Add Task",
        title: "Title",
        description: "Description",
        dueDate: "Due Date (optional)",
        priority: "Priority",
        high: "High",
        medium: "Medium",
        low: "Low",
        saving: "Saving...",
        success: "Task created successfully!",
        error: "Failed to create task!",
        editTask: "Edit Task",
        updateTask: "Update Task",
        cancel: "Cancel",

        // Profile
        save: "Save",
        editProfile: "Edit Profile",
        shareProfile: "Share My Profile",

        // Public profile
        fetchError: "Error fetching public profile",
        userNotFound: "User not found",
        backHome: "Back Home",
        joinUs: "Join Us",

        // Auth
        auth: {
          // UI Text
          signIn: "Sign In",
          signUp: "Sign Up",
          forgotPassword: "Forgot Password",
          signInEmail: "Email address",
          signInPassword: "Password",
          signInSubmit: "Sign In",
          signUpName: "Full Name",
          signUpEmail: "Email address",
          signUpPassword: "Password",
          signUpConfirmPassword: "Confirm Password",
          signUpSubmit: "Sign Up",
          forgotPasswordEmail: "Enter your email address",
          forgotPasswordSubmit: "Send Reset Link",
          resetPassword: "Reset Password",
          resetPasswordSubmit: "Reset Password",
          dontHaveAccount: "Don't have an account? ",
          alreadyHaveAccount: "Already have an account? ",
          rememberPassword: "Remembered your password? ",
          resetLinkSent: "Password reset link sent! Check your email.",
          accountCreated: "Account created successfully!",
          passwordRequirements: "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number.",
          passwordsDontMatch: "Passwords don't match",
          invalidEmail: "Please enter a valid email address",
          nameRequired: "Name is required",
          emailRequired: "Email is required",
          phoneRequired: "Phone number is required",
          passwordRequired: "Password is required",
          confirmPasswordRequired: "Please confirm your password",
          phoneNumber: "Phone Number",
          
          // Error Messages
          errors: {
            invalidCredentials: "Invalid email or password. Please try again.",
            signInError: "Failed to sign in. Please try again.",
            registrationError: "Failed to create account. Please try again.",
            resetPasswordError: "Failed to send reset email. Please try again later.",
            emailInUse: "This email is already in use.",
            userNotFound: "No user found with this email.",
            userDisabled: "This account has been disabled.",
            wrongPassword: "Incorrect password. Please try again.",
            missingPassword: "Please enter your password.",
            tooManyRequests: "Too many attempts. Please try again later.",
            invalidCredential: "Invalid credentials. Please try again.",
            sending: "Sending..."
          },
          authErrors: {
            "auth/invalid-email": "Please enter a valid email.",
            "auth/user-disabled": "This account has been disabled. Contact support.",
            "auth/user-not-found": "No account found with this email.",
            "auth/wrong-password": "Incorrect password. Please try again.",
            "auth/missing-password": "Password is required.",
            "auth/too-many-requests": "Too many failed attempts. Please try again later.",
            "auth/invalid-credential": "Invalid email or password. Please try again.",
            default: "Login failed. Please try again.",
          },
        },

        // Landing
        welcome: "Welcome to",
        description:
          "Organize your tasks, set priorities, and track your progress with ease ",
        getStarted: "Get Started",
        viewDashboard: "View Dashboard",

        // Task actions
        tasks: {
          title: "Tasks",
          loading: "Loading...",
          noTasks: "No tasks found",
          loadError: "Failed to load tasks!",
          deleteConfirm: "Are you sure you want to delete this task?",
          deleteSuccess: "Task deleted successfully!",
          deleteError: "Failed to delete task!",
          completeSuccess: "Task marked as completed!",
          completeError: "Failed to update task!",
          completed: "Completed",
          due: "Due",
          noDeadline: "No deadline",
          priority: "Priority",
          complete: "Complete",
          edit: "Edit",
          delete: "Delete",
          
        },
      },
    },
    ar: {
      translation: {
        // General
        appName: "مدير المهام",
        settings: "الإعدادات",
        dashboard: "لوحة التحكم",
        overview: "نظرة عامة على مهامك وتقدمك",
        tasks: "المهام",
        projects: {
          title: "المشاريع",
        },
        profile: "الملف الشخصي",
        logout: "تسجيل الخروج",
        searchPlaceholder: "ابحث في المهام والمشاريع...",
        switchLang: "التبديل إلى الإنجليزية",

        // Task-related
        completed: "مكتملة",
        pending: "قيد الانتظار",
        dueToday: "مستحق اليوم",
        taskCompletionTrend: "اتجاه إكمال المهام",
        monthlyTasks: "المهام الشهرية",
        addTask: "إضافة مهمة",
        title: "العنوان",
        description: "الوصف",
        dueDate: "تاريخ الاستحقاق (اختياري)",
        priority: "الأولوية",
        high: "عالية",
        medium: "متوسطة",
        low: "منخفضة",
        saving: "جارٍ الحفظ...",
        success: "تم إنشاء المهمة بنجاح!",
        error: "فشل إنشاء المهمة!",
        editTask: "تعديل المهمة",
        updateTask: "تحديث المهمة",
        cancel: "إلغاء",

        // Profile
        save: "حفظ",
        editProfile: "تعديل الملف الشخصي",
        shareProfile: "مشاركة ملفي الشخصي",

        // Public profile
        fetchError: "حدث خطأ أثناء جلب الملف الشخصي",
        userNotFound: "المستخدم غير موجود",
        backHome: "العودة إلى الصفحة الرئيسية",
        joinUs: "انضم إلينا",
        userInfo: "User Information",
        name: "Name",
        dob: "Date of Birth",
        location: "Location",

        // Auth
        auth: {
          // UI Text
          signIn: "تسجيل الدخول",
          signUp: "إنشاء حساب",
          forgotPassword: "نسيت كلمة المرور",
          signInEmail: "البريد الإلكتروني",
          signInPassword: "كلمة المرور",
          signInSubmit: "تسجيل الدخول",
          signUpName: "الاسم الكامل",
          signUpEmail: "البريد الإلكتروني",
          signUpPassword: "كلمة المرور",
          signUpConfirmPassword: "تأكيد كلمة المرور",
          signUpSubmit: "إنشاء حساب",
          forgotPasswordEmail: "أدخل بريدك الإلكتروني",
          forgotPasswordSubmit: "إرسال رابط إعادة التعيين",
          resetPassword: "إعادة تعيين كلمة المرور",
          resetPasswordSubmit: "إعادة تعيين كلمة المرور",
          dontHaveAccount: "ليس لديك حساب؟ ",
          alreadyHaveAccount: "لديك حساب بالفعل؟ ",
          rememberPassword: "تذكرت كلمة المرور؟ ",
          resetLinkSent: "تم إرسال رابط إعادة تعيين كلمة المرور! تحقق من بريدك الإلكتروني.",
          accountCreated: "تم إنشاء الحساب بنجاح!",
          passwordRequirements: "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل، وتحتوي على حرف كبير واحد على الأقل وحرف صغير ورقم واحد.",
          passwordsDontMatch: "كلمات المرور غير متطابقة",
          invalidEmail: "الرجاء إدخال بريد إلكتروني صالح",
          nameRequired: "الاسم مطلوب",
          emailRequired: "البريد الإلكتروني مطلوب",
          phoneRequired: "رقم الهاتف مطلوب",
          passwordRequired: "كلمة المرور مطلوبة",
          confirmPasswordRequired: "الرجاء تأكيد كلمة المرور",
          phoneNumber: "رقم الهاتف",
          
          // Error Messages
          errors: {
            invalidCredentials: "البريد الإلكتروني أو كلمة المرور غير صحيحة. حاول مرة أخرى.",
            signInError: "فشل في تسجيل الدخول. حاول مرة أخرى.",
            registrationError: "فشل في إنشاء الحساب. حاول مرة أخرى.",
            resetPasswordError: "فشل في إرسال رابط إعادة تعيين كلمة المرور. حاول مرة أخرى لاحقاً.",
            emailInUse: "هذا البريد الإلكتروني مستخدم بالفعل.",
            userNotFound: "لم يتم العثور على مستخدم بهذا البريد الإلكتروني.",
            userDisabled: "تم تعطيل هذا الحساب.",
            wrongPassword: "كلمة المرور غير صحيحة. حاول مرة أخرى.",
            missingPassword: "يرجى إدخال كلمة المرور.",
            tooManyRequests: "محاولات كثيرة فاشلة. حاول لاحقاً.",
            invalidCredential: "بيانات الاعتماد غير صالحة. يرجى المحاولة مرة أخرى.",
            sending: "جارٍ الإرسال..."
          },
          authErrors: {
            "auth/invalid-email": "يرجى إدخال بريد إلكتروني صالح.",
            "auth/user-disabled": "تم تعطيل هذا الحساب. يرجى الاتصال بالدعم.",
            "auth/user-not-found": "لا يوجد حساب بهذا البريد الإلكتروني.",
            "auth/wrong-password": "كلمة المرور غير صحيحة. حاول مرة أخرى.",
            "auth/missing-password": "كلمة المرور مطلوبة.",
            "auth/too-many-requests": "محاولات كثيرة فاشلة. حاول لاحقاً.",
            "auth/invalid-credential": "البريد الإلكتروني أو كلمة المرور غير صحيحة. حاول مرة أخرى.",
            default: "فشل تسجيل الدخول. حاول مرة أخرى.",
          },
        },

        // Landing
        welcome: "مرحباً بك في",
        description: "نظم مهامك، حدد أولوياتك، وتتبع تقدمك بسهولة ",
        getStarted: "ابدأ الآن",
        viewDashboard: "عرض لوحة التحكم",

        // Task actions
        tasks: {
          title: "المهام",
          loading: "جارٍ التحميل...",
          noTasks: "لا توجد مهام",
          loadError: "فشل في تحميل المهام!",
          deleteConfirm: "هل أنت متأكد أنك تريد حذف هذه المهمة؟",
          deleteSuccess: "تم حذف المهمة بنجاح!",
          deleteError: "فشل في حذف المهمة!",
          completeSuccess: "تم وضع علامة على المهمة كمكتملة!",
          completeError: "فشل في تحديث المهمة!",
          completed: "مكتملة",
          due: "تاريخ الاستحقاق",
          noDeadline: "لا يوجد موعد نهائي",
          priority: "الأولوية",
          complete: "إكمال",
          edit: "تعديل",
          delete: "حذف",
        },
      },
    },
  },
  lng: savedLanguage, // Use the saved language or default to 'en'
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

// Save language preference to localStorage when language changes
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('i18nextLng', lng);
  // Update document direction based on language
  document.body.dir = lng === 'ar' ? 'rtl' : 'ltr';
});

// Set initial direction
document.body.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';

export default i18n;
