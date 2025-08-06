/**
 * 재정 매니저 - 게임 스튜디오 재정 관리
 */

class FinanceManager {
    constructor(gameManager) {
        this.gameManager = gameManager;
        
        // 재정 기록
        this.financialRecords = [];
        
        // 월간 고정 비용
        this.monthlyFixedCosts = {
            rent: 5000, // 사무실 임대료
            utilities: 1000, // 공과금
            software: 2000, // 소프트웨어 라이센스
            misc: 1000 // 기타 비용
        };
        
        // 대출 정보
        this.loans = [];
        
        // 사용 가능한 대출 상품
        this.availableLoans = [
            new Loan('small_loan', '소액 대출', '소액의 대출로 단기 자금을 확보합니다.', 50000, 0.05, 12),
            new Loan('medium_loan', '중액 대출', '중간 규모의 대출로 중기 자금을 확보합니다.', 200000, 0.08, 24),
            new Loan('large_loan', '대액 대출', '대규모 대출로 장기 자금을 확보합니다.', 500000, 0.12, 36)
        ];
        
        // 투자 제안
        this.investmentOffers = [];
        
        // 차트 데이터
        this.chartData = {
            labels: [], // 날짜 라벨
            income: [], // 수입 데이터
            expenses: [], // 지출 데이터
            balance: [] // 잔액 데이터
        };
    }
    
    // 월간 재정 업데이트
    updateMonthlyFinances() {
        const currentDate = `${this.gameManager.year}년 ${this.gameManager.month}월`;
        let monthlyIncome = 0;
        let monthlyExpenses = 0;
        
        // 게임 판매 수익 계산 (이번 달)
        const completedProjects = this.gameManager.projectManager.completedProjects;
        for (const project of completedProjects) {
            // 이번 달에 발생한 수익만 계산
            if (project.monthlyRevenue && project.monthlyRevenue[currentDate]) {
                monthlyIncome += project.monthlyRevenue[currentDate];
            }
        }
        
        // 고정 비용 계산
        let fixedCosts = 0;
        for (const [category, amount] of Object.entries(this.monthlyFixedCosts)) {
            fixedCosts += amount;
        }
        monthlyExpenses += fixedCosts;
        
        // 직원 급여 계산
        let salaryCosts = 0;
        const employees = this.gameManager.employeeManager.employees;
        for (const employee of employees) {
            salaryCosts += employee.salary;
        }
        monthlyExpenses += salaryCosts;
        
        // 대출 상환 계산
        let loanPayments = 0;
        for (const loan of this.loans) {
            if (loan.remainingMonths > 0) {
                const payment = loan.monthlyPayment;
                loanPayments += payment;
                loan.remainingAmount -= (payment - (loan.remainingAmount * loan.monthlyInterestRate));
                loan.remainingMonths--;
                
                // 대출 완전 상환 확인
                if (loan.remainingMonths <= 0 || loan.remainingAmount <= 0) {
                    loan.remainingAmount = 0;
                    loan.remainingMonths = 0;
                    loan.isRepaid = true;
                    
                    this.gameManager.uiManager.showNotification(
                        `'${loan.name}' 대출이 완전히 상환되었습니다!`,
                        'success'
                    );
                }
            }
        }
        monthlyExpenses += loanPayments;
        
        // 재정 기록 추가
        const financialRecord = {
            date: currentDate,
            income: {
                total: monthlyIncome,
                gameRevenue: monthlyIncome // 현재는 게임 수익만 있음
            },
            expenses: {
                total: monthlyExpenses,
                rent: this.monthlyFixedCosts.rent,
                utilities: this.monthlyFixedCosts.utilities,
                software: this.monthlyFixedCosts.software,
                misc: this.monthlyFixedCosts.misc,
                salaries: salaryCosts,
                loanPayments: loanPayments
            },
            balance: monthlyIncome - monthlyExpenses
        };
        
        this.financialRecords.push(financialRecord);
        
        // 차트 데이터 업데이트
        this.updateChartData();
        
        // 자금 업데이트
        this.gameManager.player.money += financialRecord.balance;
        
        // 파산 확인
        if (this.gameManager.player.money < 0) {
            this.checkBankruptcy();
        }
        
        // 투자 제안 생성 (10% 확률)
        if (Math.random() < 0.1) {
            this.generateInvestmentOffer();
        }
        
        // UI 업데이트
        this.updateFinanceDisplay();
        
        return financialRecord;
    }
    
