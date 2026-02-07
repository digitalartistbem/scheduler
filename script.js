// State
let studentData = [];
let teacherData = [];
let teacherSelection = new Set(); // Stores indices of selected rows
let consultationBlocks = []; // Stores custom consultation hours
const daysMap = { "Monday": 1, "Tuesday": 2, "Wednesday": 3, "Thursday": 4, "Friday": 5, "Saturday": 6 };
const startHour = 7; // 7:00 AM

// Sample Data for testing
const sampleStudentData = `S-Code	Description	Lec Time	Lec Day	Lec Room	Lab Time	Lab Day	Lab Room	Section
IT6203	DATABASE MANAGEMENT SYSTEM 2	8:30 AM - 9:30 AM	MTH	202	9:30 AM - 11:00 AM	MTH	SLAB4				
IT6206A	INFORMATION ASSURANCE AND SECURITY 2	10:00 AM - 11:00 AM	TF	202	11:00 AM - 12:30 AM	TF	SLAB4	IT22C
ITE6101	COMPUTER FUNDAMENTALS	7:00 - 8:00 AM	MTH	SLAB 4	8:00-9:30 AM	MTH	SLAB 4	IT11A
IT6317	IT MAJOR ELECTIVE 4 (WEB ENHANCED ANIMATION GRAPHICS)	2:00 PM - 3:00 PM	TF	203	3:00 PM - 4:30 PM	TF	SLAB4	IT22C`;

