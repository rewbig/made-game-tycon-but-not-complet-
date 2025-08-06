/**
 * 게임 매니저 - 게임의 핵심 로직 관리
 */

class GameManager {
    constructor() {
        // 싱글톤 패턴 구현
        if (GameManager.instance) {
            return GameManager.instance;
        }
        GameManager.instance = this;
        
        // 게임 상태
        this.gameState = 'mainMenu'; // mainMenu, playing, paused
        
        // 게임 시간
        this.gameSpeed = 1; // 1: 보통, 2: 빠름, 3: 매우 빠름
        this.day = 1;
        this.week = 1;
        this.month = 1;
        this.year = 1;
        this.paused = true;
        
        // 플레이어 데이터
        this.player = {
            studioName: '',
            money: 50000,
            reputation: 0,
            fans: 0,
            skills: {
                programming: 1,
                design: 1,
                art: 1,
                sound: 1,
                marketing: 1,
                management: 1
            }
        };
        
        // 게임 타이머 설정
        this.gameTimer = null;
        
        // 이벤트 리스너 설정
        this.setupEventListeners();
    }
    
    init() {
        // 이벤트 리스너 설정
        this.setupEventListeners();
        
        // 연구 매니저 초기화
        this.researchManager = new ResearchManager(this);
        
        // 마케팅 매니저 초기화
        this.marketingManager = new MarketingManager(this);
        
        // 재정 매니저 초기화
        this.financeManager = new FinanceManager(this);
        
        console.log('Game Manager initialized');
    }
    
    setupEventListeners() {
        // 게임 속도 조절 버튼 이벤트 리스너
        const pauseBtn = document.getElementById('pause-btn');
        const playBtn = document.getElementById('play-btn');
        const fastBtn = document.getElementById('fast-btn');
        
        if (pauseBtn) pauseBtn.addEventListener('click', () => this.setGameSpeed(0));
        if (playBtn) playBtn.addEventListener('click', () => this.setGameSpeed(1));
        if (fastBtn) fastBtn.addEventListener('click', () => this.setGameSpeed(2));
        
        // 메인 메뉴 시작 버튼은 main.js에서 처리
        
        // 게임 내 메뉴 버튼 (현재 index.html에는 없음)
        // const menuBtn = document.getElementById('menu-btn');
        // if (menuBtn) menuBtn.addEventListener('click', () => this.togglePause());
    }
    
    showNewGameDialog() {
        // UI 매니저를 통해 새 게임 다이얼로그 표시
        if (this.uiManager) {
            this.uiManager.showDialog(
                '새 게임 시작',
                `
                <div class="new-game-form">
                    <div class="form-group">
                        <label for="studio-name">스튜디오 이름</label>
                        <input type="text" id="studio-name-input" class="form-control" placeholder="스튜디오 이름을 입력하세요" value="내 스튜디오">
                    </div>
                    
                    <div class="form-group">
                        <label>난이도</label>
                        <div class="difficulty-options">
                            <label class="difficulty-option">
                                <input type="radio" name="difficulty" value="easy" checked>
                                <span class="difficulty-label">쉬움</span>
                                <span class="difficulty-desc">초기 자금 20,000원, 스킬 상승 빠름</span>
                            </label>
                            <label class="difficulty-option">
                                <input type="radio" name="difficulty" value="normal">
                                <span class="difficulty-label">보통</span>
                                <span class="difficulty-desc">초기 자금 10,000원, 스킬 상승 보통</span>
                            </label>
                            <label class="difficulty-option">
                                <input type="radio" name="difficulty" value="hard">
                                <span class="difficulty-label">어려움</span>
                                <span class="difficulty-desc">초기 자금 5,000원, 스킬 상승 느림</span>
                            </label>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>전문 분야</label>
                        <div class="specialization-options">
                            <label class="specialization-option">
                                <input type="radio" name="specialization" value="balanced" checked>
                                <span class="specialization-label">균형</span>
                                <span class="specialization-desc">모든 스킬 균형 있게 시작</span>
                            </label>
                            <label class="specialization-option">
                                <input type="radio" name="specialization" value="technical">
                                <span class="specialization-label">기술</span>
                                <span class="specialization-desc">프로그래밍 스킬 +5</span>
                            </label>
                            <label class="specialization-option">
                                <input type="radio" name="specialization" value="creative">
                                <span class="specialization-label">창의</span>
                                <span class="specialization-desc">디자인 스킬 +5</span>
                            </label>
                            <label class="specialization-option">
                                <input type="radio" name="specialization" value="business">
                                <span class="specialization-label">비즈니스</span>
                                <span class="specialization-desc">마케팅 스킬 +5</span>
                            </label>
                        </div>
                    </div>
                </div>
                `,
                [
                    {
                        text: '시작하기',
                        callback: () => {
                            const studioName = document.getElementById('studio-name-input').value || '내 스튜디오';
                            const difficulty = document.querySelector('input[name="difficulty"]:checked').value;
                            const specialization = document.querySelector('input[name="specialization"]:checked').value;
                            
                            this.startNewGame(studioName, difficulty, specialization);
                        }
                    },
                    {
                        text: '취소',
                        callback: () => {}
                    }
                ]
            );
        } else {
            console.error('UI Manager not initialized');
        }
    }
    
