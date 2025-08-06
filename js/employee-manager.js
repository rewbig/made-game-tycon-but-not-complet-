/**
 * 직원 매니저 - 직원 고용 및 관리
 */

class EmployeeManager {
    constructor(gameManager) {
        this.gameManager = gameManager;
        
        // 현재 고용된 직원 목록
        this.employees = [];
        
        // 고용 가능한 후보자 목록
        this.candidates = [];
        
        // 직원 ID 카운터
        this.nextEmployeeId = 1;
        
        // 이벤트 리스너 설정
        this.setupEventListeners();
        
        // 초기 후보자 생성
        this.generateCandidates(3);
    }
    
    setupEventListeners() {
        // 직원 고용 버튼
        document.getElementById('hire-employee-btn').addEventListener('click', () => this.showCandidates());
        
        // 직원 선택 이벤트 (2D 환경에서 직원 클릭 시)
        document.addEventListener('employeeSelected', (event) => {
            const employeeId = event.detail.id;
            const employee = this.employees.find(emp => emp.id === employeeId);
            if (employee) {
                this.showEmployeeDetails(employee);
            }
        });
    }
    
    addPlayerCharacter() {
        // 플레이어 캐릭터 (첫 직원)
        const playerCharacter = new Employee(
            this.nextEmployeeId++,
            this.gameManager.player.studioName + '의 창립자',
            'management', // 주 스킬
            {
                programming: this.gameManager.player.skills.programming,
                design: this.gameManager.player.skills.design,
                art: this.gameManager.player.skills.art,
                sound: this.gameManager.player.skills.sound,
                marketing: this.gameManager.player.skills.marketing,
                management: this.gameManager.player.skills.management
            },
            0, // 급여 없음 (플레이어 캐릭터)
            1, // 경험
            100 // 만족도
        );
        
        // 직원 목록에 추가
        this.employees.push(playerCharacter);
        
        // 2D 환경에 직원 추가
        if (window.threeManager) {
            const position = { x: 0, y: 0 };
            const employeeObject = window.threeManager.addEmployee(position);
            playerCharacter.object2D = employeeObject;
        }
        
        // UI 업데이트
        this.updateEmployeeDisplay();
        
        return playerCharacter;
    }
    
    generateCandidates(count = 3) {
        // 기존 후보자 초기화
        this.candidates = [];
        
        // 새 후보자 생성
        for (let i = 0; i < count; i++) {
            const skills = ['programming', 'design', 'art', 'sound', 'marketing', 'management'];
            const mainSkill = skills[Math.floor(Math.random() * skills.length)];
            
            // 현재 게임 연도에 따라 스킬 레벨 조정
            const baseSkillLevel = 1 + (this.gameManager.year - 1) * 0.5;
            const maxSkillLevel = 2 + (this.gameManager.year - 1) * 0.7;
            
            // 스킬셋 생성
            const skillSet = {};
            skills.forEach(skill => {
                if (skill === mainSkill) {
                    // 주 스킬은 더 높은 값
                    skillSet[skill] = baseSkillLevel + Math.random() * (maxSkillLevel - baseSkillLevel);
                } else {
                    // 부 스킬은 낮은 값
                    skillSet[skill] = Math.max(1, Math.random() * baseSkillLevel);
                }
            });
            
            // 경험에 따른 급여 계산
            const experience = Math.max(1, Math.floor(Math.random() * this.gameManager.year));
            const baseSalary = 2000000; // 기본 연봉 200만원
            const salary = Math.round(baseSalary * (1 + (skillSet[mainSkill] - 1) * 0.5 + (experience - 1) * 0.2));
            
            // 후보자 이름 생성
            const firstName = this.getRandomName('first');
            const lastName = this.getRandomName('last');
            const name = `${lastName}${firstName}`;
            
            // 후보자 생성
            const candidate = new Employee(
                this.nextEmployeeId++,
                name,
                mainSkill,
                skillSet,
                salary,
                experience,
                100 // 초기 만족도
            );
            
            this.candidates.push(candidate);
        }
        
        return this.candidates;
    }
    
    getRandomName(type) {
        const firstNames = ['민준', '서준', '예준', '도윤', '시우', '주원', '하준', '지호', '지후', '준서', 
                         '서연', '서윤', '지우', '서현', '민서', '하은', '하윤', '윤서', '지유', '지민'];
        
        const lastNames = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임', '한', '오', '서', '신', '권', '황', '안', '송', '전', '홍'];
        
        if (type === 'first') {
            return firstNames[Math.floor(Math.random() * firstNames.length)];
        } else {
            return lastNames[Math.floor(Math.random() * lastNames.length)];
        }
    }
    