const sampleTeacherData = `S-Code	Description	Lec Time	Lec Day	Lec Room	Lab Time	Lab Day	Lab Room	ins id	ins name	COURSE	block	capacity	Assigned Teacher
IT6203	DATABASE MANAGEMENT SYSTEM 2	8:30 AM - 9:30 AM	MTH	202	9:30 AM - 11:00 AM	MTH	SLAB4	-	-	IT22C	-	48	-
IT6206A	INFORMATION ASSURANCE AND SECURITY 2 	10:00 AM - 11:00 AM	TF	202	11:00 AM - 12:30 AM	TF	SLAB4						
IT6317	IT MAJOR ELECTIVE 4 (WEB ENHANCED ANIMATION GRAPHICS)	2:00 PM - 3:00 PM	TF	203	3:00 PM - 4:30 PM	TF	SLAB4						
IT6224B	DATA COMMUCICATIONS AND NETWORKING 3	7:00 AM - 8:00 AM	WS	SLAB 4	8:00 AM - 9:30 AM	WS	SLAB 4						
IT6203	DATABASE MANAGEMENT SYSTEM 2	10:00 AM - 11:00 AM	WS	203	11:00 AM - 12:30 PM	WS	SLAB 4						
IT6206A	INFORMATION ASSURANCE AND SECURITY 2 	2:00 PM - 3:00 PM	WS	202	3:00 PM - 4:30 PM	WS	SLAB 4						
IT6317	IT MAJOR ELECTIVE 4 (WEB ENHANCED ANIMATION GRAPHICS)	8:30 AM - 9:30 AM	TF	202	9:30 AM - 11:00 AM	TF	SLAB 4						
IT6224B	DATA COMMUCICATIONS AND NETWORKING 3	8:30 AM - 9:30 AM	WS	204	9:30 AM - 11:00 AM	WS	SLAB 4						
ITE6301	TECHNOPRENEURSHIP	4:30-6:00P	MTH	SCLAB	-	-	-			-	CS42A	48	Sir Go
ITE6301	TECHNOPRENEURSHIP	4:30-6:00P	TF	215	-	-	-			-	IT41B	48	Sir Go
ITE6301	TECHNOPRENEURSHIP	4:30-6:00P	WS	214	-	-	-			-	IT41A	48	Sir Go
IT6203	Database Management. System 2	7:00-8:00A	MTH	SLAB1	8:00-9:30A	MTH	SLAB1			-	IT22C	48	Albarida
COMP6103	CURRENT TRENDS AND ISSUES	10:00-11:00A	MTH	110	12:00-1:30P	MTH	SLAB5			-	IT32C	48	Albarida
IT6311	IT MAJOR ELECTIVE 2 (NETWORK  INFRASTRUCURE & DIRECTORY SERVICES)	1:30-2:30P	MTH	301	3:00-4:30P	MTH	NLAB			-	IT32A	48	Albarida
ITE6101D 	Technopreneurship	7:30-9:00A	TF	207	-	-	-			-	HM12B	48	Albarida
CS6302	APPLICATION LIFE CYCLE MANAGEMENT	10:00-11:00A	TF	110	11:00-12:30P	TF	SLAB3			-	IT32C	48	Albarida
IT6205	Information Assurance and Security 1	12:30-1:30P	TF	107	1:30-3:00	TF	SLAB5			-	IT22C	48	Albarida
IT6205	Information Assurance and Security 1	9:00-10:00A	WS	210	10:30-12:00	WS	SLAB5			-	IT22B	48	Albarida
IT6311	IT MAJOR ELECTIVE 2 (NETWORK  INFRASTRUCURE & DIRECTORY SERVICES)	6:00-7:00P	MTH	103	7:30-9:00P	MTH	SLAB1			-	IT32B	48	Balili
IT6313	IT MAJOR ELECTIVE 4 (LINUX ADMINISTRATION)	6:00-7:00P	TF	214	7:30-9:00P	TF	SLAB2			-	IT41A	48	Balili
IT6311	IT MAJOR ELECTIVE 2 (NETWORK  INFRASTRUCURE & DIRECTORY SERVICES)	6:00-7:00P	WS	NLAB	7:00-8:30P	WS	NLAB			-	IT32D	48	Balili
CS6306	UNIFIED FUNCTIONAL TESTING	6:00-7:30P	MTH	SCLAB	-	-	-			-	CS42A	48	Capistrano
CS6306	UNIFIED FUNCTIONAL TESTING	6:00-7:00P	TF	215	7:00-8:30P	TF	SLAB5			-	IT41B	48	Capistrano
CS6306	UNIFIED FUNCTIONAL TESTING	6:00-7:00P	WS	214	7:30-9:00P	WS	SLAB3			-	IT41A	48	Capistrano
CS6300	SOFTWARE ENGINEERING 2	7:30-9:00A	MON	SCLAB	7:30-9:00A	THU	SCLAB			-	CS32A	48	Comaingking
ITE6104	Computer Programming 2	9:30-10:30A	MTH	SLAB 1	10:30-12:00P	MTH	SLAB 1			-	IT12F	48	Comaingking
ITE6104	Computer Programming 2	12:30-1:30	MTH	SLAB2	1:30-3:00	MTH	SLAB2			-	IT12D	48	Comaingking
IT6203	Database Management. System 2	8:00-9:00A	TF	209	9:30-11:00A	TF	SLAB1			-	IT22B	48	Comaingking
ITE6220	Information Management	11:00-12:00P	TF	110	12:00-1:30P	TF	SLAB2			-	IT22A	48	Comaingking
ITE6104	Computer Programming 2	7:30-8:30A	WS	SLAB5	8:30-10:00A	WS	SLAB5			-	IT12C	48	Comaingking
IT6203	Database Management. System 2	10:00-11:00A	WS	209	11:00-12:30P	WS	SLAB2			-	IT22F	48	Comaingking
ITE6101	COMPUTER FUNDAMENTALS	7:00 - 8:00 AM	MTH	SLAB 4	8:00-9:30 AM	MTH	SLAB 4						Dela Cerna
IT6302	INTEGRATIVE PROGRAMMING AND TECHNOLOGY 1	12:00-1:30P	MTH	111	-	-	-			-	IT32E	48	Dela Cerna
CS6302	APPLICATION LIFE CYCLE MANAGEMENT	1:30-2:30P	MTH	110	2:30-4:00P	MTH	SLAB1			-	IT32E	48	Dela Cerna
ITE6220	Information Management	4:30-5:30P	MTH	207	5:30-7:00P	MTH	SLAB1			-	IT22D	48	Dela Cerna
ITE6101D 	Technopreneurship	9:00-10:30A	TF	102A	-	-	-			-	HM12F	48	Dela Cerna
ITE6101D 	Technopreneurship	12:00-1:30P	TF	103A	-	-	-			-	HM12D	48	Dela Cerna
CS6302	APPLICATION LIFE CYCLE MANAGEMENT	3:00-4:00P	TF	103	4:00-5:30P	TF	SLAB1			-	IT32D	48	Dela Cerna
CS6302	APPLICATION LIFE CYCLE MANAGEMENT	6:00-7:00P	TF	103	7:00-8:30P	TF	SLAB1			-	IT32B	48	Dela Cerna
ITE6101	COMPUTER FUNDAMENTALS	5:30 PM - 6:30 PM	WS	SLAB 4	6:30 PM - 8:00 PM	WS	SLAB 4						Dela Cerna
ITE6200	Application Development and Emerging Technology	8:00-9:00A	TF	SLAB2	9:00-10:30A	TF	SLAB2			-	IT22A	48	Lehitimas
IT6317	IT MAJOR ELECTIVE 4 (WEB ENHANCED ANIMATION GRAPHICS)	6:30 PM - 7:30 PM	TF	SLAB 4	7:30 PM - 9:00 PM	TF	SLAB 4						Lehitimas
ITE6101D 	Technopreneurship	7:30-9:00A	WS	215	-	-	-			-	HM12E	48	Lehitimas
ITE6300	CLOUD COMPUTING AND THE INTERNET OF THINGS	10:00-11:00A	WS	107	11:00-12:30P	WS	SLAB1			-	IT32A	48	Lehitimas
IT6205	Information Assurance and Security 1	5:00-6:00P	WS	301	6:00-7:30P	WS	SLAB5			-	IT22D	48	Lehitimas
COMP6103	CURRENT TRENDS AND ISSUES	6:00-7:00P	MTH	111	7:00-8:30P	MTH	SLAB1			-	IT32A	48	Ostia
ITE6300	CLOUD COMPUTING AND THE INTERNET OF THINGS	6:00-7:00P	TF	102	7:00-8:30P	TF	SLAB3			-	IT32E	48	Ostia
ITE6300	CLOUD COMPUTING AND THE INTERNET OF THINGS	6:00-7:00P	WS	111	7:00-8:30P	WS	SLAB1			-	IT32B	48	Ostia
IT6223	Data Communications and Networking 2	12:00-1:00P	MTH	214	1:30-3:00P	MTH	NLAB			-	IT22H	48	Prudenciado
IT6223	Data Communications and Networking 2	3:00-4:00P	MTH	111	4:30-6:00P	MTH	NLAB			-	IT22C	48	Prudenciado
IT6300	DATA COMMUNICATIONS AND NETWORKING 4	6:00-7:00P	MTH	215	7:30-9:00P	MTH	NLAB			-	IT32D	48	Prudenciado
IT6301	SYSTEM ADMINISTRATION AND MAINTENANCE	1:30-2:30P	TF	301	3:00-4:30P	TF	NLAB			-	IT32A	48	Prudenciado
IT6302	INTEGRATIVE PROGRAMMING AND TECHNOLOGY 1	4:30-6:00P	TF	103	-	-	-			-	IT32C	48	Prudenciado
IT6301	SYSTEM ADMINISTRATION AND MAINTENANCE	6:00-7:00P	TF	NLAB	7:00-8:30P	TF	NLAB			-	IT32D	48	Prudenciado
IT6300	DATA COMMUNICATIONS AND NETWORKING 4	12:30-1:30P	WS	301	2:00-3:30P	WS	NLAB			-	IT32A	48	Prudenciado
IT6206A	INFORMATION ASSURANCE AND SECURITY 2 	3:30 PM - 4:30 PM	WS	203	4:30 PM - 6:00 PM	WS	SLAB 4						Prudenciado
IT6300	DATA COMMUNICATIONS AND NETWORKING 4	6:00-7:00P	WS	111	7:00-8:30P	WS	NLAB			-	IT32C	48	Prudenciado
ITE6104	Computer Programming 2	7:30-8:30A	MTH	SLAB 3	8:30-10:00A	MTH	SLAB 3			-	IT12B	48	Remedio
ITE6200	Application Development and Emerging Technology	10:00-11:00A	MTH	209	11:00-12:30P	MTH	SLAB2			-	IT22C	48	Remedio
ITE6200	Application Development and Emerging Technology	12:30-1:30P	MTH	110	2:00-3:30P	MTH	SLAB3			-	IT22D	48	Remedio
ITE6200	Application Development and Emerging Technology	7:00-8:00A	TF	SLAB3	8:00-9:30A	TF	SLAB3			-	IT22F	48	Remedio
CS6202 	Algorithms and Complexity	10:30-12:00P	TF	LINUX	-	-	-			-	CS22A	48	Remedio
ITE6220 	Information Management	8:00-9:00A	WS	SCLAB	9:00-10:30A	WS	SCLAB			-	CS22A	48	Remedio
ITE6300	CLOUD COMPUTING AND THE INTERNET OF THINGS	10:00-11:00A	WS	110	11:00-12:30P	WS	SLAB3			-	IT32C	48	Remedio
IT6205	Information Assurance and Security 1	7:30-8:30A	MTH	209	8:30-10:00A	MTH	SLAB5			-	IT22A	48	Tabasa
IT6324A	CS MAJOR ELECTIVE 2 	10:00A- 1:00P	SAT	SLAB3						-	CS32A	48	Tabasa
IT6325A	CS MAJOR ELECTIVE 4 	7:30-9:00P	TF	SCLAB						-	CS42A	48	Tabasa
ITE6220	Information Management	7:00-8:00A	WS	SLAB3	8:00-9:30A	WS	SLAB1			-	IT22F	48	Tabasa
IT6205	Information Assurance and Security 1	9:30-10:30A	MTH	106	10:30-12:00P	MTH	SLAB5			-	IT22F	48	Abanilla
CS6206	PRINCIPLES OPERATING SYSTEMS AND ITS APPLICATIONS	12:30 PM - 1: 30 PM	MTH	SLAB4	1:30 PM - 3:00 PM	MTH	SLAB4						Abanilla
ITE6220	Information Management	3:30-4:30P	MTH	105	4:30-6:00P	MTH	SLAB2			-	IT22B	48	Abanilla
IT6313	IT MAJOR ELECTIVE 4 (LINUX ADMINISTRATION)	6:00-7:00P	MTH	214	7:00-8:30P	MTH	SLAB3			-	IT41B	48	Abanilla
ITE6300	CLOUD COMPUTING AND THE INTERNET OF THINGS	9:00-10:30A	TUE	SCLAB	9:00-10:30A	FRI	SCLAB			-	CS32A	48	Abanilla
CS6302	APPLICATION LIFE CYCLE MANAGEMENT	10:30-12:00P	TUE	SCLAB	10:30-12:00P	FRI	SCLAB			-	CS32A	48	Abanilla
ITE6102A	COMPUTER PROGRAMMING 1	2:00 PM - 3:00 PM	MTH	202	3:00 PM - 4:30 PM	MTH	SLAB 4					50	CALIPAYAN
IT6301	SYSTEM ADMINISTRATION AND MAINTENANCE	5:00-6:00P	MTH	102	6:00-7:30P	MTH	SLAB5			-	IT32E	48	CALIPAYAN
IT6223	Data Communications and Networking 2	9:30-10:30A	TF	209	10:30-12:00P	TF	SLAB5			-	IT22F	48	CALIPAYAN
IT6300	DATA COMMUNICATIONS AND NETWORKING 4	12:00-1:00P	TF	215	1:30-3:00P	TF	NLAB			-	IT32E	48	CALIPAYAN
IT6203	Database Management. System 2	3:00-4:00P	TF	106	4:00-5:30P	TF	SLAB3			-	IT22D	48	CALIPAYAN
COMP6103	CURRENT TRENDS AND ISSUES	3:00-4:00P	WS	SLAB1	4:00-5:30P	WS	SLAB3			-	IT32E	48	CALIPAYAN
CS6306	PRINCIPLES OF OPERATING SYSTEM & ITS APPLICATIONS	9:00-10:30A	MON	SCLAB	9:00-10:30A	THU	SCLAB			-	CS32A	48	Dada
IT6223	Data Communications and Networking 2	11:00-12:00P	MTH	NLAB	12:00-1:30P	MTH	NLAB			-	IT22A	48	Dada
IT6311	IT MAJOR ELECTIVE 2 (NETWORK  INFRASTRUCURE & DIRECTORY SERVICES)	1:30-2:30P	MTH	101	2:30-4:00P	MTH	SLAB5			-	IT32C	48	Dada
ITE6102A	COMPUTER PROGRAMMING 1	4:00 PM - 5:00 PM	MTH	201	5:30 PM - 7:00 PM	MTH	SLAB 4						Dada
IT6224B	DATA COMMUCICATIONS AND NETWORKING 3	7:00 AM - 8:00 AM	TF	SLAB4	8:00 AM - 9:30 AM	TF	SLAB4						Dada
IT6223	Data Communications and Networking 2	9:30-10:30A	TF	NLAB	10:30-12:00P	TF	NLAB			-	IT22D	48	Dada
IT6302	INTEGRATIVE PROGRAMMING AND TECHNOLOGY 1	1:30-3:00P	TF	111	-	-	-			-	IT32D	48	Dada
CS6206	PRINCIPLES OPERATING SYSTEMS AND ITS APPLICATIONS	4:00 PM - 5:00 PM	TF	202	5:00 PM - 6:30 PM	TF	SLAB 4						Dada
IT6203	Database Management. System 2	8:00-9:00A	WS	209	9:30-11:00	WS	SLAB1			-	IT22A	48	Dada
IT6223 	Data Communications and Networking 2	11:00-12:00P	WS	NLAB	12:00-1:30	WS	NLAB			-	CS22A	48	Dada
IT6300	DATA COMMUNICATIONS AND NETWORKING 4	3:00-4:00P	WS	301	4:30-6:00P	WS	NLAB			-	IT32B	48	Dada
IT6311	IT MAJOR ELECTIVE 2 (NETWORK  INFRASTRUCURE & DIRECTORY SERVICES)	6:00-7:00P	WS	301	7:30-9:00P	WS	SLAB5			-	IT32E	48	Dada
IT6201A 	Database Management System	12:00-1:30P	MTH	101	1:30-3:00P	MTH	SLAB5			-	B22A	48	Francisco
IT6399	IT CAPSTONE PROJECT 2	4:30-6:00P	MTH	214						-	IT41B	48	Francisco
CS6399	CS DESIGN PROJECT 2	7:30-9:00P	MTH	SCLAB						-	CS42A	48	Francisco
CS6302	APPLICATION LIFE CYCLE MANAGEMENT	10:00-11:00A	TF	107	11:00-12:30P	TF	SLAB1			-	IT32A	48	Francisco
CS6206	PRINCIPLES OPERATING SYSTEMS AND ITS APPLICATIONS	12:30 PM - 1:30 PM	TF	203	1:30 PM - 3:00 PM	TF	SLAB 4						Francisco
ITE6220	Information Management	8:00-9:00A	WS	SLAB3	9:00-10:30A	WS	SLAB3			-	IT22C	48	Francisco
ITE6101D 	Technopreneurship	10:30-12:00P	WS	103	-	-	-			-	HM12J	48	Francisco
ITE6101D 	Technopreneurship	1:30-3:00P	WS	105	-	-	-			-	HM12C	48	Francisco
IT6399	IT CAPSTONE PROJECT 2	6:00-9:00P	S	214						-	IT41A	48	Francisco
IT6202 	Database Management System 1	12:30-1:30P	MTH	SCLAB	1:30-3:00P	MTH	SCLAB			-	CS22A	48	Gelicame
ITE6300	CLOUD COMPUTING AND THE INTERNET OF THINGS	3:00-4:00P	MTH	103	4:00-5:30P	MTH	SLAB3			-	IT32D	48	Gelicame
ITE6104	Computer Programming 2	6:30-7:30P	MTH	SLAB2	7:30-9:00P	MTH	SLAB2			-	IT12E	48	Gelicame
ITE6200	Application Development and Emerging Technology	11:30-12:30P	TF	209	12:30-2:00P	TF	SLAB3			-	IT22H	48	Gelicame
IT6205	Information Assurance and Security 1	2:00-3:00P	TF	105	3:00-4:30P	TF	SLAB5			-	IT22H	48	Gelicame
ITE6220	Information Management	4:30-5:30P	TF	208	5:30-7:00P	TF	SLAB3			-	IT22H	48	Gelicame
ITE6101D 	Technopreneurship	9:00-10:30A	WS	102A	-	-	-			-	HM12A	48	Gelicame
ITE6101D 	Technopreneurship	4:30-6:00P	WS	101	-	-	-			-	HM12K	48	Gelicame
IT6201A 	Database Management System	6:00-7:30P	WS	208	7:30-9:00P	WS	SHSCL1			-	B22C	48	Gelicame
ITE6104 	Computer Programming 2	8:30-9:30A	MTH	110	9:30-11:00A	MTH	SLAB2			-	CS12A	48	Medio
ITE6104	Computer Programming 2	12:30-1:30P	MTH	209	3:00-4:30P	MTH	SLAB2			-	IT12I	48	Medio
IT6203	Database Management. System 2	4:30-5:30P	MTH	105	5:30-7:00P	MTH	SLAB3			-	IT22H	48	Medio
IT6201A 	Database Management System	9:00-10:30A	TF	103	12:00-1:30P	TF	SLAB5			-	B22B	48	Medio
IT6302	INTEGRATIVE PROGRAMMING AND TECHNOLOGY 1	1:30-3:00P	TF	110	-	-	-			-	IT32B	48	Medio
IT6301	SYSTEM ADMINISTRATION AND MAINTENANCE	3:30-4:30P	TF	301	4:30-6:00P	TF	NLAB			-	IT32B	48	Medio
ITE6104	Computer Programming 2	8:00-9:00	WS	214	9:30-11:00A	WS	SLAB2			-	IT12A	48	Medio
IT6203	DATABASE MANAGEMENT SYSTEM 2	12:30 PM - 1:30 PM	WS	SLAB 4	1:30 PM - 3:00 PM	WS	SLAB 4						Medio
IT6302	INTEGRATIVE PROGRAMMING AND TECHNOLOGY 1	4:30-6:00P	WS	110	-	-	-			-	IT32A	48	Medio
ITE6200	Application Development and Emerging Technology	10:00-11:00A	MTH	SLAB3	11:00-12:30P	MTH	SLAB3			-	IT22B	48	Pacifico
ITE6101D 	Technopreneurship	1:30-3:00P	MTH	207	-	-	-			-	HM12I	48	Pacifico
COMP6103	CURRENT TRENDS AND ISSUES	3:00-4:00P	MTH	205	4:00-5:30P	MTH	SLAB1			-	IT32B	48	Pacifico
IT6301	SYSTEM ADMINISTRATION AND MAINTENANCE	12:30-1:30P	TF	SLAB1	3:00-4:30P	TF	SLAB1			-	IT32C	48	Pacifico
IT6223	Data Communications and Networking 2	12:00-1:00P	WS	301	1:30-3:00P	WS	NLAB			-	IT22B	48	Pacifico
COMP6103	CURRENT TRENDS AND ISSUES	3:00-4:00P	WS	110	4:00-5:30P	WS	SLAB1			-	IT32D	48	Pacifico
ITE6101D 	Technopreneurship	6:00-7:30P	WS	103A	-	-	-			-	HM12H	48	Pacifico`;