    startNewGame(studioName, difficulty, specialization) {
        // 플레이어 데이터 초기화
        this.player.studioName = studioName || '내 스튜디오';
        
        // 난이도에 따른 초기 자금 설정
        const difficultySettings = {
            easy: { money: 20000, skillMultiplier: 1.2 },
            normal: { money: 10000, skillMultiplier: 1.0 },
            hard: { money: 5000, skillMultiplier: 0.8 }
        };
        
        this.player.money = difficultySettings[difficulty]?.money || 10000;
        
        // 전문 분야에 따른 초기 스킬 설정
        const specializationSettings = {
            balanced: { programming: 2, design: 2, art: 2, sound: 2, marketing: 2, management: 2 },
            technical: { programming: 5, design: 2, art: 1, sound: 1, marketing: 1, management: 2 },
            creative: { programming: 1, design: 5, art: 3, sound: 2, marketing: 1, management: 0 },
            business: { programming: 0, design: 1, art: 1, sound: 1, marketing: 5, management: 4 }
        };
        
        const skills = specializationSettings[specialization] || specializationSettings.balanced;
        for (const skill in skills) {
            this.player.skills[skill] = skills[skill];
        }
        
        // 게임 상태 변경
        this.gameState = 'playing';
        
        // UI 업데이트
        if (this.uiManager) {
            this.uiManager.updateUI();
        }
        
        // 메인 메뉴 숨기기, 게임 UI 표시
        document.getElementById('main-menu').style.display = 'none';
        document.getElementById('game-ui').style.display = 'flex';
        
        // 게임 시작
        this.startGameTimer();
        
        // 초기 직원 생성 (플레이어 캐릭터)
        this.employeeManager.addPlayerCharacter();
        
        console.log(`New game started: ${this.player.studioName}`);
    }
    
    startGameTimer() {
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
        }
        
        this.paused = false;
        this.lastFrameTime = performance.now();
        
        // 게임 속도에 따른 타이머 간격 설정 (밀리초)
        const timerIntervals = {
            0: null,  // 일시정지
            1: 2000,  // 보통 (2초마다 하루)
            2: 1000,  // 빠름 (1초마다 하루)
            3: 500    // 매우 빠름 (0.5초마다 하루)
        };
        
        // requestAnimationFrame을 사용하여 더 효율적인 타이머 구현
        const gameLoop = () => {
            if (this.paused) return;
            
            const currentTime = performance.now();
            const deltaTime = currentTime - this.lastFrameTime;
            const interval = timerIntervals[this.gameSpeed];
            
            if (interval && deltaTime >= interval) {
                this.advanceDay();
                this.lastFrameTime = currentTime;
            }
            
            // 다음 프레임 요청
            this.animationFrameId = requestAnimationFrame(gameLoop);
        };
        