    // 차트 데이터 업데이트
    updateChartData() {
        // 최근 12개월 데이터만 유지
        const recentRecords = this.financialRecords.slice(-12);
        
        this.chartData.labels = recentRecords.map(record => record.date);
        this.chartData.income = recentRecords.map(record => record.income.total);
        this.chartData.expenses = recentRecords.map(record => record.expenses.total);
        this.chartData.balance = recentRecords.map(record => record.balance);
    }
    
    // 파산 확인
    checkBankruptcy() {
        // 대출 가능 여부 확인
        const canTakeLoan = this.availableLoans.some(loan => {
            // 명성이 충분한지 확인 (명성이 높을수록 더 큰 대출 가능)
            return this.gameManager.player.reputation >= (loan.amount / 10000);
        });
        
        if (canTakeLoan) {
            // 대출 제안
            this.showBankruptcyLoanDialog();
        } else {
            // 파산
            this.gameManager.gameOver('bankruptcy');
        }
    }
    
    // 파산 대출 다이얼로그 표시
    showBankruptcyLoanDialog() {
        // 가능한 대출 중 가장 큰 것 선택
        const availableLoans = this.availableLoans.filter(loan => {
            return this.gameManager.player.reputation >= (loan.amount / 10000);
        });
        
        if (availableLoans.length === 0) {
            this.gameManager.gameOver('bankruptcy');
            return;
        }
        
        // 가장 큰 대출 선택
        availableLoans.sort((a, b) => b.amount - a.amount);
        const loan = availableLoans[0];
        
        this.gameManager.uiManager.showDialog(
            '파산 위기!',
            `
            <div class="bankruptcy-warning">
                <h3>당신의 스튜디오가 파산 위기에 처했습니다!</h3>
                <p>현재 잔액: ${this.gameManager.player.money.toLocaleString()}원</p>
                <p>긴급 대출을 받아 회생할 수 있습니다:</p>
                
                <div class="loan-offer">
                    <h4>${loan.name}</h4>
                    <p>${loan.description}</p>
                    <p>대출 금액: ${loan.amount.toLocaleString()}원</p>
                    <p>이자율: ${(loan.annualInterestRate * 100).toFixed(1)}%</p>
                    <p>상환 기간: ${loan.termMonths}개월</p>
                    <p>월 상환액: ${loan.monthlyPayment.toLocaleString()}원</p>
                </div>
                
                <p class="warning">대출을 거부하면 게임이 종료됩니다!</p>
            </div>
            `,
            [
                {
                    text: '대출 받기',
                    callback: () => this.takeLoan(loan.id)
                },
                {
                    text: '포기하기',
                    callback: () => this.gameManager.gameOver('bankruptcy')
                }
            ]
        );
    }
    
