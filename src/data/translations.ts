import { Language } from '../types';

export interface TranslationDictionary {
  // Common
  appName: string;
  appSubtitle: string;
  navTakeExam: string;
  navResults: string;
  navAdmin: string;
  pendingReviews: string;
  languageSelect: string;
  changeLanguage: string;
  loading: string;
  save: string;
  saved: string;
  cancel: string;
  submit: string;
  back: string;
  next: string;
  finish: string;
  confirm: string;
  delete: string;
  search: string;

  // Onboarding & Unique ID
  enterUniqueIdTitle: string;
  enterUniqueIdSubtitle: string;
  uniqueIdLabel: string;
  uniqueIdPlaceholder: string;
  sampleIdsHelper: string;
  startExamBtn: string;
  generateNewIdBtn: string;
  idRequiredError: string;
  expressModeLabel: string;
  expressModeDesc: string;

  // Mustahiq & Emotion Pre-Test Assessment
  mustahiqAssessmentTitle: string;
  mustahiqAssessmentSubtitle: string;
  mustahiqTag: string;
  incomeLabel: string;
  incomeUnder25k: string;
  income25kTo50k: string;
  income50kTo80k: string;
  incomeAbove80k: string;
  fatherOccupationLabel: string;
  fatherOccupationPlaceholder: string;
  dependentsLabel: string;
  hardshipLabel: string;
  hardshipPlaceholder: string;
  motivationLabel: string;
  motivationPlaceholder: string;
  preTestEmotionLabel: string;
  emotionHopeful: string;
  emotionAnxious: string;
  emotionDetermined: string;
  emotionPressured: string;
  emotionConfident: string;
  mustahiqNotice: string;
  proceedToTestBtn: string;

  // Exam Runner
  questionLabel: string;
  ofTotal: string;
  phaseLabel: string;
  timeRemaining: string;
  listenQuestion: string;
  viewHint: string;
  hideHint: string;
  currentEmotion: string;
  difficultyLevel: string;
  typeYourAnswer: string;
  selectOption: string;
  submitAnswer: string;
  skipQuestion: string;
  finishExamEarly: string;
  leaveFeedback: string;

  // Completion Modal
  examSubmittedTitle: string;
  examSubmittedDesc: string;
  yourRollId: string;
  checkResultsNow: string;
  openAdminPanel: string;
  takeAnotherTest: string;

  // Admin Dashboard & Quota
  adminPortalTitle: string;
  adminPortalSubtitle: string;
  totalSubmissions: string;
  pendingReviewCount: string;
  checkedCount: string;
  publishedCount: string;
  scholarshipQuotaTitle: string;
  scholarshipQuotaDesc: string;
  quota100Label: string;
  quota50Label: string;
  quota25Label: string;
  quotaRuleAlert: string;
  autoAllocateBtn: string;
  autoAllocateSuccess: string;
  filterAll: string;
  filterPending: string;
  filterChecked: string;
  filterPublished: string;
  studentNameCol: string;
  rollIdCol: string;
  mustahiqIndexCol: string;
  objectiveScoreCol: string;
  subjectiveScoreCol: string;
  finalScoreCol: string;
  scholarshipCol: string;
  statusCol: string;
  actionsCol: string;
  gradeStudentBtn: string;

  // Grading Studio
  gradingStudioTitle: string;
  evaluatingStudent: string;
  studentNeedProfile: string;
  needScoreLabel: string;
  preEmotionLabel: string;
  incomeBracketLabel: string;
  familyHardshipLabel: string;
  aiAssistBtn: string;
  aiEvaluating: string;
  scoreAwarded: string;
  outOf: string;
  feedbackRemarks: string;
  scholarshipTierSelection: string;
  publishResultBtn: string;
  saveChangesBtn: string;
  backToDashboard: string;
  quotaExceededWarning100: string;
  quotaExceededWarning50: string;

