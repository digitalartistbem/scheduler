// State
let studentData = [];
let teacherData = [];
let teacherSelection = new Set(); // Stores indices of selected rows
let consultationBlocks = []; // Stores custom consultation hours
const daysMap = { "Monday": 1, "Tuesday": 2, "Wednesday": 3, "Thursday": 4, "Friday": 5, "Saturday": 6 };
const startHour = 7; // 7:00 AM

// Sample Data for testing
const sampleStudentData = `S-Code	Description	Lec Time	Lec Day	Lec Room	Lab Time	Lab Day	Lab Room	Section
IT101	Intro to Computing	08:00 AM - 09:00 AM	MTH	Rm101	09:00 AM - 10:30 AM	MTH	Lab1	IT1A
ENG1	Purposive Comm	01:00 PM - 02:30 PM	WS	Rm103	-	-	-	IT1A`;

const sampleTeacherData = `S-Code	Description	Lec Time	Lec Day	Lec Room	Lab Time	Lab Day	Lab Room	ins id	ins name	COURSE	block	capacity	Assigned Teacher
IT101	Intro to Computing	08:00 AM - 09:00 AM	MTH	Rm101	09:00 AM - 10:30 AM	MTH	Lab1	-	-	IT1A	A	40	Smith
CS102	Programming I	10:00 AM - 11:00 AM	TF	Rm102	11:00 AM - 12:30 PM	TF	Lab2	-	-	CS1A	A	40	Johnson
ENG1	Purposive Comm	01:00 PM - 02:30 PM	WS	Rm103	-	-	-	-	-	IT1A	A	50	Williams
MATH1	Calculus	07:30 AM - 09:00 AM	MTH	Rm104	-	-	-	-	-	CS1A	A	50	Brown
PHY1	Physics	02:00 PM - 03:00 PM	TF	Rm105	03:00 PM - 04:30 PM	TF	Lab3	-	-	IT1B	B	40	Davis`;

document.addEventListener('DOMContentLoaded', () => {
    loadSampleData(true); 
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

function loadSampleData(silent = false) {
    document.getElementById('teacher-data-input').value = sampleTeacherData;
    loadTeacherData(silent);
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

function loadTeacherData(silent = false) {
    const raw = document.getElementById('teacher-data-input').value.trim();
    teacherData = parseRawData(raw);
    teacherSelection.clear();
    consultationBlocks = [];
    
    populateFilters();
    renderTeacherView();
    updateStats();
    if (!silent) {
        alert("Master Data Loaded!");
        switchTab('teacher');
    }
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