    // 대출 받기
    takeLoan(loanId) {
        // 대출 상품 찾기
        const loanProduct = this.availableLoans.find(l => l.id === loanId);
        
        if (!loanProduct) {
            this.gameManager.uiManager.showNotification('대출 상품을 찾을 수 없습니다.', 'error');
            return false;
        }
        
        // 명성 요구사항 확인
        if (this.gameManager.player.reputation < (loanProduct.amount / 10000)) {
            this.gameManager.uiManager.showNotification('이 대출을 받기 위한 명성이 부족합니다.', 'warning');
            return false;
        }
        
        // 대출 생성
        const loan = {
            id: Date.now(), // 고유 ID
            name: loanProduct.name,
            description: loanProduct.description,
            originalAmount: loanProduct.amount,
            remainingAmount: loanProduct.amount,
            annualInterestRate: loanProduct.annualInterestRate,
            monthlyInterestRate: loanProduct.annualInterestRate / 12,
            termMonths: loanProduct.termMonths,
            remainingMonths: loanProduct.termMonths,
            monthlyPayment: loanProduct.monthlyPayment,
            startDate: `${this.gameManager.year}년 ${this.gameManager.month}월`,
            isRepaid: false
        };
        
        // 대출 목록에 추가
        this.loans.push(loan);
        
        // 자금 증가
        this.gameManager.player.money += loanProduct.amount;
        
        this.gameManager.uiManager.showNotification(
            `${loanProduct.amount.toLocaleString()}원의 대출이 승인되었습니다.`,
            'success'
        );
        
        // UI 업데이트
        this.updateFinanceDisplay();
        
        return true;
    }
    
    // 투자 제안 생성
    generateInvestmentOffer() {
        // 명성에 따른 투자 금액 계산
        const reputation = this.gameManager.player.reputation;
        const baseAmount = 100000;
        const reputationMultiplier = Math.max(1, reputation / 10);
        const investmentAmount = Math.floor(baseAmount * reputationMultiplier);
        
        // 지분율 계산 (명성이 높을수록 낮은 지분율)
        const equityPercentage = Math.max(5, 30 - (reputation / 5));
        
        // 투자 제안 생성
        const investmentOffer = {
            id: Date.now(),
            investorName: this.generateInvestorName(),
            amount: investmentAmount,
            equityPercentage: equityPercentage,
            deadline: this.gameManager.getTotalDays() + 30, // 30일 기한
            isAccepted: false,
            isRejected: false
        };
        
        this.investmentOffers.push(investmentOffer);
        
        // 투자 제안 다이얼로그 표시
        this.showInvestmentOfferDialog(investmentOffer);
        
        return investmentOffer;
    }
    
    // 투자자 이름 생성
    generateInvestorName() {
        const firstNames = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임'];
        const lastNames = ['상우', '민준', '서연', '지훈', '현우', '지민', '예준', '도윤', '서준', '시우'];
        const companies = ['벤처캐피탈', '인베스트먼트', '파트너스', '캐피탈', '그룹'];
        
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const company = companies[Math.floor(Math.random() * companies.length)];
        
        return `${firstName}${lastName} ${company}`;
    }
    
    // 투자 제안 다이얼로그 표시
    showInvestmentOfferDialog(offer) {
        this.gameManager.uiManager.showDialog(
            '투자 제안',
            `
            <div class="investment-offer">
                <h3>${offer.investorName}의 투자 제안</h3>
                <p>${offer.investorName}이(가) 귀하의 스튜디오에 투자하고자 합니다.</p>
                
                <div class="offer-details">
                    <p>투자 금액: ${offer.amount.toLocaleString()}원</p>
                    <p>요구 지분: ${offer.equityPercentage.toFixed(1)}%</p>
                    <p>결정 기한: ${Math.floor((offer.deadline - this.gameManager.getTotalDays()) / 30)}개월</p>
                </div>
                
                <p>이 제안을 수락하면 즉시 투자금을 받게 되지만, 향후 게임 수익의 일부를 투자자에게 지불해야 합니다.</p>
            </div>
            `,
            [
                {
                    text: '수락',
                    callback: () => this.acceptInvestmentOffer(offer.id)
                },
                {
                    text: '거절',
                    callback: () => this.rejectInvestmentOffer(offer.id)
                },
                {
                    text: '나중에 결정',
                    callback: () => {}
                }
            ]
        );
    }
    
