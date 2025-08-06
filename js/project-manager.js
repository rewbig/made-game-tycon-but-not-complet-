/**
 * 프로젝트 매니저 - 게임 개발 프로젝트 관리
 */

class ProjectManager {
    constructor(gameManager) {
        this.gameManager = gameManager;
        
        // 현재 진행 중인 프로젝트
        this.currentProject = null;
        
        // 완료된 프로젝트 목록
        this.completedProjects = [];
        
        // 사용 가능한 게임 장르
        this.availableGenres = [
            new GameGenre('캐주얼', 1, 0.8, 1.2, 0.7, 1.0),
            new GameGenre('퍼즐', 1, 0.7, 0.9, 0.8, 1.1),
            new GameGenre('아케이드', 1, 0.9, 1.0, 0.9, 1.0)
        ];
        
        // 잠긴 장르 (연구를 통해 해금 가능)
        this.lockedGenres = [
            new GameGenre('액션', 2, 1.0, 1.2, 1.0, 1.2),
            new GameGenre('어드벤처', 2, 1.1, 1.3, 1.1, 0.9),
            new GameGenre('롤플레잉', 3, 1.3, 1.5, 1.2, 1.1),
            new GameGenre('시뮬레이션', 3, 1.2, 1.0, 1.3, 1.0),
            new GameGenre('전략', 3, 1.1, 0.9, 1.4, 0.9),
            new GameGenre('스포츠', 2, 1.0, 1.1, 1.0, 1.3),
            new GameGenre('레이싱', 2, 0.9, 1.2, 1.1, 1.2),
            new GameGenre('슈팅', 2, 0.8, 1.3, 1.0, 1.1),
            new GameGenre('샌드박스', 4, 1.4, 1.2, 1.5, 0.8),
            new GameGenre('공포', 3, 1.2, 1.4, 1.1, 1.0),
            new GameGenre('MMORPG', 5, 1.5, 1.7, 1.6, 1.4)
        ];
        
        // 사용 가능한 게임 플랫폼
        this.availablePlatforms = [
            new GamePlatform('PC', 1, 1.0, 10000000, 0.7),
            new GamePlatform('모바일', 1, 0.8, 50000000, 0.5)
        ];
        
        // 잠긴 플랫폼 (연구를 통해 해금 가능)
        this.lockedPlatforms = [
            new GamePlatform('콘솔', 2, 1.2, 5000000, 0.9),
            new GamePlatform('VR', 3, 1.5, 1000000, 1.2),
            new GamePlatform('AR', 4, 1.4, 2000000, 1.1),
            new GamePlatform('클라우드', 3, 1.3, 8000000, 0.8)
        ];
        
        // 개발 단계
        this.developmentStages = [
            'concept', // 기획 단계
            'prototype', // 프로토타입 단계
            'development', // 개발 단계
            'testing', // 테스트 단계
            'release' // 출시 단계
        ];
        
        // 이벤트 리스너 설정
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // 새 프로젝트 시작 버튼
        const newProjectBtn = document.getElementById('new-project-btn');
        if (newProjectBtn) {
            newProjectBtn.addEventListener('click', () => this.showNewProjectDialog());
        }
        
        // 프로젝트 정보 업데이트 이벤트
        document.addEventListener('projectUpdated', () => this.updateProjectDisplay());
    }
    
    showNewProjectDialog() {
        // 현재 프로젝트가 있는 경우 경고
        if (this.currentProject) {
            this.gameManager.uiManager.showDialog(
                '진행 중인 프로젝트',
                '이미 진행 중인 프로젝트가 있습니다. 새 프로젝트를 시작하면 현재 프로젝트는 취소됩니다.',
                [
                    {
                        text: '계속',
                        callback: () => this.openNewProjectForm()
                    },
                    {
                        text: '취소',
                        callback: () => {}
                    }
                ]
            );
        } else {
            this.openNewProjectForm();
        }
    }
    