document.addEventListener('DOMContentLoaded', () => {
    loadSampleData(); 
});

function switchTab(tabName) {
    document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tabs button').forEach(el => el.classList.remove('active'));
    
    document.getElementById(`${tabName}-view`).classList.add('active');
    // Find button with onclick containing the tabName and add active class
    const btns = document.querySelectorAll('.tabs button');
    btns.forEach(btn => {
        if(btn.getAttribute('onclick').includes(tabName)) btn.classList.add('active');
    });
}

function loadSampleData() {
    document.getElementById('teacher-data-input').value = sampleTeacherData;
    loadTeacherData();
}

function parseRawData(raw) {
    if (!raw) return alert("Please enter data");

    const lines = raw.split('\n');
    // Detect delimiter: Tab for copy-paste from Excel/Text, Comma for CSV
    const delimiter = lines[0].includes('\t') ? '\t' : ',';
    const headers = lines[0].split(delimiter).map(h => h.trim());
    
    const parsed = [];

    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const row = lines[i].split(delimiter);

        let obj = {};
        // Map known headers from input to internal keys
        const mapKeys = {
            "S-Code": "SCode", "SCode": "SCode",
            "Description": "Description",
            "Lec Time": "LecTime", "LecTime": "LecTime",
            "Lec Day": "LecDay", "LecDay": "LecDay",
            "Lec Room": "LecRoom", "LecRoom": "LecRoom",
            "Lab Time": "LabTime", "LabTime": "LabTime",
            "Lab Day": "LabDay", "LabDay": "LabDay",
            "Lab Room": "LabRoom", "LabRoom": "LabRoom",
            "block": "Section", "Section": "Section",
            "ins name": "Instructor", "Instructor": "Instructor", 
            "Assigned Teacher": "Instructor",
            "Capacity": "Capacity",
            "capacity": "Capacity"
        };

        headers.forEach((h, index) => {
            const val = row[index] ? row[index].trim() : "";
            const key = mapKeys[h] || h;
            obj[key] = val;
        });
        
        if (obj.SCode) parsed.push(obj);
    }
    return parsed;
}

