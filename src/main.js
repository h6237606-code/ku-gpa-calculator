import './style.css'

// Grade to Point Value Mapping
const GRADE_POINTS = {
  'A+': 4.5,
  'A': 4.0,
  'B+': 3.5,
  'B': 3.0,
  'C+': 2.5,
  'C': 2.0,
  'D+': 1.5,
  'D': 1.0,
  'F': 0.0
};

// Semesters list in chronological order
const SEMESTERS = ['1-1', '1-2', '2-1', '2-2', '3-1', '3-2', '4-1', '4-2'];

const SEMESTER_LABELS = {
  '1-1': '1학년 1학기',
  '1-2': '1학년 2학기',
  '2-1': '2학년 1학기',
  '2-2': '2학년 2학기',
  '3-1': '3학년 1학기',
  '3-2': '3학년 2학기',
  '4-1': '4학년 1학기',
  '4-2': '4학년 2학기'
};

// Graduation Credits Target
const GRADUATION_CREDITS_TARGET = 130;

// Core DOM Elements
const courseRowsContainer = document.getElementById('course-rows');
const btnAddRow = document.getElementById('btn-add-row');
const btnCalculate = document.getElementById('btn-calculate');
const btnReset = document.getElementById('btn-reset');

const gpaValEl = document.getElementById('gpa-val');
const gpaProgressCircle = document.getElementById('gpa-progress-circle');
const gpaRadialWrapper = gpaProgressCircle.closest('.gpa-radial-wrapper');
const gpaFeedbackText = document.getElementById('gpa-feedback-text');

const totalCreditsValEl = document.getElementById('total-credits-val');
const creditProgressBar = document.getElementById('credit-progress-bar');
const creditPercentValEl = document.getElementById('credit-percent-val');
const creditBarContainer = creditProgressBar.closest('.credit-bar-container');

const trendCanvas = document.getElementById('trend-chart');

// Initialize App State
let courses = [];

// Initialize Page
document.addEventListener('DOMContentLoaded', () => {
  loadFromLocalStorage();
  if (courses.length === 0) {
    // Add 3 default rows if empty
    for (let i = 0; i < 3; i++) {
      addCourseRow();
    }
  } else {
    // Populate UI from loaded state
    courses.forEach(c => addCourseRow(c));
    calculateGPA(false); // Calculate without alerting/flash if restoring
  }
  
  // Setup Chart Resize Listener
  window.addEventListener('resize', () => {
    drawTrendChart();
  });
});

// Event Listeners
btnAddRow.addEventListener('click', () => {
  addCourseRow();
  courseRowsContainer.scrollTop = courseRowsContainer.scrollHeight;
});

btnCalculate.addEventListener('click', () => {
  calculateGPA(true);
});

btnReset.addEventListener('click', () => {
  if (confirm('모든 입력 데이터를 초기화하시겠습니까?')) {
    courseRowsContainer.innerHTML = '';
    courses = [];
    localStorage.removeItem('ku_gpa_courses');
    
    // Add 3 default empty rows
    for (let i = 0; i < 3; i++) {
      addCourseRow();
    }
    
    // Reset stats display
    resetStatsDisplay();
  }
});

// Row Management functions
function addCourseRow(data = null) {
  const rowId = 'row-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
  const row = document.createElement('div');
  row.className = 'course-row';
  row.id = rowId;
  
  const defaultData = data || { name: '', credits: 3, grade: 'A+', semester: '1-1' };
  
  // Semester Options template
  let semesterOptions = '';
  SEMESTERS.forEach(sem => {
    const selected = defaultData.semester === sem ? 'selected' : '';
    semesterOptions += `<option value="${sem}" ${selected}>${sem}</option>`;
  });
  
  // Grade Options template
  let gradeOptions = '';
  Object.keys(GRADE_POINTS).forEach(grade => {
    const selected = defaultData.grade === grade ? 'selected' : '';
    gradeOptions += `<option value="${grade}" ${selected}>${grade}</option>`;
  });
  
  row.innerHTML = `
    <div class="col-name">
      <input type="text" class="course-name" placeholder="과목명 입력 (예: 중국어학개론)" value="${defaultData.name}">
    </div>
    <div class="col-credits">
      <select class="course-credits">
        <option value="3" ${defaultData.credits === 3 ? 'selected' : ''}>3</option>
        <option value="2" ${defaultData.credits === 2 ? 'selected' : ''}>2</option>
        <option value="1" ${defaultData.credits === 1 ? 'selected' : ''}>1</option>
      </select>
    </div>
    <div class="col-grade">
      <select class="course-grade">
        ${gradeOptions}
      </select>
    </div>
    <div class="col-semester">
      <select class="course-semester">
        ${semesterOptions}
      </select>
    </div>
    <div class="col-action">
      <button type="button" class="btn-delete" title="삭제">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
      </button>
    </div>
  `;
  
  // Attach Delete Event
  row.querySelector('.btn-delete').addEventListener('click', () => {
    row.style.animation = 'slideOut 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards';
    setTimeout(() => {
      row.remove();
      // If no rows left, add 1 empty row
      if (courseRowsContainer.children.length === 0) {
        addCourseRow();
      }
    }, 200);
  });
  
  courseRowsContainer.appendChild(row);
}