    // 투자 제안 수락
    acceptInvestmentOffer(offerId) {
        const offerIndex = this.investmentOffers.findIndex(o => o.id === offerId);
        
        if (offerIndex === -1) {
            return false;
        }
        
        const offer = this.investmentOffers[offerIndex];
        
        // 이미 처리된 제안인지 확인
        if (offer.isAccepted || offer.isRejected) {
            return false;
        }
        
        // 제안 수락 처리
        offer.isAccepted = true;
        
        // 투자금 받기
        this.gameManager.player.money += offer.amount;
        
        // 지분 설정 (향후 수익 분배에 영향)
        this.gameManager.player.investorEquity = (this.gameManager.player.investorEquity || 0) + offer.equityPercentage;
        
        this.gameManager.uiManager.showNotification(
            `${offer.investorName}의 투자 제안을 수락했습니다. ${offer.amount.toLocaleString()}원을 받았습니다.`,
            'success'
        );
        
        // UI 업데이트
        this.updateFinanceDisplay();
        
        return true;
    }
    
    // 투자 제안 거절
    rejectInvestmentOffer(offerId) {
        const offerIndex = this.investmentOffers.findIndex(o => o.id === offerId);
        
        if (offerIndex === -1) {
            return false;
        }
        
        const offer = this.investmentOffers[offerIndex];
        
        // 이미 처리된 제안인지 확인
        if (offer.isAccepted || offer.isRejected) {
            return false;
        }
        
        // 제안 거절 처리
        offer.isRejected = true;
        
        this.gameManager.uiManager.showNotification(
            `${offer.investorName}의 투자 제안을 거절했습니다.`,
            'info'
        );
        
        return true;
    }
    
    // 투자자 수익 분배
    distributeInvestorRevenue(revenue) {
        // 투자자 지분이 있는 경우에만 처리
        if (!this.gameManager.player.investorEquity || this.gameManager.player.investorEquity <= 0) {
            return 0;
        }
        
        // 투자자 지분에 따른 수익 계산
        const investorRevenue = revenue * (this.gameManager.player.investorEquity / 100);
        
        return investorRevenue;
    }
    
