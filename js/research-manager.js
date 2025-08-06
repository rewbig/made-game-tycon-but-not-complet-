/**
 * 연구 매니저 - 게임 개발 기술 연구 관리
 */

class ResearchManager {
    constructor(gameManager) {
        this.gameManager = gameManager;
        
        // 현재 진행 중인 연구
        this.currentResearch = null;
        
        // 완료된 연구 목록
        this.completedResearch = [];
        
        // 사용 가능한 연구 목록
        this.availableResearch = [
            new Research('기초 게임 엔진', '기본적인 게임 엔진 기술을 연구합니다.', 5000, 30, {
                programming: 1,
                design: 0.5
            }, {
                programming: 0.2,
                design: 0.1
            }, ['2D 그래픽 엔진', '기초 물리 엔진']),
            
            new Research('기초 물리 엔진', '간단한 물리 효과를 구현하는 기술을 연구합니다.', 8000, 45, {
                programming: 1.5,
                design: 0.3
            }, {
                programming: 0.3
            }, ['고급 물리 엔진']),
            
            new Research('2D 그래픽 엔진', '2D 그래픽을 효율적으로 처리하는 기술을 연구합니다.', 7000, 40, {
                programming: 1,
                art: 1
            }, {
                programming: 0.2,
                art: 0.2
            }, ['3D 그래픽 엔진']),
            
            new Research('3D 그래픽 엔진', '3D 그래픽을 처리하는 기술을 연구합니다.', 15000, 60, {
                programming: 2,
                art: 1.5
            }, {
                programming: 0.4,
                art: 0.3
            }, ['고급 3D 엔진', '그래픽 최적화']),
            
            new Research('고급 물리 엔진', '복잡한 물리 시뮬레이션을 구현하는 기술을 연구합니다.', 20000, 75, {
                programming: 2.5,
                design: 1
            }, {
                programming: 0.5,
                design: 0.2
            }, ['물리 시뮬레이션 최적화']),
            
            new Research('고급 3D 엔진', '고품질 3D 그래픽과 효과를 구현하는 기술을 연구합니다.', 25000, 90, {
                programming: 3,
                art: 2
            }, {
                programming: 0.6,
                art: 0.4
            }, ['차세대 렌더링']),
            
            new Research('인공지능 시스템', '게임 내 AI를 개발하는 기술을 연구합니다.', 18000, 70, {
                programming: 2,
                design: 1.5
            }, {
                programming: 0.4,
                design: 0.3
            }, ['고급 AI 시스템']),
            
            new Research('네트워크 기술', '멀티플레이어 게임을 위한 네트워크 기술을 연구합니다.', 22000, 80, {
                programming: 2.5,
                design: 1
            }, {
                programming: 0.5
            }, ['클라우드 게임 기술']),
            
            new Research('사운드 엔진', '고품질 사운드와 음악을 처리하는 기술을 연구합니다.', 12000, 50, {
                programming: 1,
                sound: 2
            }, {
                programming: 0.2,
                sound: 0.4
            }, ['3D 오디오 시스템']),
            
            new Research('그래픽 최적화', '그래픽 성능을 향상시키는 기술을 연구합니다.', 20000, 65, {
                programming: 2.5,
                art: 1
            }, {
                programming: 0.5
            }, []),
            
            new Research('물리 시뮬레이션 최적화', '물리 시뮬레이션 성능을 향상시키는 기술을 연구합니다.', 22000, 70, {
                programming: 3,
                design: 1
            }, {
                programming: 0.6
            }, []),
            
            new Research('고급 AI 시스템', '복잡하고 지능적인 AI를 개발하는 기술을 연구합니다.', 28000, 100, {
                programming: 3,
                design: 2
            }, {
                programming: 0.6,
                design: 0.4
            }, []),
            
            new Research('클라우드 게임 기술', '클라우드 기반 게임 서비스를 위한 기술을 연구합니다.', 30000, 110, {
                programming: 3.5,
                design: 1.5
            }, {
                programming: 0.7,
                design: 0.3
            }, []),
            
            new Research('3D 오디오 시스템', '입체적인 사운드를 구현하는 기술을 연구합니다.', 18000, 60, {
                programming: 1.5,
                sound: 2.5
            }, {
                programming: 0.3,
                sound: 0.5
            }, []),
            
            new Research('차세대 렌더링', '최신 렌더링 기술을 연구합니다.', 35000, 120, {
                programming: 4,
                art: 3
            }, {
                programming: 0.8,
                art: 0.6
            }, [])
        ];
        
        // 잠긴 연구 목록 초기화
        this.lockedResearch = [...this.availableResearch];
        this.availableResearch = [];
        
        // 초기 연구 해금
        this.unlockResearch('기초 게임 엔진');
    }
    