// Reset Stats to Default State
function resetStatsDisplay() {
  gpaValEl.textContent = '0.00';
  gpaProgressCircle.style.strokeDashoffset = '314';
  gpaRadialWrapper.classList.remove('calculated');
  gpaFeedbackText.textContent = '성적을 입력하고 계산을 진행해 주세요.';
  gpaFeedbackText.style.borderColor = 'transparent';
  gpaFeedbackText.style.backgroundColor = 'var(--bg-primary)';
  
  totalCreditsValEl.textContent = '0';
  creditProgressBar.style.width = '0%';
  creditPercentValEl.textContent = '0% 완료';
  creditBarContainer.classList.remove('calculated');
  
  drawTrendChart();
}

// Calculate GPA and update interface
function calculateGPA(shouldFlash = true) {
  const rows = courseRowsContainer.querySelectorAll('.course-row');
  const tempCourses = [];
  
  let totalWeightedPoints = 0;
  let totalGPACredits = 0;
  let totalEarnedCredits = 0; // Excludes F
  
  // Semester wise calculation buckets
  const semesterStats = {};
  SEMESTERS.forEach(sem => {
    semesterStats[sem] = { weightedPoints: 0, credits: 0 };
  });
  
  rows.forEach(row => {
    const nameInput = row.querySelector('.course-name');
    const name = nameInput.value.trim();
    const credits = parseInt(row.querySelector('.course-credits').value, 10);
    const grade = row.querySelector('.course-grade').value;
    const semester = row.querySelector('.course-semester').value;
    
    tempCourses.push({ name, credits, grade, semester });
    
    const gradePoint = GRADE_POINTS[grade];
    
    // Accumulate for overall
    totalWeightedPoints += (gradePoint * credits);
    totalGPACredits += credits;
    if (grade !== 'F') {
      totalEarnedCredits += credits;
    }
    
    // Accumulate for semester
    if (semesterStats[semester]) {
      semesterStats[semester].weightedPoints += (gradePoint * credits);
      semesterStats[semester].credits += credits;
    }
  });
  
  // Update state and save
  courses = tempCourses;
  saveToLocalStorage();
  
  if (totalGPACredits === 0) {
    resetStatsDisplay();
    return;
  }
  
  const overallGPA = totalWeightedPoints / totalGPACredits;
  
  // Calculate semester-by-semester GPA trend
  const trendData = [];
  SEMESTERS.forEach(sem => {
    const semStat = semesterStats[sem];
    if (semStat.credits > 0) {
      const semGPA = semStat.weightedPoints / semStat.credits;
      trendData.push({
        semester: sem,
        gpa: parseFloat(semGPA.toFixed(2))
      });
    }
  });
  
  // Update UI Stats
  animateGPANumber(overallGPA);
  
  // Update Radial Progress (radial dash array is 314)
  const offset = 314 - (314 * (overallGPA / 4.5));
  gpaProgressCircle.style.strokeDashoffset = offset;
  gpaRadialWrapper.classList.add('calculated');
  
  // Set Feedback message based on GPA
  updateFeedbackMessage(overallGPA);
  
  // Update Credits completed
  totalCreditsValEl.textContent = totalEarnedCredits;
  const creditPercent = Math.min(100, Math.round((totalEarnedCredits / GRADUATION_CREDITS_TARGET) * 100));
  creditProgressBar.style.width = `${creditPercent}%`;
  creditPercentValEl.textContent = `${creditPercent}% 완료`;
  creditBarContainer.classList.add('calculated');
  
  // Render Chart
  drawTrendChart(trendData);
  
  if (shouldFlash) {
    triggerCalculatedFlash();
  }
}