    // 재정 탭 UI 업데이트
    updateFinanceDisplay() {
        const financeTab = document.getElementById('finance-tab');
        
        if (!financeTab) return;
        
        // 재정 요약 업데이트
        const financeSummaryContainer = document.getElementById('finance-summary');
        
        if (financeSummaryContainer) {
            // 최근 3개월 재정 데이터 가져오기
            const recentRecords = this.financialRecords.slice(-3);
            
            // 월간 평균 수입/지출 계산
            let avgMonthlyIncome = 0;
            let avgMonthlyExpenses = 0;
            
            if (recentRecords.length > 0) {
                avgMonthlyIncome = recentRecords.reduce((sum, record) => sum + record.income.total, 0) / recentRecords.length;
                avgMonthlyExpenses = recentRecords.reduce((sum, record) => sum + record.expenses.total, 0) / recentRecords.length;
            }
            
            // 투자자 지분 정보
            const investorEquity = this.gameManager.player.investorEquity || 0;
            
            financeSummaryContainer.innerHTML = `
                <div class="finance-overview">
                    <h3>재정 요약</h3>
                    
                    <div class="finance-stats">
                        <div class="stat">
                            <span class="stat-label">현재 자금</span>
                            <span class="stat-value">${this.gameManager.player.money.toLocaleString()}원</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">월 평균 수입</span>
                            <span class="stat-value">${Math.floor(avgMonthlyIncome).toLocaleString()}원</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">월 평균 지출</span>
                            <span class="stat-value">${Math.floor(avgMonthlyExpenses).toLocaleString()}원</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">월 평균 수익</span>
                            <span class="stat-value ${avgMonthlyIncome - avgMonthlyExpenses >= 0 ? 'positive' : 'negative'}">
                                ${Math.floor(avgMonthlyIncome - avgMonthlyExpenses).toLocaleString()}원
                            </span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">투자자 지분</span>
                            <span class="stat-value">${investorEquity.toFixed(1)}%</span>
                        </div>
                    </div>
                </div>
                
                <div class="finance-chart-container">
                    <canvas id="finance-chart"></canvas>
                </div>
            `;
            
            // 차트 생성 (Chart.js 사용)
            if (this.chartData.labels.length > 0) {
                const ctx = document.getElementById('finance-chart').getContext('2d');
                
                // 기존 차트 제거
                if (this.chart) {
                    this.chart.destroy();
                }
                
                // 새 차트 생성
                this.chart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: this.chartData.labels,
                        datasets: [
                            {
                                label: '수입',
                                data: this.chartData.income,
                                borderColor: 'rgba(75, 192, 192, 1)',
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                tension: 0.1
                            },
                            {
                                label: '지출',
                                data: this.chartData.expenses,
                                borderColor: 'rgba(255, 99, 132, 1)',
                                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                                tension: 0.1
                            },
                            {
                                label: '수익',
                                data: this.chartData.balance,
                                borderColor: 'rgba(54, 162, 235, 1)',
                                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                                tension: 0.1
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            }
        }
        
        // 대출 정보 업데이트
        const loansContainer = document.getElementById('loans-container');
        
        if (loansContainer) {
            // 활성 대출 필터링
            const activeLoans = this.loans.filter(loan => !loan.isRepaid);
            
            if (activeLoans.length > 0) {
                loansContainer.innerHTML = `
                    <h3>활성 대출</h3>
                    <div class="loans-list">
                        ${activeLoans.map(loan => `
                            <div class="loan-item">
                                <h4>${loan.name}</h4>
                                <div class="loan-details">
                                    <div class="loan-stat">
                                        <span class="label">원금:</span>
                                        <span class="value">${loan.originalAmount.toLocaleString()}원</span>
                                    </div>
                                    <div class="loan-stat">
                                        <span class="label">남은 금액:</span>
                                        <span class="value">${Math.ceil(loan.remainingAmount).toLocaleString()}원</span>
                                    </div>
                                    <div class="loan-stat">
                                        <span class="label">이자율:</span>
                                        <span class="value">${(loan.annualInterestRate * 100).toFixed(1)}%</span>
                                    </div>
                                    <div class="loan-stat">
                                        <span class="label">월 상환액:</span>
                                        <span class="value">${loan.monthlyPayment.toLocaleString()}원</span>
                                    </div>
                                    <div class="loan-stat">
                                        <span class="label">남은 기간:</span>
                                        <span class="value">${loan.remainingMonths}개월</span>
                                    </div>
                                    <div class="loan-stat">
                                        <span class="label">시작일:</span>
                                        <span class="value">${loan.startDate}</span>
                                    </div>
                                </div>
                                
                                <div class="loan-progress">
                                    <div class="progress-bar">
                                        <div class="progress-fill" style="width: ${((loan.termMonths - loan.remainingMonths) / loan.termMonths) * 100}%"></div>
                                    </div>
                                    <div class="progress-text">
                                        ${Math.floor((loan.termMonths - loan.remainingMonths) / loan.termMonths * 100)}% 상환 완료
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;
            } else {
                loansContainer.innerHTML = `
                    <h3>활성 대출</h3>
                    <p>현재 활성화된 대출이 없습니다.</p>
                `;
            }
        }
        
        // 대출 신청 섹션 업데이트
        const loanApplicationContainer = document.getElementById('loan-application');
        
        if (loanApplicationContainer) {
            loanApplicationContainer.innerHTML = `
                <h3>대출 신청</h3>
                <div class="available-loans">
                    ${this.availableLoans.map(loan => {
                        // 명성 요구사항 확인
                        const requiredReputation = loan.amount / 10000;
                        const canApply = this.gameManager.player.reputation >= requiredReputation;
                        
                        return `
                            <div class="loan-item ${canApply ? '' : 'locked'}">
                                <h4>${loan.name}</h4>
                                <p>${loan.description}</p>
                                
                                <div class="loan-details">
                                    <div class="loan-stat">
                                        <span class="label">대출 금액:</span>
                                        <span class="value">${loan.amount.toLocaleString()}원</span>
                                    </div>
                                    <div class="loan-stat">
                                        <span class="label">이자율:</span>
                                        <span class="value">${(loan.annualInterestRate * 100).toFixed(1)}%</span>
                                    </div>
                                    <div class="loan-stat">
                                        <span class="label">상환 기간:</span>
                                        <span class="value">${loan.termMonths}개월</span>
                                    </div>
                                    <div class="loan-stat">
                                        <span class="label">월 상환액:</span>
                                        <span class="value">${loan.monthlyPayment.toLocaleString()}원</span>
                                    </div>
                                    <div class="loan-stat">
                                        <span class="label">필요 명성:</span>
                                        <span class="value ${canApply ? 'positive' : 'negative'}">
                                            ${requiredReputation.toFixed(1)} (현재: ${this.gameManager.player.reputation.toFixed(1)})
                                        </span>
                                    </div>
                                </div>
                                
                                <button class="btn btn-primary apply-loan-btn" data-loan-id="${loan.id}" ${canApply ? '' : 'disabled'}>
                                    ${canApply ? '대출 신청' : '명성 부족'}
                                </button>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
            
            // 대출 신청 버튼 이벤트 리스너
            document.querySelectorAll('.apply-loan-btn').forEach(btn => {
                if (!btn.disabled) {
                    btn.addEventListener('click', () => {
                        const loanId = btn.getAttribute('data-loan-id');
                        this.takeLoan(loanId);
                    });
                }
            });
        }
        
        // 투자 제안 섹션 업데이트
        const investmentOffersContainer = document.getElementById('investment-offers');
        
        if (investmentOffersContainer) {
            // 처리되지 않은 투자 제안 필터링
            const pendingOffers = this.investmentOffers.filter(offer => !offer.isAccepted && !offer.isRejected);
            
            if (pendingOffers.length > 0) {
                investmentOffersContainer.innerHTML = `
                    <h3>투자 제안</h3>
                    <div class="offers-list">
                        ${pendingOffers.map(offer => {
                            const daysLeft = offer.deadline - this.gameManager.getTotalDays();
                            
                            return `
                                <div class="offer-item">
                                    <h4>${offer.investorName}의 제안</h4>
                                    
                                    <div class="offer-details">
                                        <div class="offer-stat">
                                            <span class="label">투자 금액:</span>
                                            <span class="value">${offer.amount.toLocaleString()}원</span>
                                        </div>
                                        <div class="offer-stat">
                                            <span class="label">요구 지분:</span>
                                            <span class="value">${offer.equityPercentage.toFixed(1)}%</span>
                                        </div>
                                        <div class="offer-stat">
                                            <span class="label">남은 기한:</span>
                                            <span class="value">${daysLeft}일</span>
                                        </div>
                                    </div>
                                    
                                    <div class="offer-actions">
                                        <button class="btn btn-primary accept-offer-btn" data-offer-id="${offer.id}">수락</button>
                                        <button class="btn btn-danger reject-offer-btn" data-offer-id="${offer.id}">거절</button>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                `;
                
                // 투자 제안 버튼 이벤트 리스너
                document.querySelectorAll('.accept-offer-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const offerId = parseInt(btn.getAttribute('data-offer-id'));
                        this.acceptInvestmentOffer(offerId);
                    });
                });
                
                document.querySelectorAll('.reject-offer-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const offerId = parseInt(btn.getAttribute('data-offer-id'));
                        this.rejectInvestmentOffer(offerId);
                    });
                });
            } else {
                investmentOffersContainer.innerHTML = `
                    <h3>투자 제안</h3>
                    <p>현재 대기 중인 투자 제안이 없습니다.</p>
                `;
            }
        }
    }
}

/**
 * 대출 클래스
 */
class Loan {
    constructor(id, name, description, amount, annualInterestRate, termMonths) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.amount = amount;
        this.annualInterestRate = annualInterestRate;
        this.termMonths = termMonths;
        
        // 월 상환액 계산 (원리금 균등 상환)
        const monthlyInterestRate = annualInterestRate / 12;
        this.monthlyPayment = Math.ceil(
            (amount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, termMonths)) /
            (Math.pow(1 + monthlyInterestRate, termMonths) - 1)
        );
    }
}