        // 게임 루프 시작
        this.animationFrameId = requestAnimationFrame(gameLoop);
    }
    
    advanceDay() {
        if (this.paused) return;
        
        // 하루 증가
        this.day++;
        
        // 주/월/년 계산
        if (this.day > 7) {
            this.day = 1;
            this.week++;
            
            // 주간 이벤트 처리
            this.processWeeklyEvents();
        }
        
        if (this.week > 4) {
            this.week = 1;
            this.month++;
            
            // 월간 이벤트 처리
            this.processMonthlyEvents();
        }
        
        if (this.month > 12) {
            this.month = 1;
            this.year++;
            
            // 연간 이벤트 처리
            this.processYearlyEvents();
        }
        
        // 일일 업데이트 처리
        this.processDailyUpdates();
        
        // UI 업데이트
        this.uiManager.updateTimeDisplay();
    }
    
    processDailyUpdates() {
        // 프로젝트 진행 업데이트
        this.projectManager.updateProjects();
        
        // 직원 업데이트
        this.employeeManager.updateEmployees();
        
        // 연구 진행 업데이트
        this.researchManager.updateResearch();
        
        // 마케팅 캠페인 업데이트
        this.marketingManager.updateCampaigns();
        
        // 게임 판매 업데이트
        this.projectManager.updateGameSales();
        
        // UI 업데이트 - 매일 업데이트하지 않고 3일마다 업데이트하여 성능 향상
        if (this.day % 3 === 0) {
            this.uiManager.updateResourceDisplay();
        }
    }
    
    processWeeklyEvents() {
        // 주간 이벤트 처리 (예: 특별 이벤트, 랜덤 이벤트 등)
        console.log(`Week ${this.week} of Month ${this.month}, Year ${this.year}`);
    }
    
    processMonthlyEvents() {
        // 월간 이벤트 처리
        console.log(`Month ${this.month} of Year ${this.year}`);
        
        // 월급 지급
        this.employeeManager.payEmployeeSalaries();
        
        // 월간 비용 처리
        this.financeManager.processMonthlyExpenses();
        
        // 월간 수익 보고서
        this.financeManager.generateMonthlyReport();
    }
    
    processYearlyEvents() {
        // 연간 이벤트 처리
        console.log(`New Year: ${this.year}`);
        
        // 연간 보고서 생성
        this.financeManager.generateYearlyReport();
        
        // 게임 어워드 이벤트
        this.projectManager.processGameAwards();
    }
    
    setGameSpeed(speed) {
        this.gameSpeed = speed;
        
        // 게임 속도 UI 업데이트
        const speedButtons = document.querySelectorAll('.speed-btn');
        speedButtons.forEach(btn => btn.classList.remove('active'));
        
        if (speed === 0) {
            document.getElementById('speed-pause').classList.add('active');
            this.pauseGame();
        } else {
            document.getElementById(`speed-${speed === 1 ? 'normal' : speed === 2 ? 'fast' : 'ultra'}`).classList.add('active');
            this.resumeGame();
        }
    }
    
    pauseGame() {
        this.paused = true;
        // requestAnimationFrame 기반 타이머 정지
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        console.log('Game paused');
    }
    
    resumeGame() {
        if (this.paused) {
            this.paused = false;
            this.lastFrameTime = performance.now(); // 시간 재설정
            this.startGameTimer();
            console.log('Game resumed');
        }
    }
    
    togglePause() {
        if (this.paused) {
            this.resumeGame();
        } else {
            this.pauseGame();
        }
    }
    
    addMoney(amount) {
        this.player.money += amount;
        this.uiManager.updateResourceDisplay();
        
        // 금액에 따라 알림 표시
        if (amount >= 10000) {
            this.uiManager.showNotification(`${amount.toLocaleString()}원을 획득했습니다!`, 'success');
        } else if (amount <= -10000) {
            this.uiManager.showNotification(`${Math.abs(amount).toLocaleString()}원을 지출했습니다.`, 'warning');
        }
        
        // 파산 체크
        if (this.player.money < 0) {
            this.checkBankruptcy();
        }
    }
    
    addReputation(amount) {
        this.player.reputation += amount;
        if (this.player.reputation < 0) this.player.reputation = 0;
        this.uiManager.updateResourceDisplay();
        
        // 명성에 따라 알림 표시
        if (amount >= 10) {
            this.uiManager.showNotification(`명성이 ${amount} 증가했습니다!`, 'success');
        } else if (amount <= -10) {
            this.uiManager.showNotification(`명성이 ${Math.abs(amount)} 감소했습니다.`, 'warning');
        }
    }
    
    addFans(amount) {
        this.player.fans += amount;
        if (this.player.fans < 0) this.player.fans = 0;
        this.uiManager.updateResourceDisplay();
        
        // 팬 수에 따라 알림 표시
        if (amount >= 1000) {
            this.uiManager.showNotification(`팬이 ${amount.toLocaleString()}명 증가했습니다!`, 'success');
        }
    }
    
    improveSkill(skillName, amount) {
        if (this.player.skills[skillName] !== undefined) {
            this.player.skills[skillName] += amount;
            this.uiManager.updateSkillsDisplay();
            
            if (amount > 0) {
                this.uiManager.showNotification(`${this.getSkillDisplayName(skillName)} 스킬이 향상되었습니다!`, 'info');
            }
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
    
    checkBankruptcy() {
        if (this.player.money < -50000) {
            // 게임 오버 - 파산
            this.gameOver('bankruptcy');
        }
    }
    
    gameOver(reason) {
        this.pauseGame();
        
        let message = '';
        switch (reason) {
            case 'bankruptcy':
                message = '파산했습니다! 당신의 게임 스튜디오는 더 이상 운영할 수 없게 되었습니다.';
                break;
            default:
                message = '게임 오버!';
        }
        
        // 게임 오버 다이얼로그 표시
        this.uiManager.showDialog('게임 오버', message, [{
            text: '메인 메뉴로',
            callback: () => this.returnToMainMenu()
        }]);
    }
    
    returnToMainMenu() {
        // 게임 상태 초기화
        this.gameState = 'mainMenu';
        
        // UI 업데이트
        document.getElementById('game-ui').style.display = 'none';
        document.getElementById('main-menu').style.display = 'flex';
    }
    
    saveGame() {
        // 게임 데이터 저장 (로컬 스토리지 사용)
        const saveData = {
            player: this.player,
            gameTime: {
                day: this.day,
                week: this.week,
                month: this.month,
                year: this.year
            },
            projects: this.projectManager.projects,
            completedProjects: this.projectManager.completedProjects,
            employees: this.employeeManager.employees,
            research: this.researchManager.researchItems,
            marketing: this.marketingManager.campaigns,
            finances: this.financeManager.getFinancialData()
        };
        
        try {
            localStorage.setItem('gameDevTycoonSave', JSON.stringify(saveData));
            this.uiManager.showNotification('게임이 저장되었습니다.', 'success');
            return true;
        } catch (error) {
            console.error('게임 저장 실패:', error);
            this.uiManager.showNotification('게임 저장에 실패했습니다.', 'error');
            return false;
        }
    }
    
    loadGame() {
        try {
            const saveData = JSON.parse(localStorage.getItem('gameDevTycoonSave'));
            if (!saveData) {
                this.uiManager.showNotification('저장된 게임을 찾을 수 없습니다.', 'error');
                return false;
            }
            
            // 데이터 로드
            this.player = saveData.player;
            this.day = saveData.gameTime.day;
            this.week = saveData.gameTime.week;
            this.month = saveData.gameTime.month;
            this.year = saveData.gameTime.year;
            
            // 매니저 데이터 로드
            this.projectManager.loadData(saveData.projects, saveData.completedProjects);
            this.employeeManager.loadData(saveData.employees);
            this.researchManager.loadData(saveData.research);
            this.marketingManager.loadData(saveData.marketing);
            this.financeManager.loadData(saveData.finances);
            
            // UI 업데이트
            this.uiManager.updateUI();
            
            // 게임 상태 변경
            this.gameState = 'playing';
            document.getElementById('main-menu').style.display = 'none';
            document.getElementById('game-ui').style.display = 'flex';
            
            this.uiManager.showNotification('게임을 불러왔습니다.', 'success');
            return true;
        } catch (error) {
            console.error('게임 로드 실패:', error);
            this.uiManager.showNotification('게임 로드에 실패했습니다.', 'error');
            return false;
        }
    }
}

// 게임 시작 시 GameManager 인스턴스 생성
let gameManager;

document.addEventListener('DOMContentLoaded', () => {
    gameManager = new GameManager();
});