    openNewProjectForm() {
        // 새 프로젝트 폼 생성
        const formContent = `
            <div class="form-group">
                <label for="project-name">게임 제목</label>
                <input type="text" id="project-name" class="form-control" placeholder="게임 제목을 입력하세요">
            </div>
            <div class="form-group">
                <label for="project-genre">장르</label>
                <select id="project-genre" class="form-control">
                    ${this.availableGenres.map(genre => `<option value="${genre.name}">${genre.name}</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label for="project-platform">플랫폼</label>
                <select id="project-platform" class="form-control">
                    ${this.availablePlatforms.map(platform => `<option value="${platform.name}">${platform.name}</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label for="project-budget">예산 (현재 자금: ${this.gameManager.player.money.toLocaleString()}원)</label>
                <input type="range" id="project-budget" class="form-control" min="10000" max="${Math.min(this.gameManager.player.money, 1000000)}" step="10000" value="50000">
                <span id="budget-display">50,000원</span>
            </div>
        `;
        
        this.gameManager.uiManager.showDialog(
            '새 프로젝트 시작',
            formContent,
            [
                {
                    text: '시작',
                    callback: () => this.startNewProject()
                },
                {
                    text: '취소',
                    callback: () => {}
                }
            ],
            () => {
                // 예산 슬라이더 이벤트 리스너
                const budgetSlider = document.getElementById('project-budget');
                const budgetDisplay = document.getElementById('budget-display');
                
                budgetSlider.addEventListener('input', () => {
                    budgetDisplay.textContent = parseInt(budgetSlider.value).toLocaleString() + '원';
                });
            }
        );
    }
    
    startNewProject() {
        const projectName = document.getElementById('project-name').value.trim();
        const genreName = document.getElementById('project-genre').value;
        const platformName = document.getElementById('project-platform').value;
        const budget = parseInt(document.getElementById('project-budget').value);
        
        if (!projectName) {
            alert('게임 제목을 입력해주세요.');
            return;
        }
        
        if (budget > this.gameManager.player.money) {
            alert('예산이 현재 자금보다 많습니다.');
            return;
        }
        
        // 현재 프로젝트 취소 (있는 경우)
        if (this.currentProject) {
            this.cancelProject();
        }
        
        // 선택한 장르와 플랫폼 찾기
        const genre = this.availableGenres.find(g => g.name === genreName);
        const platform = this.availablePlatforms.find(p => p.name === platformName);
        
        // 새 프로젝트 생성
        this.currentProject = {
            name: projectName,
            genre: genre,
            platform: platform,
            budget: budget,
            remainingBudget: budget,
            stage: 'concept',
            stageProgress: 0,
            overallProgress: 0,
            quality: 0,
            startDate: {
                day: this.gameManager.day,
                week: this.gameManager.week,
                month: this.gameManager.month,
                year: this.gameManager.year
            },
            releaseDate: null,
            marketing: 0,
            sales: 0,
            revenue: 0,
            reviews: [],
            rating: 0
        };
        
        // 예산 차감
        this.gameManager.addMoney(-budget);
        
        // UI 업데이트
        this.updateProjectDisplay();
        
        // 알림 표시
        this.gameManager.uiManager.showNotification(`새 프로젝트 '${projectName}'을(를) 시작했습니다!`, 'success');
        
        // 프로젝트 탭으로 전환
        this.gameManager.uiManager.showTab('project');
    }
    
    updateProjects() {
        if (!this.currentProject || this.gameManager.paused) return;
        
        // 현재 프로젝트 진행 업데이트
        this.updateProjectProgress();
        
        // 프로젝트 예산 소비
        this.consumeBudget();
        
        // UI 업데이트
        this.updateProjectDisplay();
    }
    
    updateProjectProgress() {
        if (!this.currentProject) return;
        
        const project = this.currentProject;
        const stageIndex = this.developmentStages.indexOf(project.stage);
        
        // 스킬 기반 진행도 계산
        let progressRate = 0.5; // 기본 진행 속도
        
        // 스테이지별 중요 스킬 가중치 적용
        switch (project.stage) {
            case 'concept':
                progressRate += this.gameManager.player.skills.design * 0.1;
                break;
            case 'prototype':
                progressRate += this.gameManager.player.skills.programming * 0.05 + this.gameManager.player.skills.design * 0.05;
                break;
            case 'development':
                progressRate += this.gameManager.player.skills.programming * 0.07 + this.gameManager.player.skills.art * 0.05 + this.gameManager.player.skills.sound * 0.03;
                break;
            case 'testing':
                progressRate += this.gameManager.player.skills.programming * 0.05 + this.gameManager.player.skills.design * 0.05;
                break;
            case 'release':
                progressRate += this.gameManager.player.skills.marketing * 0.1;
                break;
        }
        
        // 직원 수에 따른 보너스
        const employeeCount = this.gameManager.employeeManager.employees.length;
        progressRate += employeeCount * 0.1;
        
        // 장르 난이도에 따른 조정
        progressRate /= project.genre.difficulty;
        
        // 플랫폼 난이도에 따른 조정
        progressRate /= project.platform.difficulty;
        
        // 진행도 업데이트
        project.stageProgress += progressRate;
        
        // 스테이지 완료 체크
        if (project.stageProgress >= 100) {
            project.stageProgress = 0;
            
            // 다음 스테이지로 이동
            if (stageIndex < this.developmentStages.length - 1) {
                project.stage = this.developmentStages[stageIndex + 1];
                this.gameManager.uiManager.showNotification(`프로젝트가 ${this.getStageName(project.stage)} 단계로 진입했습니다.`, 'info');
            } else {
                // 프로젝트 완료
                this.completeProject();
                return;
            }
        }
        
        // 전체 진행도 계산 (각 스테이지는 20%씩 차지)
        project.overallProgress = (stageIndex * 20) + (project.stageProgress / 5);
        
        // 품질 업데이트
        this.updateProjectQuality();
    }
    
    updateProjectQuality() {
        if (!this.currentProject) return;
        
        const project = this.currentProject;
        
        // 기본 품질 증가
        let qualityIncrease = 0.1;
        
        // 스킬 기반 품질 증가
        qualityIncrease += (
            this.gameManager.player.skills.programming * 0.02 +
            this.gameManager.player.skills.design * 0.03 +
            this.gameManager.player.skills.art * 0.02 +
            this.gameManager.player.skills.sound * 0.01
        );
        
        // 직원 수에 따른 보너스
        const employeeCount = this.gameManager.employeeManager.employees.length;
        qualityIncrease += employeeCount * 0.02;
        
        // 예산 비율에 따른 보너스
        const budgetRatio = project.remainingBudget / project.budget;
        qualityIncrease *= (0.5 + budgetRatio * 0.5); // 예산이 많이 남을수록 품질 증가
        
        // 품질 업데이트
        project.quality += qualityIncrease;
        
        // 최대 품질 제한 (100)
        if (project.quality > 100) project.quality = 100;
    }
    
    consumeBudget() {
        if (!this.currentProject) return;
        
        const project = this.currentProject;
        
        // 일일 예산 소비 계산
        const dailyConsumption = project.budget * 0.005; // 하루에 예산의 0.5% 소비
        
        // 예산 차감
        project.remainingBudget -= dailyConsumption;
        
        // 예산 부족 체크
        if (project.remainingBudget <= 0) {
            project.remainingBudget = 0;
            this.gameManager.uiManager.showNotification('프로젝트 예산이 소진되었습니다!', 'warning');
            
            // 품질 감소 (예산 부족 페널티)
            project.quality *= 0.99; // 매일 1% 품질 감소
        }
    }
    
    completeProject() {
        if (!this.currentProject) return;
        
        const project = this.currentProject;
        
        // 출시일 기록
        project.releaseDate = {
            day: this.gameManager.day,
            week: this.gameManager.week,
            month: this.gameManager.month,
            year: this.gameManager.year
        };
        
        // 리뷰 점수 계산
        this.calculateReviews();
        
        // 초기 판매량 계산
        this.calculateInitialSales();
        
        // 완료된 프로젝트 목록에 추가
        this.completedProjects.push(project);
        
        // 경험치 및 명성 획득
        this.gameManager.addReputation(project.rating * 2);
        this.gameManager.improveSkill('programming', 0.2);
        this.gameManager.improveSkill('design', 0.2);
        this.gameManager.improveSkill('art', 0.2);
        this.gameManager.improveSkill('sound', 0.2);
        
        // 출시 알림
        this.gameManager.uiManager.showNotification(`'${project.name}' 게임이 출시되었습니다! 평균 평점: ${project.rating.toFixed(1)}/10`, 'success');
        
        // 출시 다이얼로그 표시
        this.showReleaseDialog(project);
        
        // 현재 프로젝트 초기화
        this.currentProject = null;
        
        // UI 업데이트
        this.updateProjectDisplay();
        this.updateCompletedProjectsDisplay();
    }
    
    calculateReviews() {
        if (!this.currentProject) return;
        
        const project = this.currentProject;
        const reviews = [];
        
        // 리뷰 사이트 목록
        const reviewSites = [
            '게임스팟',
            'IGN',
            '게임인포머',
            '팬덤 리뷰',
            '메타크리틱'
        ];
        
        // 기본 품질 점수 (0-10 스케일)
        let baseScore = project.quality / 10;
        
        // 장르 인기도 보너스
        baseScore *= project.genre.popularityMultiplier;
        
        // 플랫폼 인기도 보너스
        baseScore *= project.platform.popularityMultiplier;
        
        // 마케팅 보너스
        baseScore *= (1 + project.marketing / 100);
        
        // 각 리뷰 사이트별 점수 생성 (약간의 변동성 추가)
        reviewSites.forEach(site => {
            const variance = Math.random() * 2 - 1; // -1 ~ 1 사이의 변동
            let score = baseScore + variance;
            
            // 점수 범위 제한 (0-10)
            if (score < 0) score = 0;
            if (score > 10) score = 10;
            
            reviews.push({
                site: site,
                score: score
            });
        });
        
        // 프로젝트에 리뷰 저장
        project.reviews = reviews;
        
        // 평균 평점 계산
        const totalScore = reviews.reduce((sum, review) => sum + review.score, 0);
        project.rating = totalScore / reviews.length;
    }
    
    calculateInitialSales() {
        if (!this.currentProject) return;
        
        const project = this.currentProject;
        
        // 기본 판매량 (평점 기반)
        let baseSales = Math.pow(project.rating, 2) * 1000;
        
        // 장르 인기도 보너스
        baseSales *= project.genre.salesMultiplier;
        
        // 플랫폼 사용자 기반 보너스
        baseSales *= (project.platform.userBase / 1000000);
        
        // 마케팅 보너스
        baseSales *= (1 + project.marketing / 50);
        
        // 스튜디오 명성 보너스
        baseSales *= (1 + this.gameManager.player.reputation / 100);
        
        // 팬 기반 보너스
        baseSales *= (1 + this.gameManager.player.fans / 10000);
        
        // 약간의 랜덤 요소 추가
        const randomFactor = 0.8 + Math.random() * 0.4; // 0.8 ~ 1.2 사이의 랜덤 요소
        baseSales *= randomFactor;
        
        // 판매량 저장 (정수로 반올림)
        project.sales = Math.round(baseSales);
        
        // 수익 계산 (판매량 * 플랫폼 수익률)
        project.revenue = Math.round(project.sales * project.platform.revenuePerSale);
        
        // 수익 추가
        this.gameManager.addMoney(project.revenue);
        
        // 팬 증가
        const newFans = Math.round(project.sales * 0.1);
        this.gameManager.addFans(newFans);
    }
    
    updateGameSales() {
        // 출시된 게임의 지속적인 판매 업데이트
        this.completedProjects.forEach(project => {
            // 출시 후 경과 일수 계산
            const releaseDay = project.releaseDate.day + 
                              (project.releaseDate.week - 1) * 7 + 
                              (project.releaseDate.month - 1) * 28 + 
                              (project.releaseDate.year - 1) * 336;
            
            const currentDay = this.gameManager.day + 
                              (this.gameManager.week - 1) * 7 + 
                              (this.gameManager.month - 1) * 28 + 
                              (this.gameManager.year - 1) * 336;
            
            const daysSinceRelease = currentDay - releaseDay;
            
            // 출시 후 1년(336일)까지만 판매 발생
            if (daysSinceRelease <= 336) {
                // 판매 감소 곡선 (출시 직후 많이 팔리고 점점 감소)
                const salesDecay = Math.exp(-daysSinceRelease / 100);
                
                // 일일 판매량 계산
                const dailySales = Math.round(project.sales * 0.01 * salesDecay);
                
                if (dailySales > 0) {
                    // 판매량 업데이트
                    project.sales += dailySales;
                    
                    // 수익 계산 및 추가
                    const dailyRevenue = Math.round(dailySales * project.platform.revenuePerSale);
                    project.revenue += dailyRevenue;
                    this.gameManager.addMoney(dailyRevenue);
                }
            }
        });
        
        // 오래된 게임 정리 (3년 이상 지난 게임)
        this.cleanupOldGames();
    }
    
    cleanupOldGames() {
        // 3년(1008일) 이상 지난 게임 목록에서 제거
        this.completedProjects = this.completedProjects.filter(project => {
            const releaseDay = project.releaseDate.day + 
                              (project.releaseDate.week - 1) * 7 + 
                              (project.releaseDate.month - 1) * 28 + 
                              (project.releaseDate.year - 1) * 336;
            
            const currentDay = this.gameManager.day + 
                              (this.gameManager.week - 1) * 7 + 
                              (this.gameManager.month - 1) * 28 + 
                              (this.gameManager.year - 1) * 336;
            
            return (currentDay - releaseDay) <= 1008;
        });
    }
    
    cancelProject() {
        if (!this.currentProject) return;
        
        // 남은 예산의 50%만 환불
        const refund = Math.round(this.currentProject.remainingBudget * 0.5);
        this.gameManager.addMoney(refund);
        
        // 알림 표시
        this.gameManager.uiManager.showNotification(`프로젝트 '${this.currentProject.name}'이(가) 취소되었습니다. ${refund.toLocaleString()}원이 환불되었습니다.`, 'warning');
        
        // 현재 프로젝트 초기화
        this.currentProject = null;
        
        // UI 업데이트
        this.updateProjectDisplay();
    }
    
    investInMarketing() {
        if (!this.currentProject) {
            this.gameManager.uiManager.showNotification('진행 중인 프로젝트가 없습니다.', 'error');
            return;
        }
        
        // 마케팅 투자 다이얼로그 표시
        const formContent = `
            <div class="form-group">
                <label for="marketing-budget">마케팅 예산 (현재 자금: ${this.gameManager.player.money.toLocaleString()}원)</label>
                <input type="range" id="marketing-budget" class="form-control" min="10000" max="${Math.min(this.gameManager.player.money, 500000)}" step="10000" value="50000">
                <span id="marketing-budget-display">50,000원</span>
            </div>
            <p>마케팅에 투자하면 게임 출시 후 판매량과 평점이 향상됩니다.</p>
        `;
        
        this.gameManager.uiManager.showDialog(
            '마케팅 투자',
            formContent,
            [
                {
                    text: '투자',
                    callback: () => {
                        const marketingBudget = parseInt(document.getElementById('marketing-budget').value);
                        this.applyMarketingInvestment(marketingBudget);
                    }
                },
                {
                    text: '취소',
                    callback: () => {}
                }
            ],
            () => {
                // 예산 슬라이더 이벤트 리스너
                const budgetSlider = document.getElementById('marketing-budget');
                const budgetDisplay = document.getElementById('marketing-budget-display');
                
                budgetSlider.addEventListener('input', () => {
                    budgetDisplay.textContent = parseInt(budgetSlider.value).toLocaleString() + '원';
                });
            }
        );
    }
    
    applyMarketingInvestment(budget) {
        if (!this.currentProject || budget > this.gameManager.player.money) return;
        
        // 마케팅 포인트 계산 (예산에 비례)
        const marketingPoints = budget / 5000; // 5000원당 1 마케팅 포인트
        
        // 마케팅 포인트 추가
        this.currentProject.marketing += marketingPoints;
        
        // 예산 차감
        this.gameManager.addMoney(-budget);
        
        // 알림 표시
        this.gameManager.uiManager.showNotification(`${budget.toLocaleString()}원을 마케팅에 투자했습니다.`, 'info');
        
        // UI 업데이트
        this.updateProjectDisplay();
    }
    
    showReleaseDialog(project) {
        // 출시 결과 다이얼로그 표시
        const reviewsHtml = project.reviews.map(review => 
            `<div class="review-item">
                <span class="review-site">${review.site}</span>
                <span class="review-score">${review.score.toFixed(1)}/10</span>
            </div>`
        ).join('');
        
        const dialogContent = `
            <h3>게임 출시 결과</h3>
            <div class="release-info">
                <p><strong>게임 제목:</strong> ${project.name}</p>
                <p><strong>장르:</strong> ${project.genre.name}</p>
                <p><strong>플랫폼:</strong> ${project.platform.name}</p>
                <p><strong>품질:</strong> ${project.quality.toFixed(1)}/100</p>
                <p><strong>평균 평점:</strong> ${project.rating.toFixed(1)}/10</p>
                <p><strong>초기 판매량:</strong> ${project.sales.toLocaleString()}개</p>
                <p><strong>초기 수익:</strong> ${project.revenue.toLocaleString()}원</p>
            </div>
            
            <h4>리뷰 점수</h4>
            <div class="reviews-container">
                ${reviewsHtml}
            </div>
        `;
        
        this.gameManager.uiManager.showDialog(
            '게임 출시',
            dialogContent,
            [
                {
                    text: '확인',
                    callback: () => {}
                }
            ]
        );
    }
    
    processGameAwards() {
        // 지난 1년 동안 출시된 게임 중 최고 평점 게임 찾기
        const lastYearGames = this.completedProjects.filter(project => {
            return project.releaseDate.year === this.gameManager.year - 1 ||
                  (project.releaseDate.year === this.gameManager.year && project.releaseDate.month === 1);
        });
        
        if (lastYearGames.length === 0) return;
        
        // 평점 기준으로 정렬
        lastYearGames.sort((a, b) => b.rating - a.rating);
        
        // 최고 평점 게임
        const bestGame = lastYearGames[0];
        
        // 평점이 7 이상인 경우에만 수상
        if (bestGame.rating >= 7) {
            // 수상 보너스
            const awardBonus = Math.round(bestGame.revenue * 0.2); // 수익의 20% 보너스
            this.gameManager.addMoney(awardBonus);
            
            // 명성 보너스
            this.gameManager.addReputation(20);
            
            // 팬 보너스
            this.gameManager.addFans(5000);
            
            // 수상 알림
            this.gameManager.uiManager.showDialog(
                '연간 게임 어워드',
                `축하합니다! 당신의 게임 '${bestGame.name}'이(가) '올해의 게임' 상을 수상했습니다!<br><br>
                 보너스 수익: ${awardBonus.toLocaleString()}원<br>
                 명성 증가: +20<br>
                 팬 증가: +5,000명`,
                [
                    {
                        text: '감사합니다!',
                        callback: () => {}
                    }
                ]
            );
        }
    }
    
    updateProjectDisplay() {
        const projectContainer = document.getElementById('project-info');
        
        if (!this.currentProject) {
            // 진행 중인 프로젝트가 없는 경우
            projectContainer.innerHTML = `
                <div class="empty-state">
                    <h3>진행 중인 프로젝트가 없습니다</h3>
                    <p>새 게임 프로젝트를 시작하세요!</p>
                    <button id="start-project-btn" class="btn btn-primary">새 프로젝트 시작</button>
                </div>
            `;
            
            // 이벤트 리스너 다시 설정
            document.getElementById('start-project-btn').addEventListener('click', () => this.showNewProjectDialog());
        } else {
            // 진행 중인 프로젝트 정보 표시
            const project = this.currentProject;
            
            projectContainer.innerHTML = `
                <div class="project-details">
                    <h3>${project.name}</h3>
                    <div class="project-meta">
                        <span class="genre">${project.genre.name}</span> | 
                        <span class="platform">${project.platform.name}</span>
                    </div>
                    
                    <div class="progress-section">
                        <div class="progress-label">
                            <span>단계: ${this.getStageName(project.stage)}</span>
                            <span>${Math.round(project.stageProgress)}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${project.stageProgress}%"></div>
                        </div>
                    </div>
                    
                    <div class="progress-section">
                        <div class="progress-label">
                            <span>전체 진행도</span>
                            <span>${Math.round(project.overallProgress)}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${project.overallProgress}%"></div>
                        </div>
                    </div>
                    
                    <div class="progress-section">
                        <div class="progress-label">
                            <span>품질</span>
                            <span>${Math.round(project.quality)}/100</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill quality" style="width: ${project.quality}%"></div>
                        </div>
                    </div>
                    
                    <div class="project-stats">
                        <div class="stat">
                            <span class="stat-label">예산</span>
                            <span class="stat-value">${project.budget.toLocaleString()}원</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">남은 예산</span>
                            <span class="stat-value">${Math.round(project.remainingBudget).toLocaleString()}원</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">마케팅</span>
                            <span class="stat-value">${Math.round(project.marketing)} 포인트</span>
                        </div>
                    </div>
                    
                    <div class="project-actions">
                        <button id="marketing-btn" class="btn btn-secondary">마케팅 투자</button>
                        <button id="cancel-project-btn" class="btn btn-danger">프로젝트 취소</button>
                    </div>
                </div>
            `;
            
            // 이벤트 리스너 설정
            document.getElementById('marketing-btn').addEventListener('click', () => this.investInMarketing());
            document.getElementById('cancel-project-btn').addEventListener('click', () => {
                this.gameManager.uiManager.showDialog(
                    '프로젝트 취소',
                    '정말 이 프로젝트를 취소하시겠습니까? 남은 예산의 50%만 환불됩니다.',
                    [
                        {
                            text: '취소하기',
                            callback: () => this.cancelProject()
                        },
                        {
                            text: '계속 진행',
                            callback: () => {}
                        }
                    ]
                );
            });
        }
    }
    
    updateCompletedProjectsDisplay() {
        const completedContainer = document.getElementById('completed-projects');
        
        if (this.completedProjects.length === 0) {
            completedContainer.innerHTML = `
                <div class="empty-state">
                    <p>출시한 게임이 없습니다.</p>
                </div>
            `;
        } else {
            // 최신순으로 정렬
            const sortedProjects = [...this.completedProjects].sort((a, b) => {
                const aDate = a.releaseDate.year * 1000 + a.releaseDate.month * 100 + a.releaseDate.day;
                const bDate = b.releaseDate.year * 1000 + b.releaseDate.month * 100 + b.releaseDate.day;
                return bDate - aDate;
            });
            
            // 완료된 프로젝트 목록 표시
            completedContainer.innerHTML = `
                <h3>출시된 게임</h3>
                <div class="completed-list">
                    ${sortedProjects.map(project => `
                        <div class="completed-item" data-id="${sortedProjects.indexOf(project)}">
                            <div class="completed-header">
                                <h4>${project.name}</h4>
                                <span class="rating">${project.rating.toFixed(1)}/10</span>
                            </div>
                            <div class="completed-meta">
                                <span>${project.genre.name} | ${project.platform.name}</span>
                                <span>출시: ${project.releaseDate.year}년 ${project.releaseDate.month}월</span>
                            </div>
                            <div class="completed-stats">
                                <span>판매량: ${project.sales.toLocaleString()}개</span>
                                <span>수익: ${project.revenue.toLocaleString()}원</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
            
            // 완료된 프로젝트 클릭 이벤트 리스너
            document.querySelectorAll('.completed-item').forEach(item => {
                item.addEventListener('click', () => {
                    const projectId = parseInt(item.getAttribute('data-id'));
                    this.showProjectDetails(sortedProjects[projectId]);
                });
            });
        }
    }
    
    showProjectDetails(project) {
        // 프로젝트 상세 정보 다이얼로그 표시
        const reviewsHtml = project.reviews.map(review => 
            `<div class="review-item">
                <span class="review-site">${review.site}</span>
                <span class="review-score">${review.score.toFixed(1)}/10</span>
            </div>`
        ).join('');
        
        const dialogContent = `
            <div class="project-details-dialog">
                <h3>${project.name}</h3>
                <div class="project-meta">
                    <span class="genre">${project.genre.name}</span> | 
                    <span class="platform">${project.platform.name}</span>
                </div>
                
                <div class="project-stats">
                    <div class="stat">
                        <span class="stat-label">출시일</span>
                        <span class="stat-value">${project.releaseDate.year}년 ${project.releaseDate.month}월 ${project.releaseDate.day}일</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">품질</span>
                        <span class="stat-value">${Math.round(project.quality)}/100</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">평균 평점</span>
                        <span class="stat-value">${project.rating.toFixed(1)}/10</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">판매량</span>
                        <span class="stat-value">${project.sales.toLocaleString()}개</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">총 수익</span>
                        <span class="stat-value">${project.revenue.toLocaleString()}원</span>
                    </div>
                </div>
                
                <h4>리뷰 점수</h4>
                <div class="reviews-container">
                    ${reviewsHtml}
                </div>
            </div>
        `;
        
        this.gameManager.uiManager.showDialog(
            '게임 상세 정보',
            dialogContent,
            [
                {
                    text: '닫기',
                    callback: () => {}
                }
            ]
        );
    }
    
    getStageName(stageKey) {
        const stageNames = {
            'concept': '기획',
            'prototype': '프로토타입',
            'development': '개발',
            'testing': '테스트',
            'release': '출시'
        };
        
        return stageNames[stageKey] || stageKey;
    }
    
    unlockGenre(genreName) {
        // 잠긴 장르 해금
        const genreIndex = this.lockedGenres.findIndex(g => g.name === genreName);
        
        if (genreIndex !== -1) {
            const genre = this.lockedGenres.splice(genreIndex, 1)[0];
            this.availableGenres.push(genre);
            this.gameManager.uiManager.showNotification(`새로운 게임 장르가 해금되었습니다: ${genre.name}`, 'success');
            return true;
        }
        
        return false;
    }
    
    unlockPlatform(platformName) {
        // 잠긴 플랫폼 해금
        const platformIndex = this.lockedPlatforms.findIndex(p => p.name === platformName);
        
        if (platformIndex !== -1) {
            const platform = this.lockedPlatforms.splice(platformIndex, 1)[0];
            this.availablePlatforms.push(platform);
            this.gameManager.uiManager.showNotification(`새로운 게임 플랫폼이 해금되었습니다: ${platform.name}`, 'success');
            return true;
        }
        
        return false;
    }
    
    loadData(projects, completedProjects) {
        // 저장된 데이터 로드
        this.currentProject = projects;
        this.completedProjects = completedProjects;
        
        // UI 업데이트
        this.updateProjectDisplay();
        this.updateCompletedProjectsDisplay();
    }
}

/**
 * 게임 장르 클래스
 */
class GameGenre {
    constructor(name, difficulty, popularityMultiplier, salesMultiplier, developmentTimeMultiplier, marketingEffectMultiplier) {
        this.name = name;
        this.difficulty = difficulty; // 1-5 (쉬움-어려움)
        this.popularityMultiplier = popularityMultiplier; // 평점에 영향
        this.salesMultiplier = salesMultiplier; // 판매량에 영향
        this.developmentTimeMultiplier = developmentTimeMultiplier; // 개발 시간에 영향
        this.marketingEffectMultiplier = marketingEffectMultiplier; // 마케팅 효과에 영향
    }
}

/**
 * 게임 플랫폼 클래스
 */
class GamePlatform {
    constructor(name, difficulty, popularityMultiplier, userBase, revenuePerSale) {
        this.name = name;
        this.difficulty = difficulty; // 1-5 (쉬움-어려움)
        this.popularityMultiplier = popularityMultiplier; // 평점에 영향
        this.userBase = userBase; // 잠재적 사용자 수
        this.revenuePerSale = revenuePerSale; // 판매당 수익
    }
}