function loadStudentData() {
    const raw = document.getElementById('student-data-input').value.trim();
    studentData = parseRawData(raw);
    if(studentData) {
        renderStudentView();
        alert("Student Data Loaded!");
        switchTab('student');
    }
}

function loadSampleStudentData() {
    document.getElementById('student-data-input').value = sampleStudentData;
    loadStudentData();
}

function loadStudentTemplate() {
    document.getElementById('student-data-input').value = `S-Code	Description	Lec Time	Lec Day	Lec Room	Lab Time	Lab Day	Lab Room	Section`;
}

function loadTeacherTemplate() {
    document.getElementById('teacher-data-input').value = `S-Code	Description	Lec Time	Lec Day	Lec Room	Lab Time	Lab Day	Lab Room	ins id	ins name	COURSE	block	capacity	Assigned Teacher`;
}

function loadTeacherData() {
    const raw = document.getElementById('teacher-data-input').value.trim();
    teacherData = parseRawData(raw);
    teacherSelection.clear();
    consultationBlocks = [];
    
    populateFilters();
    renderTeacherView();
    updateStats();
    alert("Master Data Loaded!");
    switchTab('teacher');
}

// --- Student View Logic ---

function renderStudentView() {
    renderGrid(studentData, 'student-grid');
}

function renderGrid(data, elementId) {
    const grid = document.getElementById(elementId);
    if (!grid) return;
    grid.innerHTML = '';

    // 1. Create Background Grid & Time Labels
    // 30 rows (15 hours * 2 slots per hour) - 7:00 AM to 10:00 PM
    for (let i = 0; i < 30; i++) {
        // Time Label (Column 1)
        const timeDiv = document.createElement('div');
        timeDiv.className = 'time-slot';
        timeDiv.style.gridRow = `${i + 1} / span 1`;
        
        // Calculate time string
        const hour = Math.floor(i / 2) + startHour;
        const min = (i % 2) === 0 ? "00" : "30";
        
        // 12-Hour Format
        const displayHour = hour > 12 ? hour - 12 : hour;
        const ampm = hour >= 12 ? 'PM' : 'AM';
        timeDiv.innerText = `${displayHour}:${min} ${ampm}`;
        grid.appendChild(timeDiv);

        // Empty Grid Cells for columns 2-7
        for (let d = 0; d < 6; d++) {
            const cell = document.createElement('div');
            cell.className = 'grid-line';
            cell.style.gridRow = `${i + 1} / span 1`;
            cell.style.gridColumn = `${d + 2} / span 1`;
            grid.appendChild(cell);
        }
    }

    // 2. Place Classes
    // Render Consultation Blocks (only for teacher grid)
    if (elementId === 'teacher-grid') {
        consultationBlocks.forEach(block => {
            placeBlock(grid, block.day, block.timeStr, { SCode: "CONSULTATION", Description: "Office Hours", LecRoom: "Office" }, "CONSULT", "#f39c12");
        });
    }

    data.forEach(item => {
        const color = stringToColor(item.SCode);

        // Render Lecture
        if (item.LecDay && item.LecTime) {
            const days = parseDays(item.LecDay);
            days.forEach(day => {
                placeBlock(grid, day, item.LecTime, item, "LEC", color);
            });
        }
        // Render Lab
        if (item.LabDay && item.LabTime) {
            const days = parseDays(item.LabDay);
            days.forEach(day => {
                placeBlock(grid, day, item.LabTime, item, "LAB", color);
            });
        }
    });
}