    showCandidates() {
        // 후보자가 없으면 새로 생성
        if (this.candidates.length === 0) {
            this.generateCandidates(3);
        }
        
        // 후보자 목록 HTML 생성
        const candidatesHtml = this.candidates.map(candidate => `
            <div class="candidate-card" data-id="${candidate.id}">
                <h4>${candidate.name}</h4>
                <div class="candidate-main-skill">
                    <span class="skill-label">주 스킬:</span>
                    <span class="skill-value">${this.getSkillDisplayName(candidate.mainSkill)} (${candidate.skillSet[candidate.mainSkill].toFixed(1)})</span>
                </div>
                <div class="candidate-skills">
                    ${Object.entries(candidate.skillSet)
                        .filter(([skill]) => skill !== candidate.mainSkill)
                        .map(([skill, level]) => `
                            <div class="skill-item">
                                <span class="skill-name">${this.getSkillDisplayName(skill)}</span>
                                <span class="skill-level">${level.toFixed(1)}</span>
                            </div>
                        `).join('')}
                </div>
                <div class="candidate-meta">
                    <div class="meta-item">
                        <span class="meta-label">경험:</span>
                        <span class="meta-value">${candidate.experience}년</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">급여:</span>
                        <span class="meta-value">${Math.round(candidate.salary / 12).toLocaleString()}원/월</span>
                    </div>
                </div>
                <button class="hire-btn" data-id="${candidate.id}">고용하기</button>
            </div>
        `).join('');
        
        // 다이얼로그 표시
        this.gameManager.uiManager.showDialog(
            '직원 고용',
            `
            <div class="candidates-container">
                ${candidatesHtml}
            </div>
            <div class="candidates-actions">
                <button id="refresh-candidates-btn" class="btn btn-secondary">후보자 새로고침 (50,000원)</button>
            </div>
            `,
            [
                {
                    text: '닫기',
                    callback: () => {}
                }
            ],
            () => {
                // 고용 버튼 이벤트 리스너
                document.querySelectorAll('.hire-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const candidateId = parseInt(btn.getAttribute('data-id'));
                        this.hireEmployee(candidateId);
                    });
                });
                