  // Results & Certificate
  searchResultTitle: string;
  searchResultSubtitle: string;
  searchPlaceholder: string;
  searchBtn: string;
  noResultFound: string;
  resultPublishedNotice: string;
  resultPendingNotice: string;
  marksheetTitle: string;
  certificateTitle: string;
  printCertificateBtn: string;
  scholarshipAwarded: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  ur: {
    appName: 'اومنی ٹیسٹ ایڈاپٹیو پورٹل',
    appSubtitle: 'ذہانت، میرٹ اور ضرورت کی جانچ کا جامع امتحانی نظام',
    navTakeExam: 'امتحان دیں',
    navResults: 'نتائج دیکھیں',
    navAdmin: 'ایڈمن اسٹوڈیو',
    pendingReviews: 'زیرِ جائزہ',
    languageSelect: 'زبان منتخب کریں',
    changeLanguage: 'تبدیل کریں',
    loading: 'لوڈ ہو رہا ہے...',
    save: 'محفوظ کریں',
    saved: 'محفوظ ہو گیا!',
    cancel: 'منسوخ',
    submit: 'جمع کرائیں',
    back: 'پیچھے',
    next: 'اگلا',
    finish: 'مکمل کریں',
    confirm: 'تصدیق کریں',
    delete: 'حذف کریں',
    search: 'تلاش کریں',

    enterUniqueIdTitle: 'امتحان میں شمولیت کا گیٹ وے',
    enterUniqueIdSubtitle: 'اپنا مخصوص اور منفرد رول آئی ڈی نمبر درج کریں',
    uniqueIdLabel: 'طالب علم کا یونیک آئی ڈی نمبر (Unique ID)',
    uniqueIdPlaceholder: 'مثال: OMNI-101 یا STU-2026',
    sampleIdsHelper: 'نمونہ آئی ڈیز آزمائیں:',
    startExamBtn: 'ٹیسٹ میں داخل ہوں',
    generateNewIdBtn: 'نیا یونیک آئی ڈی بنائیں',
    idRequiredError: 'براہ کرم آگے بڑھنے سے پہلے یونیک آئی ڈی درج کریں!',
    expressModeLabel: 'فوری اسمارٹ ایڈاپٹیو موڈ',
    expressModeDesc: 'کم وقت میں مکمل اور گہری ذہنی و جذباتی جانچ',

    mustahiqAssessmentTitle: 'مستحق و جذباتی جانچ (Need & Emotion Assessment)',
    mustahiqAssessmentSubtitle: 'ٹیسٹ شروع ہونے سے پہلے اپنی معاشی و جذباتی تفصیلات درج فرمائیں',
    mustahiqTag: 'مستحق اسکالرشپ جائزہ',
    incomeLabel: 'ماہانہ گھریلو آمدنی',
    incomeUnder25k: '25,000 روپے سے کم (انتہائی مستحق)',
    income25kTo50k: '25,000 تا 50,000 روپے (مستحق)',
    income50kTo80k: '50,000 تا 80,000 روپے (اوسط)',
    incomeAbove80k: '80,000 روپے سے زائد',
    fatherOccupationLabel: 'والد / سرپرست کا پیشہ',
    fatherOccupationPlaceholder: 'مثال: دیہاڑی دار، ڈرائیور، ملازم، وغیرہ',
    dependentsLabel: 'زیرِ کفالت افراد / پڑھنے والے بہن بھائی',
    hardshipLabel: 'تعلیم میں سب سے بڑی مالی یا خاندانی رکاوٹ',
    hardshipPlaceholder: 'اپنے حالات مختصر بیان کریں...',
    motivationLabel: 'تعلیم اور ترقی کا آپ کا جذباتی مقصد',
    motivationPlaceholder: 'آپ یہ اسکالرشپ جیت کر کیا بننا چاہتے ہیں؟',
    preTestEmotionLabel: 'امتحان دینے سے قبل آپ کی قلبی کیفیت',
    emotionHopeful: 'پرامید اور پرعزم (Hopeful)',
    emotionAnxious: 'تھوڑی بے چینی و خوف (Anxious)',
    emotionDetermined: 'شدید محنت کا پکا ارادہ (Determined)',
    emotionPressured: 'حالات کے دباؤ میں (Pressured)',
    emotionConfident: 'مکمل پر اعتماد (Confident)',
    mustahiqNotice: 'یہ ڈیٹا منصفانہ اسکالرشپ کوٹہ کی تقسیم میں ایڈمن کو مدد فراہم کرے گا۔',
    proceedToTestBtn: 'جذبہ محفوظ کریں اور ٹیسٹ شروع کریں',

    questionLabel: 'سوال نمبر',
    ofTotal: 'از',
    phaseLabel: 'مرحلہ',
    timeRemaining: 'باقی وقت',
    listenQuestion: 'سوال سنیں',
    viewHint: 'اشارہ (Hint) دیکھیں',
    hideHint: 'اشارہ چھپائیں',
    currentEmotion: 'جذباتی حالت',
    difficultyLevel: 'مشکل کی سطح',
    typeYourAnswer: 'اپنا جواب یہاں تفصیلاً تحریر کریں...',
    selectOption: 'درست آپشن کا انتخاب کریں',
    submitAnswer: 'جواب محفوظ کریں اور آگے بڑھیں',
    skipQuestion: 'سوال چھوڑیں',
    finishExamEarly: 'امتحان مکمل کریں',
    leaveFeedback: 'استاد کا فیڈ بیک',

    examSubmittedTitle: 'امتحان کامیابی سے جمع ہو گیا!',
    examSubmittedDesc: 'آپ کی معروضی، انشائیہ اور مستحق پروفائل بحفاظت درج کر لی گئی ہے۔',
    yourRollId: 'آپ کا تصدیقی رول آئی ڈی نمبر',
    checkResultsNow: 'نتیجہ اور میرٹ رپورٹ تلاش کریں',
    openAdminPanel: 'ایڈمن اسٹوڈیو میں جائزہ لیں',
    takeAnotherTest: 'نیا امتحان شروع کریں',

    adminPortalTitle: 'ایڈمن چیکنگ اسٹوڈیو و کوٹہ مینجمنٹ',
    adminPortalSubtitle: 'طلبہ کے امتحانی پرچے، مستحق انڈیکس اور مخصوص اسکالرشپ کوٹہ کا انتظام',
    totalSubmissions: 'کل وصول شدہ امتحانات',
    pendingReviewCount: 'غیر چیک شدہ',
    checkedCount: 'چیک شدہ',
    publishedCount: 'شائع شدہ نتائج',
    scholarshipQuotaTitle: 'مخصوص اسکالرشپ کوٹہ رول (Scholarship Quota Rules)',
    scholarshipQuotaDesc: 'پالیسی: صرف 1 طالب علم کو 100%، 1 یا 2 طلبہ کو 50%، اور باقی پاس ہونے والے طلبہ کو 25% اسکالرشپ دی جائے گی۔',
    quota100Label: '100% کوٹہ (زیادہ سے زیادہ 1 طالب علم):',
    quota50Label: '50% کوٹہ (زیادہ سے زیادہ 1 تا 2 طلبہ):',
    quota25Label: '25% کوٹہ (باقی تمام اہل طلبہ):',
    quotaRuleAlert: 'توجہ: کوٹہ سے زائد طلبہ کو منتخب کرنے پر سسٹم متنبہ کرے گا۔',
    autoAllocateBtn: 'اسمارٹ خودکار کوٹہ تقسیم (Auto Allocate by Merit + Need)',
    autoAllocateSuccess: 'کوٹہ اصول کے مطابق خودکار اسکالرشپ تقسیم مکمل ہو گئی!',
    filterAll: 'تمام طلبہ',
    filterPending: 'زیرِ جائزہ',
    filterChecked: 'چیک شدہ',
    filterPublished: 'شائع شدہ',
    studentNameCol: 'طالب علم',
    rollIdCol: 'یونیک آئی ڈی',
    mustahiqIndexCol: 'مستحق انڈیکس و جذبہ',
    objectiveScoreCol: 'معروضی اسکور',
    subjectiveScoreCol: 'انشائیہ اسکور',
    finalScoreCol: 'مجموعی فیصد',
    scholarshipCol: 'اسکالرشپ ایوارڈ',
    statusCol: 'حالت',
    actionsCol: 'کارروائی',
    gradeStudentBtn: 'مارکنگ و فیصلہ کریں',

    gradingStudioTitle: 'پرچہ چیکنگ اسٹوڈیو و اسکالرشپ فیصلہ',
    evaluatingStudent: 'زیرِ جائزہ طالب علم',
    studentNeedProfile: 'مستحق و خاندانی پس منظر',
    needScoreLabel: 'مستحق انڈیکس (ضرورت کا تناسب)',
    preEmotionLabel: 'ٹیسٹ سے قبل کی کیفیت',
    incomeBracketLabel: 'ماہانہ آمدنی',
    familyHardshipLabel: 'مالی / خاندانی مجبوری',
    aiAssistBtn: 'جیمینائی AI خودکار تصحیح و تجویز',
    aiEvaluating: 'AI جانچ کر رہا ہے...',
    scoreAwarded: 'دیے گئے نمبر',
    outOf: 'از',
    feedbackRemarks: 'استاد کے تبصرے و حوصلہ افزائی',
    scholarshipTierSelection: 'اسکالرشپ کیٹیگری منتخب کریں',
    publishResultBtn: 'نتیجہ شائع کریں (Publish)',
    saveChangesBtn: 'تبدیلیاں محفوظ کریں',
    backToDashboard: 'واپس لسٹ پر جائیں',
    quotaExceededWarning100: 'تنبیہ: 100% اسکالرشپ صرف 1 طالب علم کے لیے مخصوص ہے!',
    quotaExceededWarning50: 'تنبیہ: 50% اسکالرشپ صرف 1 یا 2 طلبہ کو دی جا سکتی ہے!',

    searchResultTitle: 'امتحانی نتائج و سرٹیفکیٹ پورٹل',
    searchResultSubtitle: 'اپنا یونیک آئی ڈی نمبر درج کر کے تفصیلی مارک شیٹ اور اسکالرشپ کارڈ حاصل کریں',
    searchPlaceholder: 'اپنا یونیک آئی ڈی نمبر درج کریں (مثال: OMNI-101)',
    searchBtn: 'نتیجہ تلاش کریں',
    noResultFound: 'اس رول نمبر سے کوئی نتیجہ نہیں ملا۔ براہ کرم اپنا یونیک آئی ڈی درست درج کریں۔',
    resultPublishedNotice: 'آپ کا تفصیلی نتیجہ اور اسکالرشپ ایوارڈ منظور ہو چکا ہے۔',
    resultPendingNotice: 'آپ کا پرچہ فی الوقت اساتذہ کے زیرِ جائزہ ہے۔ حتمی منظوری کے بعد یہاں ظاہر ہوگا۔',
    marksheetTitle: 'جامع تشخیصی رپورٹ کارڈ',
    certificateTitle: 'باضابطہ اسکالرشپ سرٹیفکیٹ',
    printCertificateBtn: 'سرٹیفکیٹ پرنٹ / ڈاؤن لوڈ کریں',
    scholarshipAwarded: 'مبارک ہو! آپ کو اسکالرشپ تفویض کی گئی ہے:',
  },