function placeBlock(grid, dayStr, timeStr, item, type, color) {
    const dayIndex = daysMap[dayStr];
    if (!dayIndex) return;

    const { startRow, span } = parseTimeRange(timeStr);
    
    if (!startRow || startRow < 1 || !span || span <= 0) return;
    if (startRow + span > 32) return; // Safety check to prevent huge blocks from breaking layout

    const block = document.createElement('div');
    block.className = 'class-block';
    block.style.backgroundColor = color;
    block.style.gridColumn = `${dayIndex + 1} / span 1`; // +1 because col 1 is time
    block.style.gridRow = `${startRow} / span ${span}`;
    block.title = `${item.SCode} | ${timeStr} | ${item.LecRoom || item.LabRoom}`;
    
    const room = type === "LEC" ? item.LecRoom : item.LabRoom;
    
    block.innerHTML = `
        <strong>${item.SCode} (${type})</strong>
        <span>${item.Description}</span>
        <span>${room} | Sec: ${item.Section}</span>
    `;
    
    grid.appendChild(block);
}

function parseDays(dayStr) {
    if (!dayStr || dayStr === '-') return [];
    const upper = dayStr.toUpperCase().trim();
    
    // Specific codes from your data
    if (upper === 'MTH') return ['Monday', 'Thursday'];
    if (upper === 'TF') return ['Tuesday', 'Friday'];
    if (upper === 'WS') return ['Wednesday', 'Saturday'];
    if (upper === 'SAT' || upper === 'S') return ['Saturday'];
    
    // Standard codes
    const days = [];
    if (upper.includes('MON') || upper.includes('M') && !upper.includes('MTH')) days.push('Monday');
    if (upper.includes('TUE') || (upper.includes('T') && !upper.includes('TH') && !upper.includes('TF'))) days.push('Tuesday');
    if (upper.includes('WED') || upper.includes('W') && !upper.includes('WS')) days.push('Wednesday');
    if (upper.includes('THU') || upper.includes('TH') && !upper.includes('MTH')) days.push('Thursday');
    if (upper.includes('FRI') || upper.includes('F') && !upper.includes('TF')) days.push('Friday');
    
    // Fallback for explicit single codes if logic above missed
    if (days.length === 0) {
        if (upper === 'MON') return ['Monday'];
        if (upper === 'TUE') return ['Tuesday'];
        if (upper === 'WED') return ['Wednesday'];
        if (upper === 'THU') return ['Thursday'];
        if (upper === 'FRI') return ['Friday'];
    }
    
    return days;
}

