// =====================================================
// COLLEGE GITHUB COMMIT TRACKER - DATABASE SEED SCRIPT
// =====================================================
// Run this script to populate your MongoDB database with test data
// Total: 3 Departments | 9 Classes | 135 Students

const mongoose = require('mongoose');

// =====================================================
// DATABASE CONNECTION
// =====================================================
const MONGODB_URI = process.env.MONGODB_URI;

// =====================================================
// MONGOOSE SCHEMAS
// =====================================================

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const classSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  academicYear: { type: String, required: true },
  semester: { type: String, required: true },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  instructor: { type: String, default: '' },
  githubRepo: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  githubUsername: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  
  // GitHub Activity Data (will be populated by sync)
  totalCommits: { type: Number, default: 0 },
  lastSyncDate: { type: Date, default: null },
  repositories: [{
    name: String,
    fullName: String,
    language: String,
    commits: Number,
    updatedAt: Date
  }],
  
  // System Data
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  isActive: { type: Boolean, default: true },
  password: { type: String, required: true }, // Hash this in production!
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create indexes
studentSchema.index({ githubUsername: 1 });
studentSchema.index({ classId: 1 });
classSchema.index({ departmentId: 1 });

const Department = mongoose.model('Department', departmentSchema);
const Class = mongoose.model('Class', classSchema);
const Student = mongoose.model('Student', studentSchema);

// =====================================================
// SEED DATA
// =====================================================

const departmentsData = [
  {
    name: "BSc in Data Science",
    code: "BSCDA",
    description: "Advanced data analytics, machine learning, and statistical modeling"
  },
  {
    name: "Bachelor of Computer Application",
    code: "BCA",
    description: "Comprehensive computer applications, software development, and IT fundamentals"
  },
  {
    name: "BSc in Artificial Intelligence",
    code: "BSCAI",
    description: "AI systems, neural networks, deep learning, and intelligent automation"
  }
];

const classesData = [
  // BSc Data Science Classes
  { name: "BSc Data Science - Class of 2023", code: "BSCDA023", departmentCode: "BSCDA", academicYear: "2023", semester: "Final Year" },
  { name: "BSc Data Science - Class of 2024", code: "BSCDA024", departmentCode: "BSCDA", academicYear: "2024", semester: "Third Year" },
  { name: "BSc Data Science - Class of 2025", code: "BSCDA025", departmentCode: "BSCDA", academicYear: "2025", semester: "Second Year" },
  
  // Bachelor of Computer Application Classes
  { name: "Bachelor of Computer Application - Class of 2023", code: "BCA023", departmentCode: "BCA", academicYear: "2023", semester: "Final Year" },
  { name: "Bachelor of Computer Application - Class of 2024", code: "BCA024", departmentCode: "BCA", academicYear: "2024", semester: "Third Year" },
  { name: "Bachelor of Computer Application - Class of 2025", code: "BCA025", departmentCode: "BCA", academicYear: "2025", semester: "Second Year" },
  
  // BSc Artificial Intelligence Classes
  { name: "BSc Artificial Intelligence - Class of 2023", code: "BSCAI023", departmentCode: "BSCAI", academicYear: "2023", semester: "Final Year" },
  { name: "BSc Artificial Intelligence - Class of 2024", code: "BSCAI024", departmentCode: "BSCAI", academicYear: "2024", semester: "Third Year" },
  { name: "BSc Artificial Intelligence - Class of 2025", code: "BSCAI025", departmentCode: "BSCAI", academicYear: "2025", semester: "Second Year" }
];

