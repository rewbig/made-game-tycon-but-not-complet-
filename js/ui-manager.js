/**
 * UI 매니저 - 게임 UI 관리
 */

class UIManager {
    constructor(gameManager) {
        this.gameManager = gameManager;
        
        // 현재 활성화된 탭
        this.activeTab = 'studio';
        
        // 현재 열린 다이얼로그
        this.currentDialog = null;
        
        // 알림 타이머
        this.notificationTimer = null;
        
        // 이벤트 리스너 설정
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // 탭 전환 버튼
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.getAttribute('data-tab');
                this.showTab(tabId);
            });
        });
        
        // 메뉴 버튼 - HTML에 해당 요소가 없으므로 안전하게 처리
        const menuBtn = document.getElementById('menu-btn');
        if (menuBtn) {
            menuBtn.addEventListener('click', () => this.showGameMenu());
        }
        
        // 다이얼로그 닫기 버튼 (동적으로 생성되는 요소이므로 이벤트 위임 사용)
        document.addEventListener('click', (event) => {
            if (event.target.classList.contains('dialog-close') || event.target.id === 'dialog-close') {
                this.closeDialog();
            }
        });
        
        // 다이얼로그 확인 및 취소 버튼
        const dialogConfirm = document.getElementById('dialog-confirm');
        const dialogCancel = document.getElementById('dialog-cancel');
        
        if (dialogConfirm) {
            dialogConfirm.addEventListener('click', () => {
                // 다이얼로그 확인 버튼 클릭 시 처리
                this.closeDialog();
            });
        }
        
        if (dialogCancel) {
            dialogCancel.addEventListener('click', () => {
                // 다이얼로그 취소 버튼 클릭 시 처리
                this.closeDialog();
            });
        }
    }
    
    updateUI() {
        // 게임 상태에 따라 UI 업데이트
        if (this.gameManager.gameState === 'mainMenu') {
            document.getElementById('main-menu').style.display = 'flex';
            document.getElementById('game-ui').style.display = 'none';
        } else if (this.gameManager.gameState === 'playing') {
            document.getElementById('main-menu').style.display = 'none';
            document.getElementById('game-ui').style.display = 'flex';
            
            // 게임 내 UI 업데이트
            this.updateResourceDisplay();
            this.updateTimeDisplay();
            this.updateSkillsDisplay();
            
            // 스튜디오 이름 업데이트
            document.getElementById('studio-name').textContent = this.gameManager.player.studioName;
        }
    }
    
    updateResourceDisplay() {
        // 자금 업데이트
        document.getElementById('money-display').textContent = this.gameManager.player.money.toLocaleString() + '원';
        
        // 명성 업데이트
        document.getElementById('reputation-display').textContent = Math.round(this.gameManager.player.reputation);
        
        // 팬 업데이트
        document.getElementById('fans-display').textContent = this.gameManager.player.fans.toLocaleString() + '명';
    }
    
    updateTimeDisplay() {
        // 게임 내 시간 업데이트
        document.getElementById('time-display').textContent = 
            `${this.gameManager.year}년 ${this.gameManager.month}월 ${this.gameManager.week}주차 ${this.gameManager.day}일`;
    }
    
    updateSkillsDisplay() {
        // 플레이어 스킬 업데이트
        const skillsContainer = document.getElementById('player-skills');
        
        if (skillsContainer) {
            const skills = this.gameManager.player.skills;
            
            skillsContainer.innerHTML = Object.entries(skills).map(([skill, level]) => `
                <div class="skill-item">
                    <span class="skill-name">${this.getSkillDisplayName(skill)}</span>
                    <div class="skill-bar">
                        <div class="skill-fill" style="width: ${Math.min(level * 10, 100)}%"></div>
                    </div>
                    <span class="skill-level">${level.toFixed(1)}</span>
                </div>
            `).join('');
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
    
    showTab(tabId) {
        // 이전 활성 탭 비활성화
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
        
        // 새 탭 활성화
        document.querySelector(`.tab-btn[data-tab="${tabId}"]`).classList.add('active');
        document.getElementById(`${tabId}-tab`).classList.add('active');
        
        // 활성 탭 저장
        this.activeTab = tabId;
        
        // 탭별 특수 업데이트
        switch (tabId) {
            case 'studio':
                // 스튜디오 정보 업데이트
                this.updateStudioInfo();
                break;
            case 'project':
                // 프로젝트 정보 업데이트
                this.gameManager.projectManager.updateProjectDisplay();
                this.gameManager.projectManager.updateCompletedProjectsDisplay();
                break;
            case 'employee':
                // 직원 정보 업데이트
                this.gameManager.employeeManager.updateEmployeeDisplay();
                break;
            case 'research':
                // 연구 정보 업데이트
                if (this.gameManager.researchManager) {
                    this.gameManager.researchManager.updateResearchDisplay();
                }
                break;
            case 'marketing':
                // 마케팅 정보 업데이트
                if (this.gameManager.marketingManager) {
                    this.gameManager.marketingManager.updateMarketingDisplay();
                }
                break;
            case 'finance':
                // 재정 정보 업데이트
                if (this.gameManager.financeManager) {
                    this.gameManager.financeManager.updateFinanceDisplay();
                }
                break;
        }
    }
    
    updateStudioInfo() {
        // 스튜디오 정보 탭 업데이트
        const studioInfoContainer = document.getElementById('studio-info');
        
        if (studioInfoContainer) {
            // 스튜디오 통계 계산
            const totalGames = this.gameManager.projectManager.completedProjects.length;
            const totalSales = this.gameManager.projectManager.completedProjects.reduce((sum, project) => sum + project.sales, 0);
            const totalRevenue = this.gameManager.projectManager.completedProjects.reduce((sum, project) => sum + project.revenue, 0);
            const avgRating = totalGames > 0 ? 
                this.gameManager.projectManager.completedProjects.reduce((sum, project) => sum + project.rating, 0) / totalGames : 0;
            
            // 스튜디오 레벨 계산 (명성 기반)
            const studioLevel = Math.floor(this.gameManager.player.reputation / 20) + 1;
            
            studioInfoContainer.innerHTML = `
                <div class="studio-details">
                    <h3>${this.gameManager.player.studioName}</h3>
                    <div class="studio-level">레벨 ${studioLevel}</div>
                    
                    <div class="studio-stats">
                        <div class="stat">
                            <span class="stat-label">설립일</span>
                            <span class="stat-value">1년 1월 1일</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">현재</span>
                            <span class="stat-value">${this.gameManager.year}년 ${this.gameManager.month}월</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">직원 수</span>
                            <span class="stat-value">${this.gameManager.employeeManager.employees.length}명</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">출시 게임</span>
                            <span class="stat-value">${totalGames}개</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">총 판매량</span>
                            <span class="stat-value">${totalSales.toLocaleString()}개</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">총 수익</span>
                            <span class="stat-value">${totalRevenue.toLocaleString()}원</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">평균 평점</span>
                            <span class="stat-value">${avgRating.toFixed(1)}/10</span>
                        </div>
                    </div>
                    
                    <h4>플레이어 스킬</h4>
                    <div id="player-skills" class="skills-container">
                        <!-- 스킬 항목들이 동적으로 추가됨 -->
                    </div>
                </div>
            `;
            
            // 스킬 업데이트
            this.updateSkillsDisplay();
        }
    }
    
    showGameMenu() {
        // 게임 메뉴 다이얼로그 표시
        this.showDialog(
            '게임 메뉴',
            `
            <div class="menu-buttons">
                <button id="save-game-btn" class="btn btn-primary">게임 저장</button>
                <button id="load-game-btn" class="btn btn-secondary">게임 불러오기</button>
                <button id="options-btn" class="btn btn-secondary">옵션</button>
                <button id="main-menu-btn" class="btn btn-danger">메인 메뉴로</button>
            </div>
            `,
            [
                {
                    text: '계속하기',
                    callback: () => {}
                }
            ],
            () => {
                // 저장 버튼 이벤트 리스너
                document.getElementById('save-game-btn').addEventListener('click', () => {
                    const success = this.gameManager.saveGame();
                    if (success) {
                        this.closeDialog();
                    }
                });
                
                // 불러오기 버튼 이벤트 리스너
                document.getElementById('load-game-btn').addEventListener('click', () => {
                    const success = this.gameManager.loadGame();
                    if (success) {
                        this.closeDialog();
                    }
                });
                
                // 옵션 버튼 이벤트 리스너
                document.getElementById('options-btn').addEventListener('click', () => {
                    this.showOptionsDialog();
                });
                
                // 메인 메뉴 버튼 이벤트 리스너
                document.getElementById('main-menu-btn').addEventListener('click', () => {
                    this.showDialog(
                        '메인 메뉴로 돌아가기',
                        '정말 메인 메뉴로 돌아가시겠습니까? 저장되지 않은 진행 상황은 모두 사라집니다.',
                        [
                            {
                                text: '메인 메뉴로',
                                callback: () => this.gameManager.returnToMainMenu()
                            },
                            {
                                text: '취소',
                                callback: () => {}
                            }
                        ]
                    );
                });
            }
        );
    }
    
    showOptionsDialog() {
        // 옵션 다이얼로그 표시
        this.showDialog(
            '옵션',
            `
            <div class="options-container">
                <div class="option-group">
                    <h4>그래픽 설정</h4>
                    <div class="option-item">
                        <label for="graphics-quality">그래픽 품질</label>
                        <select id="graphics-quality" class="form-control">
                            <option value="low">낮음</option>
                            <option value="medium" selected>중간</option>
                            <option value="high">높음</option>
                        </select>
                    </div>
                </div>
                
                <div class="option-group">
                    <h4>소리 설정</h4>
                    <div class="option-item">
                        <label for="sound-volume">소리 볼륨</label>
                        <input type="range" id="sound-volume" class="form-control" min="0" max="100" value="50">
                    </div>
                    <div class="option-item">
                        <label for="music-volume">음악 볼륨</label>
                        <input type="range" id="music-volume" class="form-control" min="0" max="100" value="50">
                    </div>
                </div>
            </div>
            `,
            [
                {
                    text: '적용',
                    callback: () => {
                        // 옵션 적용 로직 (구현 필요)
                        this.showNotification('옵션이 적용되었습니다.', 'info');
                    }
                },
                {
                    text: '취소',
                    callback: () => {}
                }
            ]
        );
    }
    
    showDialog(title, content, buttons = [], onOpen = null) {
        // 이미 열린 다이얼로그가 있으면 닫기
        if (this.currentDialog) {
            this.closeDialog();
        }
        
        // 기존 다이얼로그 요소 사용
        const overlay = document.getElementById('dialog-overlay');
        const dialogTitle = document.getElementById('dialog-title');
        const dialogContent = document.getElementById('dialog-content');
        const dialogButtons = document.getElementById('dialog-buttons');
        
        if (overlay && dialogTitle && dialogContent && dialogButtons) {
            // 기존 다이얼로그 요소 사용
            dialogTitle.textContent = title;
            dialogContent.innerHTML = content;
            
            // 버튼 초기화
            dialogButtons.innerHTML = '';
            
            // 버튼 추가
            if (buttons.length > 0) {
                buttons.forEach((button, index) => {
                    const btn = document.createElement('button');
                    btn.className = `btn ${index === 0 ? 'btn-primary' : 'btn-secondary'}`;
                    btn.textContent = button.text;
                    btn.addEventListener('click', () => {
                        if (button.callback) button.callback();
                        this.closeDialog();
                    });
                    dialogButtons.appendChild(btn);
                });
            } else {
                // 기본 버튼 추가
                const confirmBtn = document.createElement('button');
                confirmBtn.id = 'dialog-confirm';
                confirmBtn.className = 'btn-primary';
                confirmBtn.textContent = '확인';
                confirmBtn.addEventListener('click', () => this.closeDialog());
                dialogButtons.appendChild(confirmBtn);
            }
            
            // 다이얼로그 표시
            overlay.classList.remove('hidden');
            this.currentDialog = overlay;
        } else {
            // 기존 요소가 없는 경우 동적으로 생성
            const overlay = document.createElement('div');
            overlay.className = 'dialog-overlay';
            
            // 다이얼로그 컨테이너 생성
            const dialog = document.createElement('div');
            dialog.className = 'dialog';
            
            // 다이얼로그 헤더 생성
            const header = document.createElement('div');
            header.className = 'dialog-header';
            header.innerHTML = `
                <h3>${title}</h3>
                <button class="dialog-close">&times;</button>
            `;
            
            // 다이얼로그 내용 생성
            const body = document.createElement('div');
            body.className = 'dialog-body';
            body.innerHTML = content;
            
            // 다이얼로그 푸터 생성 (버튼이 있는 경우)
            const footer = document.createElement('div');
            footer.className = 'dialog-footer';
            
            if (buttons.length > 0) {
                buttons.forEach((button, index) => {
                    const btn = document.createElement('button');
                    btn.className = `btn ${index === 0 ? 'btn-primary' : 'btn-secondary'}`;
                    btn.textContent = button.text;
                    btn.addEventListener('click', () => {
                        if (button.callback) button.callback();
                        this.closeDialog();
                    });
                    footer.appendChild(btn);
                });
            }
            
            // 다이얼로그 조립
            dialog.appendChild(header);
            dialog.appendChild(body);
            if (buttons.length > 0) {
                dialog.appendChild(footer);
            }
            
            overlay.appendChild(dialog);
            document.body.appendChild(overlay);
            this.currentDialog = overlay;
        }
        
        // 현재 다이얼로그 저장
        this.currentDialog = overlay;
        
        // 열기 콜백 실행
        if (onOpen) {
            onOpen();
        }
        
        // ESC 키로 다이얼로그 닫기
        const escHandler = (event) => {
            if (event.key === 'Escape') {
                this.closeDialog();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    }
    
    closeDialog() {
        if (this.currentDialog) {
            // 기존 다이얼로그 요소인 경우 숨기기
            if (this.currentDialog.id === 'dialog-overlay') {
                this.currentDialog.classList.add('hidden');
            } else {
                // 동적으로 생성된 다이얼로그인 경우 제거
                document.body.removeChild(this.currentDialog);
            }
            this.currentDialog = null;
        }
    }
    
    showNotification(message, type = 'info') {
        // 알림 컨테이너 가져오기 또는 생성
        let notificationContainer = document.getElementById('notification-container');
        
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.id = 'notification-container';
            document.body.appendChild(notificationContainer);
        }
        
        // 이전 알림 타이머 취소
        if (this.notificationTimer) {
            clearTimeout(this.notificationTimer);
        }
        
        // 알림 요소 생성
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // 기존 알림 제거 및 새 알림 추가
        notificationContainer.innerHTML = '';
        notificationContainer.appendChild(notification);
        
        // 알림 표시
        notificationContainer.style.display = 'block';
        
        // 3초 후 알림 숨기기
        this.notificationTimer = setTimeout(() => {
            notificationContainer.style.display = 'none';
        }, 3000);
    }
}