function parseTimeRange(timeStr) {
    if (!timeStr || timeStr === '-' || timeStr === ' ') return {};

    // Normalize input: "8:30 AM - 9:30 AM" -> "8:30AM-9:30AM"
    let clean = timeStr.toUpperCase().replace(/\s+/g, '');
    // Handle "TO" or "-"
    let parts = clean.split('-');
    if (parts.length < 2) parts = clean.split('–'); // Handle en-dash
    if (parts.length < 2) parts = clean.split('—'); // Handle em-dash
    if (parts.length < 2) parts = clean.split('TO');
    if (parts.length < 2) return {};

    // Check for explicit AM/PM in the raw parts before parsing
    const startHasAM = parts[0].includes('A');
    const startHasPM = parts[0].includes('P');

    const start = parseTimeStr(parts[0]);
    const end = parseTimeStr(parts[1]);

    if (!start || !end) return {};

    let startRow = ((start.h - startHour) * 2) + (start.m >= 30 ? 1 : 0) + 1;
    let endRow = ((end.h - startHour) * 2) + (end.m >= 30 ? 1 : 0) + 1;

    // Fix for missing PM on end time (e.g. "5:30 PM - 8:30" -> assume 8:30 PM)
    if (endRow < startRow) {
        endRow += 24; // Add 12 hours (24 slots)
    }

    let span = endRow - startRow;
    
    // Correction logic for "7:30-9:00P" interpreted as 7:30AM-9:00PM
    // If start has no explicit AM/PM, and the duration is suspiciously long (> 5 hours),
    // and shifting start to PM makes it a reasonable duration (< 6 hours), do it.
    if (!startHasAM && !startHasPM && span > 10) { 
        // Try adding 12 hours to start (shift to PM)
        const newStartH = start.h + 12;
        const newStartRow = ((newStartH - startHour) * 2) + (start.m >= 30 ? 1 : 0) + 1;
        const newSpan = endRow - newStartRow;
        
        if (newSpan > 0 && newSpan <= 12) { // Valid short duration
             startRow = newStartRow;
        }
    }
    
    return { startRow, span: endRow - startRow };
}