    // 연구 시작
    startResearch(researchId) {
        // 이미 진행 중인 연구가 있는지 확인
        if (this.currentResearch) {
            this.gameManager.uiManager.showNotification('이미 진행 중인 연구가 있습니다.', 'warning');
            return false;
        }
        
        // 연구 찾기
        const research = this.availableResearch.find(r => r.id === researchId);
        
        if (!research) {
            this.gameManager.uiManager.showNotification('연구를 찾을 수 없습니다.', 'error');
            return false;
        }
        
        // 비용 확인
        if (this.gameManager.player.money < research.cost) {
            this.gameManager.uiManager.showNotification('연구 비용이 부족합니다.', 'warning');
            return false;
        }
        
        // 비용 지불
        this.gameManager.player.money -= research.cost;
        
        // 연구 시작
        this.currentResearch = {
            research: research,
            progress: 0,
            totalDays: research.days
        };
        
        this.gameManager.uiManager.showNotification(`'${research.name}' 연구를 시작했습니다.`, 'success');
        this.updateResearchDisplay();
        
        return true;
    }
    
    // 연구 취소
    cancelResearch() {
        if (!this.currentResearch) {
            return false;
        }
        
        // 일부 비용 환불 (50%)
        const refundAmount = Math.floor(this.currentResearch.research.cost * 0.5);
        this.gameManager.player.money += refundAmount;
        
        this.gameManager.uiManager.showNotification(
            `연구가 취소되었습니다. ${refundAmount.toLocaleString()}원이 환불되었습니다.`,
            'info'
        );
        
        this.currentResearch = null;
        this.updateResearchDisplay();
        
        return true;
    }
    
    // 일일 연구 진행 업데이트
    updateResearch() {
        if (!this.currentResearch) {
            return;
        }
        
        // 연구 진행도 계산
        let progressIncrease = 1; // 기본 진행도
        
        // 플레이어 스킬에 따른 보너스
        const research = this.currentResearch.research;
        for (const [skill, factor] of Object.entries(research.requiredSkills)) {
            progressIncrease += this.gameManager.player.skills[skill] * factor * 0.1;
        }
        
        // 직원 스킬에 따른 보너스
        const employees = this.gameManager.employeeManager.employees;
        for (const employee of employees) {
            for (const [skill, factor] of Object.entries(research.requiredSkills)) {
                progressIncrease += employee.skills[skill] * factor * 0.05;
            }
        }
        
        // 진행도 업데이트
        this.currentResearch.progress += progressIncrease;
        
        // 연구 완료 확인
        if (this.currentResearch.progress >= this.currentResearch.totalDays) {
            this.completeResearch();
        }
        
        // UI 업데이트
        this.updateResearchDisplay();
    }
    
    // 연구 완료
    completeResearch() {
        if (!this.currentResearch) {
            return;
        }
        
        const research = this.currentResearch.research;
        
        // 완료된 연구 목록에 추가
        this.completedResearch.push(research);
        
        // 플레이어 스킬 향상
        for (const [skill, increase] of Object.entries(research.skillIncrease)) {
            this.gameManager.player.skills[skill] += increase;
        }
        
        // 새 연구 해금
        for (const unlockId of research.unlocks) {
            this.unlockResearch(unlockId);
        }
        
        // 알림 표시
        this.gameManager.uiManager.showNotification(
            `'${research.name}' 연구가 완료되었습니다!`,
            'success'
        );
        
        // 연구 완료 다이얼로그 표시
        this.showResearchCompleteDialog(research);
        
        // 현재 연구 초기화
        this.currentResearch = null;
        
        // UI 업데이트
        this.updateResearchDisplay();
    }
    