// Animate GPA change count-up
function animateGPANumber(targetGPA) {
  const duration = 800; // ms
  const startTime = performance.now();
  const startGPA = parseFloat(gpaValEl.textContent) || 0;
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const currentVal = startGPA + (targetGPA - startGPA) * easeProgress;
    
    gpaValEl.textContent = currentVal.toFixed(2);
    
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      gpaValEl.textContent = targetGPA.toFixed(2);
    }
  }
  requestAnimationFrame(update);
}

// Update feedback message with nice styling
function updateFeedbackMessage(gpa) {
  let message = '';
  let colorClass = '';
  
  if (gpa >= 4.3) {
    message = '학업 최우수! 고려대의 자랑스러운 중문학 인재십니다. 🦁🔥';
    colorClass = 'neon-green';
  } else if (gpa >= 4.0) {
    message = '최우등 성적입니다! 전공 역량이 아주 탁월하십니다. 👍✨';
    colorClass = 'neon-cyan';
  } else if (gpa >= 3.5) {
    message = '우수한 성적입니다! 좋은 흐름을 계속 이어가세요. 👏';
    colorClass = 'neon-cyan';
  } else if (gpa >= 3.0) {
    message = '성실하게 노력하여 좋은 학점을 성취하고 계십니다! 🙂';
    colorClass = 'text-main';
  } else if (gpa >= 2.0) {
    message = '학업 관리에 조금 더 집중하여 평점을 올려봅시다! 화이팅! 📚';
    colorClass = 'text-muted';
  } else {
    message = '재수강 및 보강 계획을 세워 학업 평점을 개선해보세요! ✍️';
    colorClass = 'neon-red';
  }
  
  gpaFeedbackText.textContent = message;
  gpaFeedbackText.style.backgroundColor = `rgba(0, 229, 255, 0.05)`;
  gpaFeedbackText.style.border = `1px solid rgba(0, 229, 255, 0.25)`;
}

// Flash neon highlights briefly on calculation success
function triggerCalculatedFlash() {
  const highlightEl = document.querySelector('.card.highlight');
  highlightEl.style.boxShadow = '0 0 25px rgba(0, 229, 255, 0.3)';
  setTimeout(() => {
    highlightEl.style.boxShadow = '';
  }, 600);
}