  roman: {
    appName: 'OMNI-TEST Adaptive Portal',
    appSubtitle: 'Zahanat, Merit aur Zaroorat ki jaanch ka jadeed exam system',
    navTakeExam: 'Test Dein',
    navResults: 'Nateeja Dekhein',
    navAdmin: 'Admin Studio',
    pendingReviews: 'Pending Reviews',
    languageSelect: 'Zuban Chunein',
    changeLanguage: 'Change Zuban',
    loading: 'Loading ho raha hai...',
    save: 'Save Karein',
    saved: 'Save Ho Gaya!',
    cancel: 'Cancel',
    submit: 'Submit Karein',
    back: 'Peeche',
    next: 'Agla',
    finish: 'Mukammal Karein',
    confirm: 'Confirm Karein',
    delete: 'Delete',
    search: 'Talash Karein',

    enterUniqueIdTitle: 'Test Mein Dakhlay Ka Gateway',
    enterUniqueIdSubtitle: 'Apna makhsoos aur Unique Roll ID number darj karein',
    uniqueIdLabel: 'Student Ka Unique ID Number',
    uniqueIdPlaceholder: 'Misaal: OMNI-101 ya STU-2026',
    sampleIdsHelper: 'Sample IDs try karein:',
    startExamBtn: 'Test Shuru Karein',
    generateNewIdBtn: 'Naya Unique ID Banayein',
    idRequiredError: 'Aagay barhne se pehle Unique ID darj karein!',
    expressModeLabel: 'Fast Smart Adaptive Mode',
    expressModeDesc: 'Kam waqt mein complete aur behter IQ aur emotion test',

    mustahiqAssessmentTitle: 'Mustahiq aur Jazbati Jaiza (Need & Emotion)',
    mustahiqAssessmentSubtitle: 'Test shuru karne se pehle apni maali aur jazbati halat darj karein',
    mustahiqTag: 'Mustahiq Scholarship Jaiza',
    incomeLabel: 'Mahana Gharelu Aamdani',
    incomeUnder25k: 'PKR 25,000 se kam (Boht Zyada Mustahiq)',
    income25kTo50k: 'PKR 25,000 se 50,000 tak (Mustahiq)',
    income50kTo80k: 'PKR 50,000 se 80,000 tak (Average)',
    incomeAbove80k: 'PKR 80,000 se zyada',
    fatherOccupationLabel: 'Walid / Guardian Ka Kaam',
    fatherOccupationPlaceholder: 'Misaal: Mazdoor, Driver, Shopkeeper, Mulazim waghera',
    dependentsLabel: 'Ghar ke parhnay walay afrad / Behn Bhai',
    hardshipLabel: 'Parhai mein sab se bari maali ya gharelu mushkil',
    hardshipPlaceholder: 'Apnay halat mukhtasar bayan karein...',
    motivationLabel: 'Parhai aur aagay barhnay ka jazbati maqsad',
    motivationPlaceholder: 'Aap scholarship jeet kar kya banna chahtay hain?',
    preTestEmotionLabel: 'Test dene se pehle aap ka jazba aur dil ki kaifiyat',
    emotionHopeful: 'Pur-umeed aur jazbaati (Hopeful)',
    emotionAnxious: 'Thora dar aur be-chaini (Anxious)',
    emotionDetermined: 'Pakka irada aur mehnat (Determined)',
    emotionPressured: 'Halat ka dabao (Pressured)',
    emotionConfident: 'Poora pur-ehtamad (Confident)',
    mustahiqNotice: 'Yeh data admin ko insaaf ke sath scholarship quota taqseem karne mein madad dega.',
    proceedToTestBtn: 'Jazba Save Karein aur Test Shuru Karein',

    questionLabel: 'Sawal Number',
    ofTotal: 'az',
    phaseLabel: 'Phase',
    timeRemaining: 'Baqi Waqt',
    listenQuestion: 'Sawal Suniye',
    viewHint: 'Hint Dekhein',
    hideHint: 'Hint Chhupayein',
    currentEmotion: 'Jazbati Halat',
    difficultyLevel: 'Difficulty Level',
    typeYourAnswer: 'Apna jawab yahan tafseel se likhein...',
    selectOption: 'Sahi Option choose karein',
    submitAnswer: 'Jawab Save Karein & Next',
    skipQuestion: 'Sawal Chhodein',
    finishExamEarly: 'Test Mukammal Karein',
    leaveFeedback: 'Teacher Feedback',

    examSubmittedTitle: 'Test Kamyabi Se Submit Ho Gaya!',
    examSubmittedDesc: 'Aap ka objective, subjective aur mustahiq record mehfooz ho gaya hai.',
    yourRollId: 'Aap Ka Unique Roll ID',
    checkResultsNow: 'Nateeja aur Report Talash Karein',
    openAdminPanel: 'Admin Studio Mein Dekhein',
    takeAnotherTest: 'Naya Test Shuru Karein',

    adminPortalTitle: 'Admin Checking Studio & Quota Management',
    adminPortalSubtitle: 'Students ke parhay, mustahiq index aur specific scholarship quota ka intizam',
    totalSubmissions: 'Total Submissions',
    pendingReviewCount: 'Pending Review',
    checkedCount: 'Checked Parhay',
    publishedCount: 'Published Results',
    scholarshipQuotaTitle: 'Scholarship Quota Rules (Makhsoos Quota)',
    scholarshipQuotaDesc: 'Policy: Sirf 1 student ko 100%, 1 ya 2 students ko 50%, aur baqi sab pass students ko 25% scholarship di jayegi.',
    quota100Label: '100% Quota (Maximum 1 Student):',
    quota50Label: '50% Quota (Maximum 1 ya 2 Students):',
    quota25Label: '25% Quota (Baqi Kamyab Students):',
    quotaRuleAlert: 'Notice: Quota se zyada select karne par system warn karega.',
    autoAllocateBtn: 'Smart Auto-Allocate by Quota & Need',
    autoAllocateSuccess: 'Quota policy ke mutabiq scholarships auto-assign ho gayin!',
    filterAll: 'Sab Students',
    filterPending: 'Pending',
    filterChecked: 'Checked',
    filterPublished: 'Published',
    studentNameCol: 'Student Naam',
    rollIdCol: 'Unique ID',
    mustahiqIndexCol: 'Mustahiq Index & Emotion',
    objectiveScoreCol: 'Objective Score',
    subjectiveScoreCol: 'Subjective Score',
    finalScoreCol: 'Final Percentage',
    scholarshipCol: 'Scholarship Tier',
    statusCol: 'Status',
    actionsCol: 'Action',
    gradeStudentBtn: 'Check Karein & Faisla',

    gradingStudioTitle: 'Paper Checking Studio & Scholarship Faisla',
    evaluatingStudent: 'Under Review Student',
    studentNeedProfile: 'Mustahiq aur Gharelu Background',
    needScoreLabel: 'Mustahiq Score (Zaroorat Ka Tanasub)',
    preEmotionLabel: 'Test Se Pehle Ka Jazba',
    incomeBracketLabel: 'Mahana Aamdani',
    familyHardshipLabel: 'Gharelu / Maali Majboori',
    aiAssistBtn: 'Gemini AI Auto-Evaluation & Advice',
    aiEvaluating: 'AI check kar raha hai...',
    scoreAwarded: 'Diye Gaye Marks',
    outOf: 'az',
    feedbackRemarks: 'Teacher ke comments aur hosla afzai',
    scholarshipTierSelection: 'Scholarship Category Select Karein',
    publishResultBtn: 'Nateeja Publish Karein',
    saveChangesBtn: 'Changes Save Karein',
    backToDashboard: 'Wapis Dashboard',
    quotaExceededWarning100: 'Warning: 100% Scholarship sirf 1 student ke liye makhsoos hai!',
    quotaExceededWarning50: 'Warning: 50% Scholarship sirf 1 ya 2 students ko di ja sakti hai!',

    searchResultTitle: 'Results aur Certificate Portal',
    searchResultSubtitle: 'Apna Unique ID darj karke marksheet aur scholarship certificate hasil karein',
    searchPlaceholder: 'Apna Unique ID number likhein (Misaal: OMNI-101)',
    searchBtn: 'Nateeja Talash Karein',
    noResultFound: 'Is ID se koi record nahi mila. Barah-e-karam apna Unique ID theek likhein.',
    resultPublishedNotice: 'Aap ka result aur scholarship award manzoor ho chuka hai.',
    resultPendingNotice: 'Aap ka paper abhi checking stage mein hai. Publish hone ke baad yahan nazar aayega.',
    marksheetTitle: 'Complete Diagnostic Marksheet',
    certificateTitle: 'Official Scholarship Certificate',
    printCertificateBtn: 'Certificate Print / Download Karein',
    scholarshipAwarded: 'Mubarak ho! Aap ko scholarship mili hai:',
  },