function parseTimeStr(tStr) {
    // tStr: "8:30AM", "4:30P", "12:30"
    let isPM = tStr.includes('P');
    let isAM = tStr.includes('A');
    let raw = tStr.replace('.', ':').replace(/[^0-9:]/g, '');
    
    let [h, m] = raw.split(':').map(Number);
    if (isNaN(h)) return null;
    if (isNaN(m)) m = 0;

    // Heuristic for missing AM/PM
    if (!isPM && !isAM) {
        if (h >= 7 && h <= 11) isAM = true;
        else if (h === 12 || (h >= 1 && h <= 6)) isPM = true;
    }

    // Fix for 12:xx AM typo (common in some systems to mean noon)
    if (isAM && h === 12) {
        isAM = false;
        isPM = true;
    }

    if (isPM && h !== 12) h += 12;
    if (isAM && h === 12) h = 0;

    return { h, m };
}

// --- Teacher View Logic ---

function populateFilters() {
    const daySelect = document.getElementById('teacher-day-filter');
    const subjSelect = document.getElementById('teacher-subject-filter');
    
    // Reset
    daySelect.innerHTML = '<option value="all">All Days</option>';
    subjSelect.innerHTML = '<option value="all">All Subjects</option>';

    // Days
    Object.keys(daysMap).forEach(day => {
        const opt = document.createElement('option');
        opt.value = day;
        opt.innerText = day;
        daySelect.appendChild(opt);
    });

    // Subjects (Unique)
    const subjects = [...new Set(teacherData.map(i => i.SCode))];
    subjects.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s;
        opt.innerText = s;
        subjSelect.appendChild(opt);
    });
}

function renderTeacherView() {
    const dayFilter = document.getElementById('teacher-day-filter').value;
    const subjFilter = document.getElementById('teacher-subject-filter').value;
    const unassignedOnly = document.getElementById('teacher-unassigned-filter').checked;
    const container = document.getElementById('teacher-results');

    let html = `<table>
        <thead>
            <tr>
                <th>Select</th>
                <th>Code</th>
                <th>Description</th>
                <th>Type</th>
                <th>Day</th>
                <th>Time</th>
                <th>Room</th>
                <th>Instructor</th>
                <th>Cap</th>
                <th>Section</th>
                <th>Hrs</th>
            </tr>
        </thead>
        <tbody>`;

    teacherData.forEach((item, index) => {
        // Filter Unassigned
        if (unassignedOnly && item.Instructor && item.Instructor.trim() !== '' && item.Instructor !== '-') return;

        // Check Lecture
        if (item.LecDay) {
            if ((dayFilter === 'all' || dayFilter === item.LecDay) && 
                (subjFilter === 'all' || subjFilter === item.SCode)) {
                const hrs = calculateHours(item.LecTime);
                html += createRow(item, index, 'LEC', item.LecDay, item.LecTime, item.LecRoom, hrs);
            }
        }
        // Check Lab
        if (item.LabDay) {
            if ((dayFilter === 'all' || dayFilter === item.LabDay) && 
                (subjFilter === 'all' || subjFilter === item.SCode)) {
                const hrs = calculateHours(item.LabTime);
                html += createRow(item, index, 'LAB', item.LabDay, item.LabTime, item.LabRoom, hrs);
            }
        }
    });

    html += `</tbody></table>`;
    container.innerHTML = html;
}