// Custom High-DPI Neon Canvas line chart drawing
function drawTrendChart(data = []) {
  const ctx = trendCanvas.getContext('2d');
  
  // Set up High-DPI Canvas scaling
  const devicePixelRatio = window.devicePixelRatio || 1;
  const rect = trendCanvas.getBoundingClientRect();
  
  trendCanvas.width = rect.width * devicePixelRatio;
  trendCanvas.height = rect.height * devicePixelRatio;
  ctx.scale(devicePixelRatio, devicePixelRatio);
  
  const width = rect.width;
  const height = rect.height;
  
  // Canvas padding for titles and grid labels
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 30;
  const paddingBottom = 40;
  
  const graphWidth = width - paddingLeft - paddingRight;
  const graphHeight = height - paddingTop - paddingBottom;
  
  // Clear Canvas with sleek dark background matching .chart-container
  ctx.clearRect(0, 0, width, height);
  
  // Grid properties
  const yTicks = [0.0, 1.0, 2.0, 3.0, 4.0, 4.5];
  
  // Helper to map GPA to Canvas Y Coord
  function getY(gpa) {
    return paddingTop + graphHeight - (gpa / 4.5) * graphHeight;
  }
  
  // Draw horizontal grid lines & labels
  ctx.strokeStyle = '#e5e5ea';
  ctx.lineWidth = 1;
  ctx.fillStyle = '#86868b';
  ctx.font = '500 11px Outfit, Noto Sans KR';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  
  yTicks.forEach(tick => {
    const y = getY(tick);
    
    // Draw grid line
    ctx.beginPath();
    ctx.moveTo(paddingLeft, y);
    ctx.lineTo(width - paddingRight, y);
    ctx.stroke();
    
    // Draw label
    ctx.fillText(tick.toFixed(1), paddingLeft - 8, y);
  });
  
  // Map semesters to X Coords
  const xPositions = {};
  const stepX = graphWidth / (SEMESTERS.length - 1);
  
  SEMESTERS.forEach((sem, idx) => {
    xPositions[sem] = paddingLeft + idx * stepX;
    
    // Draw X labels
    ctx.fillStyle = '#86868b';
    ctx.font = '600 11px Outfit';
    ctx.textAlign = 'center';
    ctx.fillText(sem, xPositions[sem], height - paddingBottom + 18);
    
    // Draw minor vertical ticks on X axis
    ctx.strokeStyle = '#e5e5ea';
    ctx.beginPath();
    ctx.moveTo(xPositions[sem], height - paddingBottom);
    ctx.lineTo(xPositions[sem], height - paddingBottom + 4);
    ctx.stroke();
  });
  
  // Draw X axis bottom line
  ctx.strokeStyle = '#86868b';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(paddingLeft, height - paddingBottom);
  ctx.lineTo(width - paddingRight, height - paddingBottom);
  ctx.stroke();
  
  // Plot trend line if we have data
  if (data.length === 0) {
    // Show placeholder text
    ctx.fillStyle = '#86868b';
    ctx.font = '14px Noto Sans KR';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('계산 완료 시 여기에 성적 추이 그래프가 나타납니다.', width / 2, height / 2);
    return;
  }
  
  // Map data coordinates
  const points = data.map(item => ({
    x: xPositions[item.semester],
    y: getY(item.gpa),
    gpa: item.gpa,
    semester: item.semester
  }));
  
  // Draw gradient neon area fill under the curve
  if (points.length > 1) {
    const gradient = ctx.createLinearGradient(0, paddingTop, 0, height - paddingBottom);
    gradient.addColorStop(0, 'rgba(0, 229, 255, 0.2)');
    gradient.addColorStop(1, 'rgba(0, 229, 255, 0.0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(points[0].x, height - paddingBottom);
    
    // Draw curve path
    ctx.lineTo(points[0].x, points[0].y);
    for (let i = 0; i < points.length - 1; i++) {
      const xc = (points[i].x + points[i + 1].x) / 2;
      const yc = (points[i].y + points[i + 1].y) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }
    // Connect to last point
    ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
    ctx.lineTo(points[points.length - 1].x, height - paddingBottom);
    ctx.closePath();
    ctx.fill();
  }
  
  // Draw glowing trend line
  ctx.shadowColor = 'rgba(0, 229, 255, 0.5)';
  ctx.shadowBlur = 8;
  ctx.strokeStyle = '#00e5ff';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  
  ctx.beginPath();
  points.forEach((pt, idx) => {
    if (idx === 0) {
      ctx.moveTo(pt.x, pt.y);
    } else {
      // Smooth curve connection
      const prev = points[idx - 1];
      const xc = (prev.x + pt.x) / 2;
      const yc = (prev.y + pt.y) / 2;
      ctx.quadraticCurveTo(prev.x, prev.y, xc, yc);
    }
  });
  
  // Final segment to last point
  if (points.length > 1) {
    ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
  }
  ctx.stroke();
  
  // Reset shadow for labels/dots
  ctx.shadowBlur = 0;
  
  // Draw nodes (points) and tooltips
  points.forEach(pt => {
    // Outer glow ring
    ctx.fillStyle = 'rgba(0, 229, 255, 0.25)';
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 8, 0, 2 * Math.PI);
    ctx.fill();
    
    // Core white node
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#1d1d1f';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 4, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    
    // Value Label above the node
    ctx.fillStyle = '#1d1d1f';
    ctx.font = 'bold 11px Outfit';
    ctx.textAlign = 'center';
    ctx.fillText(pt.gpa.toFixed(2), pt.x, pt.y - 12);
  });
}

// LocalStorage Persistence Helpers
function saveToLocalStorage() {
  localStorage.setItem('ku_gpa_courses', JSON.stringify(courses));
}

function loadFromLocalStorage() {
  const raw = localStorage.getItem('ku_gpa_courses');
  if (raw) {
    try {
      courses = JSON.parse(raw);
    } catch (e) {
      courses = [];
    }
  }
}