  en: {
    appName: 'OMNI-TEST Adaptive Assessment Portal',
    appSubtitle: 'Comprehensive evaluation of intelligence, merit, and deservingness',
    navTakeExam: 'Take Exam',
    navResults: 'Search Results',
    navAdmin: 'Admin Studio',
    pendingReviews: 'Pending Reviews',
    languageSelect: 'Select Language',
    changeLanguage: 'Language',
    loading: 'Loading...',
    save: 'Save',
    saved: 'Saved Successfully!',
    cancel: 'Cancel',
    submit: 'Submit',
    back: 'Back',
    next: 'Next',
    finish: 'Finish',
    confirm: 'Confirm',
    delete: 'Delete',
    search: 'Search',

    enterUniqueIdTitle: 'Exam Access Gateway',
    enterUniqueIdSubtitle: 'Enter your unique assigned student roll ID number',
    uniqueIdLabel: 'Student Unique ID Number',
    uniqueIdPlaceholder: 'e.g., OMNI-101 or STU-2026',
    sampleIdsHelper: 'Try Sample IDs:',
    startExamBtn: 'Enter Test',
    generateNewIdBtn: 'Generate New Unique ID',
    idRequiredError: 'Please enter a Unique ID before proceeding!',
    expressModeLabel: 'Fast Smart Adaptive Mode',
    expressModeDesc: 'Optimized multi-phase cognitive and emotional assessment',

    mustahiqAssessmentTitle: 'Need & Emotion Pre-Test Assessment',
    mustahiqAssessmentSubtitle: 'Provide your socioeconomic background and emotional readiness before testing',
    mustahiqTag: 'Deservingness Verification',
    incomeLabel: 'Monthly Household Income',
    incomeUnder25k: 'Under PKR 25,000 (Highly Deserving)',
    income25kTo50k: 'PKR 25,000 to 50,000 (Deserving)',
    income50kTo80k: 'PKR 50,000 to 80,000 (Moderate)',
    incomeAbove80k: 'Above PKR 80,000',
    fatherOccupationLabel: "Father / Guardian's Occupation",
    fatherOccupationPlaceholder: 'e.g., Daily wager, driver, clerk, laborer',
    dependentsLabel: 'Dependents / School-going siblings',
    hardshipLabel: 'Primary Financial or Personal Obstacle',
    hardshipPlaceholder: 'Briefly describe the circumstances affecting your studies...',
    motivationLabel: 'Educational Drive & Life Vision',
    motivationPlaceholder: 'What is your dream and goal if awarded this scholarship?',
    preTestEmotionLabel: 'Pre-Exam Emotional Mindset',
    emotionHopeful: 'Hopeful & Inspired',
    emotionAnxious: 'Anxious & Nervous',
    emotionDetermined: 'Highly Determined & Resilient',
    emotionPressured: 'Under High Pressure',
    emotionConfident: 'Fully Confident',
    mustahiqNotice: 'This information assists administrators in allocating strictly bounded scholarship quotas.',
    proceedToTestBtn: 'Confirm Mindset & Start Test',

    questionLabel: 'Question',
    ofTotal: 'of',
    phaseLabel: 'Phase',
    timeRemaining: 'Time Left',
    listenQuestion: 'Read Aloud',
    viewHint: 'Show Hint',
    hideHint: 'Hide Hint',
    currentEmotion: 'Emotion State',
    difficultyLevel: 'Difficulty Level',
    typeYourAnswer: 'Type your detailed answer here...',
    selectOption: 'Select the correct option',
    submitAnswer: 'Save Answer & Next',
    skipQuestion: 'Skip Question',
    finishExamEarly: 'Complete Exam',
    leaveFeedback: 'Instructor Feedback',

    examSubmittedTitle: 'Exam Submitted Successfully!',
    examSubmittedDesc: 'Your objective, subjective, and deservingness profile have been recorded.',
    yourRollId: 'Your Registered Unique Roll ID',
    checkResultsNow: 'View Results & Diagnostic Report',
    openAdminPanel: 'Open in Admin Grading Studio',
    takeAnotherTest: 'Take Another Test',

    adminPortalTitle: 'Admin Grading Studio & Quota Manager',
    adminPortalSubtitle: 'Review student submissions, evaluate deservingness, and enforce strict quota rules',
    totalSubmissions: 'Total Submissions',
    pendingReviewCount: 'Pending Review',
    checkedCount: 'Checked Papers',
    publishedCount: 'Published Results',
    scholarshipQuotaTitle: 'Strict Scholarship Quota Rules',
    scholarshipQuotaDesc: 'Policy: Exactly 1 student receives 100%, 1 or 2 students receive 50%, and all other qualifying students receive 25%.',
    quota100Label: '100% Quota (Max 1 Student):',
    quota50Label: '50% Quota (Max 1 or 2 Students):',
    quota25Label: '25% Quota (All Other Qualifying Students):',
    quotaRuleAlert: 'Notice: Exceeding the predefined tier quotas triggers an administrative warning.',
    autoAllocateBtn: 'Auto-Allocate Quota by Merit + Need',
    autoAllocateSuccess: 'Scholarships successfully allocated per the strict quota policy!',
    filterAll: 'All Students',
    filterPending: 'Pending',
    filterChecked: 'Checked',
    filterPublished: 'Published',
    studentNameCol: 'Student Name',
    rollIdCol: 'Unique ID',
    mustahiqIndexCol: 'Need & Emotional Drive',
    objectiveScoreCol: 'Objective Score',
    subjectiveScoreCol: 'Subjective Score',
    finalScoreCol: 'Final Percentage',
    scholarshipCol: 'Scholarship Award',
    statusCol: 'Status',
    actionsCol: 'Actions',
    gradeStudentBtn: 'Review & Grade',

    gradingStudioTitle: 'Grading Studio & Scholarship Determination',
    evaluatingStudent: 'Evaluating Candidate',
    studentNeedProfile: 'Socioeconomic & Deservingness Profile',
    needScoreLabel: 'Need Index (Deservingness Ratio)',
    preEmotionLabel: 'Pre-Test Mindset',
    incomeBracketLabel: 'Monthly Income',
    familyHardshipLabel: 'Personal Obstacle',
    aiAssistBtn: 'Gemini AI Assessment & Scoring',
    aiEvaluating: 'AI is evaluating...',
    scoreAwarded: 'Score Awarded',
    outOf: 'out of',
    feedbackRemarks: 'Instructor Comments & Encouragement',
    scholarshipTierSelection: 'Select Scholarship Award Category',
    publishResultBtn: 'Publish Official Result',
    saveChangesBtn: 'Save Grading Changes',
    backToDashboard: 'Back to Dashboard',
    quotaExceededWarning100: 'Warning: 100% Scholarship is strictly reserved for only 1 top student!',
    quotaExceededWarning50: 'Warning: 50% Scholarship is strictly limited to 1 or 2 students!',

    searchResultTitle: 'Results & Official Certification Portal',
    searchResultSubtitle: 'Enter your Unique ID to access your diagnostic marksheet and scholarship certificate',
    searchPlaceholder: 'Enter your student Unique ID (e.g. OMNI-101)',
    searchBtn: 'Search Result',
    noResultFound: 'No record found for this ID. Please ensure your Unique ID is accurate.',
    resultPublishedNotice: 'Your official scorecard and scholarship award have been approved.',
    resultPendingNotice: 'Your exam is currently under evaluation by the academic committee.',
    marksheetTitle: 'Multi-Dimensional Diagnostic Report',
    certificateTitle: 'Official Certificate of Scholarship Award',
    printCertificateBtn: 'Print / Download Certificate',
    scholarshipAwarded: 'Congratulations! You have been awarded:',
  },
};