    // 연구 해금
    unlockResearch(researchId) {
        // 이미 완료된 연구인지 확인
        if (this.completedResearch.some(r => r.id === researchId)) {
            return false;
        }
        
        // 이미 사용 가능한 연구인지 확인
        if (this.availableResearch.some(r => r.id === researchId)) {
            return false;
        }
        
        // 잠긴 연구 목록에서 찾기
        const index = this.lockedResearch.findIndex(r => r.id === researchId);
        
        if (index === -1) {
            return false;
        }
        
        // 잠긴 연구 목록에서 제거하고 사용 가능한 연구 목록에 추가
        const research = this.lockedResearch.splice(index, 1)[0];
        this.availableResearch.push(research);
        
        // UI 업데이트
        this.updateResearchDisplay();
        
        return true;
    }
    
    // 연구 완료 다이얼로그 표시
    showResearchCompleteDialog(research) {
        let skillIncreaseText = '';
        
        for (const [skill, increase] of Object.entries(research.skillIncrease)) {
            const skillName = this.getSkillDisplayName(skill);
            skillIncreaseText += `<li>${skillName} +${increase.toFixed(1)}</li>`;
        }
        
        let unlocksText = '';
        if (research.unlocks.length > 0) {
            unlocksText = '<p>새로운 연구가 해금되었습니다:</p><ul>';
            for (const unlockId of research.unlocks) {
                const unlockResearch = this.lockedResearch.find(r => r.id === unlockId) || 
                                      this.availableResearch.find(r => r.id === unlockId);
                if (unlockResearch) {
                    unlocksText += `<li>${unlockResearch.name}</li>`;
                }
            }
            unlocksText += '</ul>';
        }
        
        this.gameManager.uiManager.showDialog(
            '연구 완료!',
            `
            <div class="research-complete">
                <h3>${research.name}</h3>
                <p>${research.description}</p>
                
                <div class="research-benefits">
                    <h4>획득한 스킬:</h4>
                    <ul>
                        ${skillIncreaseText}
                    </ul>
                    
                    ${unlocksText}
                </div>
            </div>
            `,
            [
                {
                    text: '확인',
                    callback: () => {}
                }
            ]
        );
    }
    