const studentsData = [
  // BSCDA023 - Data Science 2023 (15 Students)
  { name: "Linus Torvalds", githubUsername: "torvalds", email: "linus.t@college.edu", classCode: "BSCDA023" },
  { name: "Evan You", githubUsername: "yyx990803", email: "evan.y@college.edu", classCode: "BSCDA023" },
  { name: "Dan Abramov", githubUsername: "gaearon", email: "dan.a@college.edu", classCode: "BSCDA023" },
  { name: "Ruan Yifeng", githubUsername: "ruanyf", email: "ruan.y@college.edu", classCode: "BSCDA023" },
  { name: "Zhihui Peng", githubUsername: "peng-zhihui", email: "zhihui.p@college.edu", classCode: "BSCDA023" },
  { name: "Gustavo Guanabara", githubUsername: "gustavoguanabara", email: "gustavo.g@college.edu", classCode: "BSCDA023" },
  { name: "Brad Traversy", githubUsername: "bradtraversy", email: "brad.t@college.edu", classCode: "BSCDA023" },
  { name: "Jake Wharton", githubUsername: "JakeWharton", email: "jake.w@college.edu", classCode: "BSCDA023" },
  { name: "Andrej Karpathy", githubUsername: "karpathy", email: "andrej.k@college.edu", classCode: "BSCDA023" },
  { name: "Rafaella Ballerini", githubUsername: "rafaballerini", email: "rafaella.b@college.edu", classCode: "BSCDA023" },
  { name: "Kyle Simpson", githubUsername: "getify", email: "kyle.s@college.edu", classCode: "BSCDA023" },
  { name: "Addy Osmani", githubUsername: "addyosmani", email: "addy.o@college.edu", classCode: "BSCDA023" },
  { name: "George Hotz", githubUsername: "geohot", email: "george.h@college.edu", classCode: "BSCDA023" },
  { name: "Siraj Raval", githubUsername: "llSourcell", email: "siraj.r@college.edu", classCode: "BSCDA023" },
  { name: "Michael Liao", githubUsername: "michaelliao", email: "michael.l@college.edu", classCode: "BSCDA023" },

  // BSCDA024 - Data Science 2024 (18 Students)
  { name: "Sindre Sorhus", githubUsername: "sindresorhus", email: "sindre.s@college.edu", classCode: "BSCDA024" },
  { name: "Kamran Ahmed", githubUsername: "kamranahmedse", email: "kamran.a@college.edu", classCode: "BSCDA024" },
  { name: "Donne Martin", githubUsername: "donnemartin", email: "donne.m@college.edu", classCode: "BSCDA024" },
  { name: "John Washam", githubUsername: "jwasham", email: "john.w@college.edu", classCode: "BSCDA024" },
  { name: "Vinta Chen", githubUsername: "vinta", email: "vinta.c@college.edu", classCode: "BSCDA024" },
  { name: "Oleksii Trekhleb", githubUsername: "trekhleb", email: "oleksii.t@college.edu", classCode: "BSCDA024" },
  { name: "Mike Bostock", githubUsername: "mbostock", email: "mike.b@college.edu", classCode: "BSCDA024" },
  { name: "Jeremy Ashkenas", githubUsername: "jashkenas", email: "jeremy.a@college.edu", classCode: "BSCDA024" },
  { name: "Jessica Lord", githubUsername: "jlord", email: "jessica.l@college.edu", classCode: "BSCDA024" },
  { name: "Mark Otto", githubUsername: "mdo", email: "mark.o@college.edu", classCode: "BSCDA024" },
  { name: "Douglas Crockford", githubUsername: "douglascrockford", email: "douglas.c@college.edu", classCode: "BSCDA024" },
  { name: "Mattt Thompson", githubUsername: "mattt", email: "mattt.t@college.edu", classCode: "BSCDA024" },
  { name: "Daniel Shiffman", githubUsername: "shiffman", email: "daniel.s@college.edu", classCode: "BSCDA024" },
  { name: "Chris Wanstrath", githubUsername: "defunkt", email: "chris.w@college.edu", classCode: "BSCDA024" },
  { name: "Paul Kinlan", githubUsername: "PaulKinlan", email: "paul.k@college.edu", classCode: "BSCDA024" },
  { name: "John-David Dalton", githubUsername: "jdalton", email: "jd.dalton@college.edu", classCode: "BSCDA024" },
  { name: "Hannah Wolfe", githubUsername: "ErisDS", email: "hannah.w@college.edu", classCode: "BSCDA024" },
  { name: "Max Ogden", githubUsername: "maxogden", email: "max.o@college.edu", classCode: "BSCDA024" },

  // BSCDA025 - Data Science 2025 (20 Students)
  { name: "Karan Goel", githubUsername: "karan", email: "karan.g@college.edu", classCode: "BSCDA025" },
  { name: "Leaf Corcoran", githubUsername: "leafo", email: "leaf.c@college.edu", classCode: "BSCDA025" },
  { name: "John Resig", githubUsername: "jeresig", email: "john.r@college.edu", classCode: "BSCDA025" },
  { name: "Sahat Yalkabov", githubUsername: "sahat", email: "sahat.y@college.edu", classCode: "BSCDA025" },
  { name: "Tim Oxley", githubUsername: "timoxley", email: "tim.o@college.edu", classCode: "BSCDA025" },
  { name: "Erik Michaels-Ober", githubUsername: "sferik", email: "erik.m@college.edu", classCode: "BSCDA025" },
  { name: "Paul Irish", githubUsername: "paulirish", email: "paul.i@college.edu", classCode: "BSCDA025" },
  { name: "Tom MacWright", githubUsername: "tmcw", email: "tom.m@college.edu", classCode: "BSCDA025" },
  { name: "John Papa", githubUsername: "johnpapa", email: "john.p@college.edu", classCode: "BSCDA025" },
  { name: "TJ Holowaychuk", githubUsername: "tj", email: "tj.h@college.edu", classCode: "BSCDA025" },
  { name: "Sebastian Raschka", githubUsername: "rasbt", email: "sebastian.r@college.edu", classCode: "BSCDA025" },
  { name: "Josh Long", githubUsername: "joshlong", email: "josh.l@college.edu", classCode: "BSCDA025" },
  { name: "Rodrigo Manguinho", githubUsername: "rmanguinho", email: "rodrigo.m@college.edu", classCode: "BSCDA025" },
  { name: "Anton Babenko", githubUsername: "antonbabenko", email: "anton.b@college.edu", classCode: "BSCDA025" },
  { name: "Jeff Heaton", githubUsername: "jeffheaton", email: "jeff.h@college.edu", classCode: "BSCDA025" },
  { name: "Ricardo Cabello", githubUsername: "mrdoob", email: "ricardo.c@college.edu", classCode: "BSCDA025" },
  { name: "Evan You", githubUsername: "EvanYou", email: "evanyou@college.edu", classCode: "BSCDA025" },
  { name: "Fengmk2", githubUsername: "fengmk2", email: "fengmk2@college.edu", classCode: "BSCDA025" },
  { name: "Jonathan Ong", githubUsername: "jonathanong", email: "jonathan.o@college.edu", classCode: "BSCDA025" },
  { name: "Ben Firshman", githubUsername: "bfirsh", email: "ben.f@college.edu", classCode: "BSCDA025" },

  // BCA023 - Computer Application 2023 (12 Students)
  { name: "Konstantin Haase", githubUsername: "rkh", email: "konstantin.h@college.edu", classCode: "BCA023" },
  { name: "Tom Preston-Werner", githubUsername: "mojombo", email: "tom.pw@college.edu", classCode: "BCA023" },
  { name: "Matthew Leibowitz", githubUsername: "mattleibow", email: "matthew.l@college.edu", classCode: "BCA023" },
  { name: "Dmitriy Zaporozhets", githubUsername: "NARKOZ", email: "dmitriy.z@college.edu", classCode: "BCA023" },
  { name: "Vladimir Iakovlev", githubUsername: "nvbn", email: "vladimir.i@college.edu", classCode: "BCA023" },
  { name: "Sean Larkin", githubUsername: "TheLarkInn", email: "sean.l@college.edu", classCode: "BCA023" },
  { name: "Hasin Hayder", githubUsername: "hasinhayder", email: "hasin.h@college.edu", classCode: "BCA023" },
  { name: "Anisul Islam", githubUsername: "anisul-Islam", email: "anisul.i@college.edu", classCode: "BCA023" },
  { name: "Jim Meng", githubUsername: "jimengIO", email: "jim.m@college.edu", classCode: "BCA023" },
  { name: "Ranga Karanam", githubUsername: "in28minutes", email: "ranga.k@college.edu", classCode: "BCA023" },
  { name: "Forrest Knight", githubUsername: "ForrestKnight", email: "forrest.k@college.edu", classCode: "BCA023" },
  { name: "Mustafa Cagri Guven", githubUsername: "mustafacagri", email: "mustafa.g@college.edu", classCode: "BCA023" },

  // BCA024 - Computer Application 2024 (16 Students)
  { name: "Brad Frost", githubUsername: "bradfrost", email: "brad.f@college.edu", classCode: "BCA024" },
  { name: "Soumith Chintala", githubUsername: "soumithchintala", email: "soumith.c@college.edu", classCode: "BCA024" },
  { name: "JD Han", githubUsername: "JaanaDogan", email: "jd.han@college.edu", classCode: "BCA024" },
  { name: "Yangshun Tay", githubUsername: "yangshun", email: "yangshun.t@college.edu", classCode: "BCA024" },
  { name: "Alexander Kuleshov", githubUsername: "akullpp", email: "alexander.k@college.edu", classCode: "BCA024" },
  { name: "Daniel Lo Nigro", githubUsername: "Daniel15", email: "daniel.l@college.edu", classCode: "BCA024" },
  { name: "Hakim El Hattab", githubUsername: "hakimel", email: "hakim.e@college.edu", classCode: "BCA024" },
  { name: "Amit Singh", githubUsername: "amitsingh-007", email: "amit.s@college.edu", classCode: "BCA024" },
  { name: "Ashish Bhatnagar", githubUsername: "ashishbhatnagar", email: "ashish.b@college.edu", classCode: "BCA024" },
  { name: "Rasmus Berg Palm", githubUsername: "rasmusbergpalm", email: "rasmus.p@college.edu", classCode: "BCA024" },
  { name: "Dead Horse", githubUsername: "dead-horse", email: "deadhorse@college.edu", classCode: "BCA024" },
  { name: "Tan Hae", githubUsername: "tanhae", email: "tan.h@college.edu", classCode: "BCA024" },
  { name: "Brian Caffo", githubUsername: "BCaffo", email: "brian.c@college.edu", classCode: "BCA024" },
  { name: "Robotic Cam", githubUsername: "roboticcam", email: "robotic.c@college.edu", classCode: "BCA024" },
  { name: "Tony Wu", githubUsername: "tony19", email: "tony.w@college.edu", classCode: "BCA024" },
  { name: "Taylor Dy", githubUsername: "taydy", email: "taylor.d@college.edu", classCode: "BCA024" },

  // BCA025 - Computer Application 2025 (14 Students)
  { name: "Hackstar SJ", githubUsername: "hackstarsj", email: "hackstar.sj@college.edu", classCode: "BCA025" },
  { name: "Carbo Kuo", githubUsername: "CarboKuo", email: "carbo.k@college.edu", classCode: "BCA025" },
  { name: "Forrest Knight 2", githubUsername: "ForrestKnight", email: "forrest2.k@college.edu", classCode: "BCA025" },
  { name: "Code Bullet", githubUsername: "Code-Bullet", email: "code.b@college.edu", classCode: "BCA025" },
  { name: "Peas", githubUsername: "peas", email: "peas@college.edu", classCode: "BCA025" },
  { name: "Qunar", githubUsername: "qunar", email: "qunar@college.edu", classCode: "BCA025" },
  { name: "GitButler App", githubUsername: "gitbutlerapp", email: "gitbutler@college.edu", classCode: "BCA025" },
  { name: "Vercel Team", githubUsername: "vercel", email: "vercel@college.edu", classCode: "BCA025" },
  { name: "Google Dev", githubUsername: "google", email: "google.dev@college.edu", classCode: "BCA025" },
  { name: "Apache Dev", githubUsername: "apache", email: "apache.dev@college.edu", classCode: "BCA025" },
  { name: "Facebook Dev", githubUsername: "facebook", email: "facebook.dev@college.edu", classCode: "BCA025" },
  { name: "Microsoft Dev", githubUsername: "Microsoft", email: "microsoft.dev@college.edu", classCode: "BCA025" },
  { name: "996 ICU", githubUsername: "996icu", email: "996icu@college.edu", classCode: "BCA025" },
  { name: "Trimstray", githubUsername: "trimstray", email: "trimstray@college.edu", classCode: "BCA025" },

  // BSCAI023 - Artificial Intelligence 2023 (10 Students)
  { name: "Linus AI", githubUsername: "torvalds", email: "linus.ai@college.edu", classCode: "BSCAI023" },
  { name: "Karpathy AI", githubUsername: "karpathy", email: "karpathy.ai@college.edu", classCode: "BSCAI023" },
  { name: "Siraj AI", githubUsername: "llSourcell", email: "siraj.ai@college.edu", classCode: "BSCAI023" },
  { name: "Geohot AI", githubUsername: "geohot", email: "geohot.ai@college.edu", classCode: "BSCAI023" },
  { name: "Sebastian ML", githubUsername: "rasbt", email: "sebastian.ml@college.edu", classCode: "BSCAI023" },
  { name: "Jeff ML", githubUsername: "jeffheaton", email: "jeff.ml@college.edu", classCode: "BSCAI023" },
  { name: "Soumith AI", githubUsername: "soumithchintala", email: "soumith.ai@college.edu", classCode: "BSCAI023" },
  { name: "Robotic ML", githubUsername: "roboticcam", email: "robotic.ml@college.edu", classCode: "BSCAI023" },
  { name: "Rasmus ML", githubUsername: "rasmusbergpalm", email: "rasmus.ml@college.edu", classCode: "BSCAI023" },
  { name: "Developer Roadmap", githubUsername: "developer-roadmap", email: "devroad@college.edu", classCode: "BSCAI023" },

  // BSCAI024 - Artificial Intelligence 2024 (13 Students)
  { name: "Free Code Camp", githubUsername: "freeCodeCamp", email: "freecode@college.edu", classCode: "BSCAI024" },
  { name: "Sphinx Doc", githubUsername: "sphinx-doc", email: "sphinx@college.edu", classCode: "BSCAI024" },
  { name: "Kamran ML", githubUsername: "kamranahmedse", email: "kamran.ml@college.edu", classCode: "BSCAI024" },
  { name: "Donne ML", githubUsername: "donnemartin", email: "donne.ml@college.edu", classCode: "BSCAI024" },
  { name: "John ML", githubUsername: "jwasham", email: "john.ml@college.edu", classCode: "BSCAI024" },
  { name: "Vinta ML", githubUsername: "vinta", email: "vinta.ml@college.edu", classCode: "BSCAI024" },
  { name: "Oleksii ML", githubUsername: "trekhleb", email: "oleksii.ml@college.edu", classCode: "BSCAI024" },
  { name: "Shiffman ML", githubUsername: "shiffman", email: "shiffman.ml@college.edu", classCode: "BSCAI024" },
  { name: "Mike ML", githubUsername: "mbostock", email: "mike.ml@college.edu", classCode: "BSCAI024" },
  { name: "Ricardo ML", githubUsername: "mrdoob", email: "ricardo.ml@college.edu", classCode: "BSCAI024" },
  { name: "Evan ML", githubUsername: "yyx990803", email: "evan.ml@college.edu", classCode: "BSCAI024" },
  { name: "Brad ML", githubUsername: "bradtraversy", email: "brad.ml@college.edu", classCode: "BSCAI024" },
  { name: "Dan ML", githubUsername: "gaearon", email: "dan.ml@college.edu", classCode: "BSCAI024" },

  // BSCAI025 - Artificial Intelligence 2025 (17 Students)
  { name: "Linus ML", githubUsername: "torvalds", email: "linus.ml@college.edu", classCode: "BSCAI025" },
  { name: "Gustavo ML", githubUsername: "gustavoguanabara", email: "gustavo.ml@college.edu", classCode: "BSCAI025" },
  { name: "Jake ML", githubUsername: "JakeWharton", email: "jake.ml@college.edu", classCode: "BSCAI025" },
  { name: "Rafaella ML", githubUsername: "rafaballerini", email: "rafaella.ml@college.edu", classCode: "BSCAI025" },
  { name: "Kyle ML", githubUsername: "getify", email: "kyle.ml@college.edu", classCode: "BSCAI025" },
  { name: "Addy ML", githubUsername: "addyosmani", email: "addy.ml@college.edu", classCode: "BSCAI025" },
  { name: "Michael ML", githubUsername: "michaelliao", email: "michael.ml@college.edu", classCode: "BSCAI025" },
  { name: "Sindre ML", githubUsername: "sindresorhus", email: "sindre.ml@college.edu", classCode: "BSCAI025" },
  { name: "Jeremy ML", githubUsername: "jashkenas", email: "jeremy.ml@college.edu", classCode: "BSCAI025" },
  { name: "Jessica ML", githubUsername: "jlord", email: "jessica.ml@college.edu", classCode: "BSCAI025" },
  { name: "Mark ML", githubUsername: "mdo", email: "mark.ml@college.edu", classCode: "BSCAI025" },
  { name: "Douglas ML", githubUsername: "douglascrockford", email: "douglas.ml@college.edu", classCode: "BSCAI025" },
  { name: "Mattt ML", githubUsername: "mattt", email: "mattt.ml@college.edu", classCode: "BSCAI025" },
  { name: "Chris ML", githubUsername: "defunkt", email: "chris.ml@college.edu", classCode: "BSCAI025" },
  { name: "Paul ML", githubUsername: "PaulKinlan", email: "paul.ml@college.edu", classCode: "BSCAI025" },
  { name: "Hannah ML", githubUsername: "ErisDS", email: "hannah.ml@college.edu", classCode: "BSCAI025" },
  { name: "Max ML", githubUsername: "maxogden", email: "max.ml@college.edu", classCode: "BSCAI025" }
];