                // 후보자 새로고침 버튼 이벤트 리스너
                document.getElementById('refresh-candidates-btn').addEventListener('click', () => {
                    // 새로고침 비용
                    const refreshCost = 50000;
                    
                    if (this.gameManager.player.money >= refreshCost) {
                        this.gameManager.addMoney(-refreshCost);
                        this.generateCandidates(3);
                        this.showCandidates();
                    } else {
                        this.gameManager.uiManager.showNotification('자금이 부족합니다!', 'error');
                    }
                });
            }
        );
    }
    
    hireEmployee(candidateId) {
        // 후보자 찾기
        const candidateIndex = this.candidates.findIndex(c => c.id === candidateId);
        
        if (candidateIndex === -1) return;
        
        const candidate = this.candidates[candidateIndex];
        
        // 급여 확인
        const monthlySalary = Math.round(candidate.salary / 12);
        
        if (this.gameManager.player.money < monthlySalary * 3) {
            this.gameManager.uiManager.showNotification('직원을 고용하기 위한 자금이 부족합니다! (최소 3개월치 급여 필요)', 'error');
            return;
        }
        
        // 후보자 목록에서 제거
        this.candidates.splice(candidateIndex, 1);
        
        // 직원 목록에 추가
        this.employees.push(candidate);
        
        // 2D 환경에 직원 추가
        if (window.threeManager) {
            // 랜덤 위치 생성 (오피스 내부)
            const x = (Math.random() - 0.5) * 80;
            const y = (Math.random() - 0.5) * 60;
            const position = { x: x, y: y };
            
            const employeeObject = window.threeManager.addEmployee(position);
            candidate.object2D = employeeObject;
        }
        
        // 알림 표시
        this.gameManager.uiManager.showNotification(`${candidate.name}님을 고용했습니다!`, 'success');
        
        // UI 업데이트
        this.updateEmployeeDisplay();
        
        // 다이얼로그 닫기
        this.gameManager.uiManager.closeDialog();
    }
    
    fireEmployee(employeeId) {
        // 직원 찾기
        const employeeIndex = this.employees.findIndex(e => e.id === employeeId);
        
        if (employeeIndex === -1 || employeeIndex === 0) return; // 첫 번째 직원(플레이어)은 해고 불가
        
        const employee = this.employees[employeeIndex];
        
        // 퇴직금 계산 (1개월치 급여)
        const severancePay = Math.round(employee.salary / 12);
        
        // 확인 다이얼로그 표시
        this.gameManager.uiManager.showDialog(
            '직원 해고',
            `정말 ${employee.name}님을 해고하시겠습니까?<br><br>퇴직금: ${severancePay.toLocaleString()}원`,
            [
                {
                    text: '해고',
                    callback: () => {
                        // 퇴직금 지급
                        this.gameManager.addMoney(-severancePay);
                        
                        // 2D 환경에서 직원 제거
                        if (window.threeManager && employee.object2D) {
                            window.threeManager.removeEmployee(employee.object2D.userData.id);
                        }
                        
                        // 직원 목록에서 제거
                        this.employees.splice(employeeIndex, 1);
                        
                        // 알림 표시
                        this.gameManager.uiManager.showNotification(`${employee.name}님을 해고했습니다.`, 'info');
                        
                        // UI 업데이트
                        this.updateEmployeeDisplay();
                    }
                },
                {
                    text: '취소',
                    callback: () => {}
                }
            ]
        );
    }
    
    showEmployeeDetails(employee) {
        // 직원 상세 정보 다이얼로그 표시
        const skillsHtml = Object.entries(employee.skillSet).map(([skill, level]) => `
            <div class="skill-item ${skill === employee.mainSkill ? 'main-skill' : ''}">
                <span class="skill-name">${this.getSkillDisplayName(skill)}</span>
                <div class="skill-bar">
                    <div class="skill-fill" style="width: ${Math.min(level * 10, 100)}%"></div>
                </div>
                <span class="skill-level">${level.toFixed(1)}</span>
            </div>
        `).join('');
        
        const isPlayerCharacter = employee.id === 1;
        
        const dialogContent = `
            <div class="employee-details">
                <h3>${employee.name}</h3>
                <div class="employee-meta">
                    <div class="meta-item">
                        <span class="meta-label">주 스킬:</span>
                        <span class="meta-value">${this.getSkillDisplayName(employee.mainSkill)}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">경험:</span>
                        <span class="meta-value">${employee.experience}년</span>
                    </div>
                    ${!isPlayerCharacter ? `
                    <div class="meta-item">
                        <span class="meta-label">급여:</span>
                        <span class="meta-value">${Math.round(employee.salary / 12).toLocaleString()}원/월</span>
                    </div>
                    ` : ''}
                    <div class="meta-item">
                        <span class="meta-label">만족도:</span>
                        <span class="meta-value">${employee.satisfaction}%</span>
                    </div>
                </div>
                
                <h4>스킬</h4>
                <div class="skills-container">
                    ${skillsHtml}
                </div>
                
                ${!isPlayerCharacter ? `
                <div class="employee-actions">
                    <button id="train-employee-btn" class="btn btn-primary" data-id="${employee.id}">교육 (100,000원)</button>
                    <button id="fire-employee-btn" class="btn btn-danger" data-id="${employee.id}">해고</button>
                </div>
                ` : ''}
            </div>
        `;
        
        this.gameManager.uiManager.showDialog(
            '직원 정보',
            dialogContent,
            [
                {
                    text: '닫기',
                    callback: () => {}
                }
            ],
            () => {
                // 플레이어 캐릭터가 아닌 경우에만 버튼 이벤트 리스너 추가
                if (!isPlayerCharacter) {
                    // 교육 버튼 이벤트 리스너
                    document.getElementById('train-employee-btn').addEventListener('click', () => {
                        this.trainEmployee(employee.id);
                    });
                    
                    // 해고 버튼 이벤트 리스너
                    document.getElementById('fire-employee-btn').addEventListener('click', () => {
                        this.fireEmployee(employee.id);
                        this.gameManager.uiManager.closeDialog();
                    });
                }
            }
        );
    }
    
    trainEmployee(employeeId) {
        // 직원 찾기
        const employee = this.employees.find(e => e.id === employeeId);
        
        if (!employee) return;
        
        // 교육 비용
        const trainingCost = 100000;
        
        if (this.gameManager.player.money < trainingCost) {
            this.gameManager.uiManager.showNotification('교육 비용이 부족합니다!', 'error');
            return;
        }
        
        // 교육할 스킬 선택 다이얼로그
        const skillsHtml = Object.entries(employee.skillSet).map(([skill, level]) => `
            <div class="skill-select-item" data-skill="${skill}">
                <span class="skill-name">${this.getSkillDisplayName(skill)}</span>
                <span class="skill-level">${level.toFixed(1)}</span>
            </div>
        `).join('');
        
        this.gameManager.uiManager.showDialog(
            '직원 교육',
            `
            <p>교육할 스킬을 선택하세요. 비용: ${trainingCost.toLocaleString()}원</p>
            <div class="skills-select-container">
                ${skillsHtml}
            </div>
            `,
            [
                {
                    text: '취소',
                    callback: () => {}
                }
            ],
            () => {
                // 스킬 선택 이벤트 리스너
                document.querySelectorAll('.skill-select-item').forEach(item => {
                    item.addEventListener('click', () => {
                        const skill = item.getAttribute('data-skill');
                        this.applyTraining(employee, skill, trainingCost);
                    });
                });
            }
        );
    }
    
    applyTraining(employee, skill, cost) {
        // 비용 차감
        this.gameManager.addMoney(-cost);
        
        // 스킬 향상 (0.5 ~ 1.0 랜덤 증가)
        const increase = 0.5 + Math.random() * 0.5;
        employee.skillSet[skill] += increase;
        
        // 만족도 증가
        employee.satisfaction = Math.min(100, employee.satisfaction + 10);
        
        // 알림 표시
        this.gameManager.uiManager.showNotification(
            `${employee.name}님의 ${this.getSkillDisplayName(skill)} 스킬이 ${increase.toFixed(1)} 증가했습니다!`,
            'success'
        );
        
        // 다이얼로그 닫기
        this.gameManager.uiManager.closeDialog();
        
        // UI 업데이트
        this.updateEmployeeDisplay();
    }
    
    payEmployeeSalaries() {
        // 플레이어 캐릭터를 제외한 직원들의 급여 계산
        let totalSalary = 0;
        
        for (let i = 1; i < this.employees.length; i++) { // 인덱스 1부터 시작 (플레이어 제외)
            const employee = this.employees[i];
            const monthlySalary = Math.round(employee.salary / 12);
            totalSalary += monthlySalary;
            
            // 직원 만족도 업데이트
            this.updateEmployeeSatisfaction(employee);
        }
        
        if (totalSalary > 0) {
            // 급여 지급
            this.gameManager.addMoney(-totalSalary);
            
            // 알림 표시
            this.gameManager.uiManager.showNotification(`직원 급여로 ${totalSalary.toLocaleString()}원을 지급했습니다.`, 'info');
            
            // 파산 체크
            if (this.gameManager.player.money < 0) {
                // 직원 불만족도 증가 (급여 미지급 페널티)
                for (let i = 1; i < this.employees.length; i++) {
                    this.employees[i].satisfaction -= 30;
                }
            }
        }
    }
    
    updateEmployeeSatisfaction(employee) {
        // 기본 만족도 변화
        let satisfactionChange = 0;
        
        // 스튜디오 성과에 따른 만족도 변화
        if (this.gameManager.player.money > 1000000) {
            satisfactionChange += 5; // 자금이 많으면 만족도 증가
        } else if (this.gameManager.player.money < 0) {
            satisfactionChange -= 10; // 자금이 부족하면 만족도 감소
        }
        
        // 최근 게임 성과에 따른 만족도 변화
        const recentProjects = this.gameManager.projectManager.completedProjects.slice(-3);
        if (recentProjects.length > 0) {
            const avgRating = recentProjects.reduce((sum, project) => sum + project.rating, 0) / recentProjects.length;
            if (avgRating >= 8) {
                satisfactionChange += 5; // 좋은 평가의 게임이 있으면 만족도 증가
            } else if (avgRating < 5) {
                satisfactionChange -= 5; // 나쁜 평가의 게임이 있으면 만족도 감소
            }
        }
        
        // 직원 수에 따른 만족도 변화
        if (this.employees.length > 10) {
            satisfactionChange -= 2; // 직원이 많으면 약간의 만족도 감소 (경쟁 심화)
        }
        
        // 만족도 업데이트
        employee.satisfaction = Math.max(0, Math.min(100, employee.satisfaction + satisfactionChange));
        
        // 만족도가 너무 낮으면 퇴사 위험
        if (employee.satisfaction < 20) {
            this.checkEmployeeResignation(employee);
        }
    }
    
    checkEmployeeResignation(employee) {
        // 퇴사 확률 계산 (만족도가 낮을수록 퇴사 확률 증가)
        const resignationChance = (20 - employee.satisfaction) * 5; // 0~20% 확률
        
        if (Math.random() * 100 < resignationChance) {
            // 직원 퇴사
            const employeeIndex = this.employees.indexOf(employee);
            
            if (employeeIndex > 0) { // 플레이어 캐릭터는 퇴사 불가
                // 2D 환경에서 직원 제거
                if (window.threeManager && employee.object2D) {
                    window.threeManager.removeEmployee(employee.object2D.userData.id);
                }
                
                // 직원 목록에서 제거
                this.employees.splice(employeeIndex, 1);
                
                // 알림 표시
                this.gameManager.uiManager.showNotification(`${employee.name}님이 퇴사했습니다. (만족도 부족)`, 'warning');
                
                // UI 업데이트
                this.updateEmployeeDisplay();
            }
        }
    }
    
    updateEmployees() {
        // 직원 스킬 자연 향상 (매우 낮은 확률)
        this.employees.forEach(employee => {
            // 하루에 0.5% 확률로 주 스킬 향상
            if (Math.random() < 0.005) {
                const skillIncrease = 0.1 + Math.random() * 0.1; // 0.1 ~ 0.2 증가
                employee.skillSet[employee.mainSkill] += skillIncrease;
                
                // 경험 증가
                if (Math.random() < 0.1) { // 10% 확률로 경험 증가
                    employee.experience += 0.1;
                }
            }
        });
    }
    
    updateEmployeeDisplay() {
        const employeeContainer = document.getElementById('employee-list');
        
        if (this.employees.length === 0) {
            employeeContainer.innerHTML = `
                <div class="empty-state">
                    <p>고용된 직원이 없습니다.</p>
                </div>
            `;
        } else {
            // 직원 목록 표시
            employeeContainer.innerHTML = `
                <div class="employee-grid">
                    ${this.employees.map(employee => `
                        <div class="employee-card" data-id="${employee.id}">
                            <h4>${employee.name}</h4>
                            <div class="employee-main-skill">
                                <span class="skill-label">주 스킬:</span>
                                <span class="skill-value">${this.getSkillDisplayName(employee.mainSkill)} (${employee.skillSet[employee.mainSkill].toFixed(1)})</span>
                            </div>
                            <div class="employee-meta">
                                <div class="meta-item">
                                    <span class="meta-label">경험:</span>
                                    <span class="meta-value">${employee.experience.toFixed(1)}년</span>
                                </div>
                                ${employee.id !== 1 ? `
                                <div class="meta-item">
                                    <span class="meta-label">급여:</span>
                                    <span class="meta-value">${Math.round(employee.salary / 12).toLocaleString()}원/월</span>
                                </div>
                                ` : ''}
                                <div class="meta-item">
                                    <span class="meta-label">만족도:</span>
                                    <span class="meta-value">${employee.satisfaction}%</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="employee-actions">
                    <button id="hire-employee-btn" class="btn btn-primary">직원 고용</button>
                </div>
            `;
            
            // 직원 카드 클릭 이벤트 리스너
            document.querySelectorAll('.employee-card').forEach(card => {
                card.addEventListener('click', () => {
                    const employeeId = parseInt(card.getAttribute('data-id'));
                    const employee = this.employees.find(emp => emp.id === employeeId);
                    if (employee) {
                        this.showEmployeeDetails(employee);
                    }
                });
            });
            
            // 직원 고용 버튼 이벤트 리스너
            document.getElementById('hire-employee-btn').addEventListener('click', () => this.showCandidates());
        }
    }
    
    getSkillDisplayName(skillName) {
        const skillNames = {
            programming: '프로그래밍',
            design: '게임 디자인',
            art: '아트',
            sound: '사운드',
            marketing: '마케팅',
            management: '경영'
        };
        
        return skillNames[skillName] || skillName;
    }
    
    loadData(employees) {
        // 저장된 데이터 로드
        this.employees = employees;
        
        // 2D 환경에 직원 추가
        if (window.threeManager) {
            this.employees.forEach(employee => {
                // 랜덤 위치 생성 (오피스 내부)
                const x = (Math.random() - 0.5) * 80;
                const y = (Math.random() - 0.5) * 60;
                const position = { x: x, y: y };
                
                const employeeObject = window.threeManager.addEmployee(position);
                employee.object2D = employeeObject;
            });
        }
        
        // UI 업데이트
        this.updateEmployeeDisplay();
    }
}

/**
 * 직원 클래스
 */
class Employee {
    constructor(id, name, mainSkill, skillSet, salary, experience, satisfaction) {
        this.id = id;
        this.name = name;
        this.mainSkill = mainSkill;
        this.skillSet = skillSet;
        this.salary = salary;
        this.experience = experience;
        this.satisfaction = satisfaction;
        this.object2D = null; // 2D 객체 참조
    }
}