    // 연구 탭 UI 업데이트
    updateResearchDisplay() {
        const researchTab = document.getElementById('research-tab');
        
        if (!researchTab) return;
        
        // 현재 연구 정보 업데이트
        const currentResearchContainer = document.getElementById('current-research');
        
        if (currentResearchContainer) {
            if (this.currentResearch) {
                const research = this.currentResearch.research;
                const progress = this.currentResearch.progress;
                const totalDays = this.currentResearch.totalDays;
                const progressPercent = Math.min((progress / totalDays) * 100, 100);
                
                let requiredSkillsText = '';
                for (const [skill, factor] of Object.entries(research.requiredSkills)) {
                    const skillName = this.getSkillDisplayName(skill);
                    requiredSkillsText += `<span class="skill-tag">${skillName} ${factor.toFixed(1)}</span>`;
                }
                
                currentResearchContainer.innerHTML = `
                    <div class="research-item current">
                        <h3>${research.name}</h3>
                        <p>${research.description}</p>
                        
                        <div class="research-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${progressPercent}%"></div>
                            </div>
                            <div class="progress-text">${Math.floor(progress)}/${totalDays} 일 (${Math.floor(progressPercent)}%)</div>
                        </div>
                        
                        <div class="research-skills">
                            <p>필요 스킬: ${requiredSkillsText}</p>
                        </div>
                        
                        <button id="cancel-research-btn" class="btn btn-danger">연구 취소</button>
                    </div>
                `;
                
                // 취소 버튼 이벤트 리스너
                document.getElementById('cancel-research-btn').addEventListener('click', () => {
                    this.cancelResearch();
                });
            } else {
                currentResearchContainer.innerHTML = `
                    <div class="research-item empty">
                        <p>현재 진행 중인 연구가 없습니다.</p>
                    </div>
                `;
            }
        }
        
        // 사용 가능한 연구 목록 업데이트
        const availableResearchContainer = document.getElementById('available-research');
        
        if (availableResearchContainer) {
            if (this.availableResearch.length > 0) {
                availableResearchContainer.innerHTML = this.availableResearch.map(research => {
                    let requiredSkillsText = '';
                    for (const [skill, factor] of Object.entries(research.requiredSkills)) {
                        const skillName = this.getSkillDisplayName(skill);
                        requiredSkillsText += `<span class="skill-tag">${skillName} ${factor.toFixed(1)}</span>`;
                    }
                    
                    let skillIncreaseText = '';
                    for (const [skill, increase] of Object.entries(research.skillIncrease)) {
                        const skillName = this.getSkillDisplayName(skill);
                        skillIncreaseText += `<span class="skill-tag">${skillName} +${increase.toFixed(1)}</span>`;
                    }
                    
                    const canAfford = this.gameManager.player.money >= research.cost;
                    
                    return `
                        <div class="research-item ${canAfford ? '' : 'cannot-afford'}" data-research-id="${research.id}">
                            <h3>${research.name}</h3>
                            <p>${research.description}</p>
                            
                            <div class="research-details">
                                <div class="research-cost">
                                    <span class="label">비용:</span>
                                    <span class="value">${research.cost.toLocaleString()}원</span>
                                </div>
                                <div class="research-time">
                                    <span class="label">소요 시간:</span>
                                    <span class="value">${research.days}일</span>
                                </div>
                            </div>
                            
                            <div class="research-skills">
                                <p>필요 스킬: ${requiredSkillsText}</p>
                                <p>획득 스킬: ${skillIncreaseText}</p>
                            </div>
                            
                            <button class="btn btn-primary start-research-btn" data-research-id="${research.id}" ${canAfford ? '' : 'disabled'}>연구 시작</button>
                        </div>
                    `;
                }).join('');
                
                // 연구 시작 버튼 이벤트 리스너
                document.querySelectorAll('.start-research-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const researchId = btn.getAttribute('data-research-id');
                        this.startResearch(researchId);
                    });
                });
            } else {
                availableResearchContainer.innerHTML = `
                    <div class="research-item empty">
                        <p>사용 가능한 연구가 없습니다.</p>
                    </div>
                `;
            }
        }
        
        // 완료된 연구 목록 업데이트
        const completedResearchContainer = document.getElementById('completed-research');
        
        if (completedResearchContainer) {
            if (this.completedResearch.length > 0) {
                completedResearchContainer.innerHTML = this.completedResearch.map(research => {
                    let skillIncreaseText = '';
                    for (const [skill, increase] of Object.entries(research.skillIncrease)) {
                        const skillName = this.getSkillDisplayName(skill);
                        skillIncreaseText += `<span class="skill-tag">${skillName} +${increase.toFixed(1)}</span>`;
                    }
                    
                    return `
                        <div class="research-item completed">
                            <h3>${research.name}</h3>
                            <p>${research.description}</p>
                            
                            <div class="research-skills">
                                <p>획득 스킬: ${skillIncreaseText}</p>
                            </div>
                        </div>
                    `;
                }).join('');
            } else {
                completedResearchContainer.innerHTML = `
                    <div class="research-item empty">
                        <p>완료된 연구가 없습니다.</p>
                    </div>
                `;
            }
        }
    }
    
    // 스킬 이름 표시
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
}

/**
 * 연구 클래스
 */
class Research {
    constructor(name, description, cost, days, requiredSkills, skillIncrease, unlocks) {
        this.id = name; // ID로 이름 사용
        this.name = name;
        this.description = description;
        this.cost = cost;
        this.days = days;
        this.requiredSkills = requiredSkills || {};
        this.skillIncrease = skillIncrease || {};
        this.unlocks = unlocks || [];
    }
}