// =====================================================
// SEEDING FUNCTION
// =====================================================

async function seedDatabase() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully!\n');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await Department.deleteMany({});
    await Class.deleteMany({});
    await Student.deleteMany({});
    console.log('✅ Existing data cleared\n');

    // =====================================================
    // STEP 1: Create Departments
    // =====================================================
    console.log('📚 Creating Departments...');
    const departments = await Department.insertMany(departmentsData);
    console.log(`✅ Created ${departments.length} departments`);
    departments.forEach(dept => {
      console.log(`   - ${dept.name} (${dept.code})`);
    });
    console.log('');

    // Create department lookup map
    const deptMap = {};
    departments.forEach(dept => {
      deptMap[dept.code] = dept._id;
    });

    // =====================================================
    // STEP 2: Create Classes
    // =====================================================
    console.log('🎓 Creating Classes...');
    const classesWithDeptIds = classesData.map(cls => ({
      ...cls,
      departmentId: deptMap[cls.departmentCode]
    }));
    
    const classes = await Class.insertMany(classesWithDeptIds);
    console.log(`✅ Created ${classes.length} classes`);
    
    // Group by department for display
    const classByDept = {};
    classes.forEach(cls => {
      const deptCode = classesData.find(c => c.code === cls.code).departmentCode;
      if (!classByDept[deptCode]) classByDept[deptCode] = [];
      classByDept[deptCode].push(cls);
    });
    
    Object.keys(classByDept).forEach(deptCode => {
      console.log(`   ${deptCode}:`);
      classByDept[deptCode].forEach(cls => {
        console.log(`      - ${cls.code} (${cls.semester})`);
      });
    });
    console.log('');

    // Create class lookup map
    const classMap = {};
    classes.forEach(cls => {
      classMap[cls.code] = cls._id;
    });

    // =====================================================
    // STEP 3: Create Students
    // =====================================================
    console.log('👨‍🎓 Creating Students...');
    
    // Default password for all students (hash this in production!)
    const defaultPassword = 'password123';
    
    const studentsWithClassIds = studentsData.map(student => ({
      ...student,
      classId: classMap[student.classCode],
      password: defaultPassword // In production, use bcrypt.hash()
    }));
    
    const students = await Student.insertMany(studentsWithClassIds);
    console.log(`✅ Created ${students.length} students`);
    
    // Group by class for display
    const studentsByClass = {};
    students.forEach(student => {
      const classCode = studentsData.find(s => s.email === student.email).classCode;
      if (!studentsByClass[classCode]) studentsByClass[classCode] = [];
      studentsByClass[classCode].push(student);
    });
    
    Object.keys(studentsByClass).forEach(classCode => {
      console.log(`   ${classCode}: ${studentsByClass[classCode].length} students`);
    });
    console.log('');

    // =====================================================
    // STEP 4: Summary Statistics
    // =====================================================
    console.log('📊 DATABASE SUMMARY:');
    console.log('='.repeat(50));
    console.log(`Total Departments: ${departments.length}`);
    console.log(`Total Classes: ${classes.length}`);
    console.log(`Total Students: ${students.length}`);
    console.log('='.repeat(50));
    console.log('');

    console.log('📋 BREAKDOWN BY DEPARTMENT:');
    for (const dept of departments) {
      const deptClasses = classes.filter(cls => 
        cls.departmentId.toString() === dept._id.toString()
      );
      const deptStudents = students.filter(student => 
        deptClasses.some(cls => cls._id.toString() === student.classId.toString())
      );
      console.log(`\n${dept.name} (${dept.code}):`);
      console.log(`  Classes: ${deptClasses.length}`);
      console.log(`  Students: ${deptStudents.length}`);
      deptClasses.forEach(cls => {
        const classStudents = students.filter(s => 
          s.classId.toString() === cls._id.toString()
        );
        console.log(`    - ${cls.code}: ${classStudents.length} students`);
      });
    }
    console.log('');

    // =====================================================
    // STEP 5: Sample Queries for Testing
    // =====================================================
    console.log('🔍 SAMPLE QUERIES FOR TESTING:');
    console.log('='.repeat(50));
    
    // Get all students in BSCDA024
    const bscda024Students = await Student.find({ 
      classId: classMap['BSCDA024'] 
    }).select('name githubUsername');
    console.log(`\n✅ Students in BSCDA024 (${bscda024Students.length}):`);
    bscda024Students.slice(0, 3).forEach(s => {
      console.log(`   - ${s.name} (@${s.githubUsername})`);
    });
    console.log('   ... and more');

    // Get all classes in BCA department
    const bcaDept = departments.find(d => d.code === 'BCA');
    const bcaClasses = await Class.find({ departmentId: bcaDept._id });
    console.log(`\n✅ Classes in BCA Department (${bcaClasses.length}):`);
    bcaClasses.forEach(cls => {
      console.log(`   - ${cls.code}: ${cls.name}`);
    });

    // Count students by academic year
    console.log('\n✅ Students by Academic Year:');
    for (const year of ['2023', '2024', '2025']) {
      const yearClasses = classes.filter(c => c.academicYear === year);
      const yearClassIds = yearClasses.map(c => c._id);
      const count = await Student.countDocuments({ 
        classId: { $in: yearClassIds } 
      });
      console.log(`   - Year ${year}: ${count} students`);
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ DATABASE SEEDED SUCCESSFULLY!');
    console.log('='.repeat(50));
    console.log('\n📝 DEFAULT LOGIN CREDENTIALS:');
    console.log('   Email: Any student email from above');
    console.log('   Password: password123');
    console.log('\n⚠️  IMPORTANT: Change passwords in production!\n');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// =====================================================
// RUN THE SEED SCRIPT
// =====================================================

seedDatabase()
  .then(() => {
    console.log('\n🎉 Seed script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Seed script failed:', error);
    process.exit(1);
  });