function createRow(item, index, type, day, time, room, hrs) {
    const isChecked = teacherSelection.has(index) ? 'checked' : '';
    return `<tr>
        <td><input type="checkbox" data-index="${index}" ${isChecked} onchange="toggleTeacherSelection(this, ${index})"></td>
        <td>${item.SCode}</td>
        <td>${item.Description}</td>
        <td>${type}</td>
        <td>${day}</td>
        <td>${time}</td>
        <td>${room}</td>
        <td>${item.Instructor || '-'}</td>
        <td>${item.Capacity || '-'}</td>
        <td>${item.Section}</td>
        <td>${hrs.toFixed(1)}</td>
    </tr>`;
}

function toggleTeacherSelection(checkbox, index) {
    if (checkbox.checked) {
        teacherSelection.add(index);
    } else {
        teacherSelection.delete(index);
    }
    
    // Sync UI for other rows representing the same data item (e.g. Lab vs Lec)
    document.querySelectorAll(`input[data-index="${index}"]`).forEach(el => {
        el.checked = checkbox.checked;
    });
    updateStats();
}

function viewTeacherSchedule() {
    const selectedData = teacherData.filter((_, index) => teacherSelection.has(index));
    
    if (selectedData.length === 0) {
        alert("Please select at least one subject first.");
        return;
    }

    document.getElementById('teacher-search-area').style.display = 'none';
    document.getElementById('teacher-schedule-area').style.display = 'block';
    renderConsultationList();
    
    renderGrid(selectedData, 'teacher-grid');
}

function backToTeacherSearch() {
    document.getElementById('teacher-search-area').style.display = 'block';
    document.getElementById('teacher-schedule-area').style.display = 'none';
}

// --- Stats & Consultation ---

function calculateHours(timeStr) {
    const { span } = parseTimeRange(timeStr);
    if (!span || span <= 0) return 0;
    return span / 2; // span is in 30min blocks
}

function updateStats() {
    let teachingHrs = 0;
    teacherSelection.forEach(index => {
        const item = teacherData[index];
        if (item.LecTime) teachingHrs += calculateHours(item.LecTime);
        if (item.LabTime) teachingHrs += calculateHours(item.LabTime);
    });

    let consultHrs = 0;
    consultationBlocks.forEach(block => {
        consultHrs += calculateHours(block.timeStr);
    });

    const total = teachingHrs + consultHrs;

    document.getElementById('stat-teaching').innerText = teachingHrs.toFixed(1);
    document.getElementById('stat-consult').innerText = consultHrs.toFixed(1);
    document.getElementById('stat-total').innerText = total.toFixed(1);

    const statusEl = document.getElementById('stat-status');
    const msgEl = document.getElementById('stat-msg');
    const card = statusEl.parentElement;

    card.className = 'stat-card'; // reset
    if (total < 30) {
        statusEl.innerText = "Low Load";
        msgEl.innerText = `Need ${(30 - total).toFixed(1)} more hours`;
        card.classList.add('warning');
    } else if (total <= 40) {
        statusEl.innerText = "Standard Load";
        msgEl.innerText = `Target met. ${(40 - total).toFixed(1)} to max.`;
        card.classList.add('success');
    } else {
        statusEl.innerText = "Overload";
        msgEl.innerText = `${(total - 40).toFixed(1)} hours overload`;
        card.classList.add('warning');
    }
}

function addConsultation() {
    const day = document.getElementById('consult-day').value;
    const start = document.getElementById('consult-start').value;
    const end = document.getElementById('consult-end').value;

    if (!start || !end) return;

    // Convert 24h input to 12h format for display/parsing consistency
    const formatTime = (t) => {
        let [h, m] = t.split(':').map(Number);
        const ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
        return `${h}:${m < 10 ? '0'+m : m} ${ampm}`;
    };

    const timeStr = `${formatTime(start)} - ${formatTime(end)}`;
    consultationBlocks.push({ day, timeStr });
    renderConsultationList();
    updateStats();
    renderGrid(teacherData.filter((_, i) => teacherSelection.has(i)), 'teacher-grid');
}

function renderConsultationList() {
    const list = document.getElementById('consult-list-ul');
    list.innerHTML = '';
    consultationBlocks.forEach((block, index) => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${block.day} ${block.timeStr}</span> <button onclick="deleteConsultation(${index})">Delete</button>`;
        list.appendChild(li);
    });
}

function deleteConsultation(index) {
    consultationBlocks.splice(index, 1);
    updateStats();
    renderConsultationList();
    renderGrid(teacherData.filter((_, i) => teacherSelection.has(i)), 'teacher-grid');
}

// --- Utilities ---

function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Generate HSL color for better aesthetics (pastel-ish)
    // Use golden ratio to spread colors more evenly to avoid collisions
    const h = Math.floor(Math.abs(hash * 137.508) % 360);
    return `hsl(${h}, 65%, 45%)`;
}
