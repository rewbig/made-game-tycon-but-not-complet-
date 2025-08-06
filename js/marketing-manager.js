/**
 * 마케팅 매니저 - 게임 마케팅 관리
 */

class MarketingManager {
    constructor(gameManager) {
        this.gameManager = gameManager;
        
        // 마케팅 캠페인 목록
        this.campaigns = [
            new MarketingCampaign(
                'social_media',
                '소셜 미디어 마케팅',
                '소셜 미디어 플랫폼을 통해 게임을 홍보합니다.',
                5000,
                30,
                0.5,
                0.3,
                1000
            ),
            new MarketingCampaign(
                'online_ads',
                '온라인 광고',
                '게임 관련 웹사이트와 앱에 광고를 게재합니다.',
                10000,
                30,
                1.0,
                0.5,
                3000
            ),
            new MarketingCampaign(
                'influencer',
                '인플루언서 마케팅',
                '유명 게임 스트리머와 유튜버에게 게임을 홍보합니다.',
                15000,
                30,
                1.5,
                1.0,
                5000
            ),
            new MarketingCampaign(
                'game_expo',
                '게임 전시회',
                '게임 전시회에 참가하여 게임을 홍보합니다.',
                25000,
                14,
                2.0,
                1.5,
                8000
            ),
            new MarketingCampaign(
                'tv_commercial',
                'TV 광고',
                'TV 광고를 통해 게임을 홍보합니다.',
                50000,
                30,
                3.0,
                2.0,
                15000
            )
        ];
        
        // 현재 진행 중인 마케팅 캠페인
        this.activeCampaigns = [];
        
        // 마케팅 이벤트
        this.marketingEvents = [
            new MarketingEvent(
                'viral_video',
                '바이럴 영상',
                '게임 플레이 영상이 인터넷에서 화제가 되었습니다!',
                0.8,
                0.5,
                3000
            ),
            new MarketingEvent(
                'positive_review',
                '긍정적인 리뷰',
                '유명 게임 리뷰어가 게임에 대해 좋은 평가를 남겼습니다!',
                0.6,
                0.3,
                2000
            ),
            new MarketingEvent(
                'game_award',
                '게임 어워드',
                '게임이 인디 게임 어워드에서 수상했습니다!',
                1.0,
                0.8,
                5000
            ),
            new MarketingEvent(
                'community_event',
                '커뮤니티 이벤트',
                '팬들이 자발적으로 게임 관련 이벤트를 개최했습니다!',
                0.5,
                0.4,
                1500
            )
        ];
    }
    
    // 마케팅 캠페인 시작
    startCampaign(campaignId, targetProjectId) {
        // 캠페인 찾기
        const campaign = this.campaigns.find(c => c.id === campaignId);
        
        if (!campaign) {
            this.gameManager.uiManager.showNotification('마케팅 캠페인을 찾을 수 없습니다.', 'error');
            return false;
        }
        
        // 타겟 프로젝트 찾기
        let targetProject = null;
        
        // 현재 개발 중인 프로젝트 확인
        if (this.gameManager.projectManager.currentProject && 
            this.gameManager.projectManager.currentProject.id === targetProjectId) {
            targetProject = this.gameManager.projectManager.currentProject;
        } else {
            // 완료된 프로젝트 확인
            targetProject = this.gameManager.projectManager.completedProjects.find(p => p.id === targetProjectId);
        }
        
        if (!targetProject) {
            this.gameManager.uiManager.showNotification('대상 프로젝트를 찾을 수 없습니다.', 'error');
            return false;
        }
        
        // 비용 확인
        if (this.gameManager.player.money < campaign.cost) {
            this.gameManager.uiManager.showNotification('마케팅 비용이 부족합니다.', 'warning');
            return false;
        }
        
        // 비용 지불
        this.gameManager.player.money -= campaign.cost;
        
        // 캠페인 시작
        const activeCampaign = {
            id: Date.now(), // 고유 ID 생성
            campaign: campaign,
            targetProject: targetProject,
            daysLeft: campaign.duration,
            totalDays: campaign.duration
        };
        
        this.activeCampaigns.push(activeCampaign);
        
        this.gameManager.uiManager.showNotification(
            `'${campaign.name}' 마케팅 캠페인을 시작했습니다.`,
            'success'
        );
        
        this.updateMarketingDisplay();
        
        return true;
    }
    
    // 마케팅 캠페인 취소
    cancelCampaign(campaignId) {
        const index = this.activeCampaigns.findIndex(c => c.id === campaignId);
        
        if (index === -1) {
            return false;
        }
        
        const campaign = this.activeCampaigns[index];
        
        // 일부 비용 환불 (남은 기간에 비례)
        const refundRatio = campaign.daysLeft / campaign.totalDays;
        const refundAmount = Math.floor(campaign.campaign.cost * refundRatio * 0.5); // 50% 환불
        
        this.gameManager.player.money += refundAmount;
        
        this.gameManager.uiManager.showNotification(
            `마케팅 캠페인이 취소되었습니다. ${refundAmount.toLocaleString()}원이 환불되었습니다.`,
            'info'
        );
        
        // 캠페인 제거
        this.activeCampaigns.splice(index, 1);
        
        this.updateMarketingDisplay();
        
        return true;
    }
    
    // 일일 마케팅 업데이트
    updateMarketing() {
        // 활성 캠페인 업데이트
        for (let i = this.activeCampaigns.length - 1; i >= 0; i--) {
            const campaign = this.activeCampaigns[i];
            
            // 남은 기간 감소
            campaign.daysLeft--;
            
            // 마케팅 효과 적용
            this.applyMarketingEffect(campaign);
            
            // 캠페인 종료 확인
            if (campaign.daysLeft <= 0) {
                this.completeCampaign(campaign);
                this.activeCampaigns.splice(i, 1);
            }
        }
        
        // 랜덤 마케팅 이벤트 발생 (5% 확률)
        if (Math.random() < 0.05 && this.gameManager.projectManager.completedProjects.length > 0) {
            this.triggerRandomMarketingEvent();
        }
        
        // UI 업데이트
        this.updateMarketingDisplay();
    }
    
    // 마케팅 효과 적용
    applyMarketingEffect(campaign) {
        const project = campaign.targetProject;
        const marketingCampaign = campaign.campaign;
        
        // 개발 중인 프로젝트인 경우 기대치 증가
        if (project === this.gameManager.projectManager.currentProject) {
            project.hype += marketingCampaign.hypeEffect / marketingCampaign.duration;
            project.hype = Math.min(project.hype, 10); // 최대 10
        } 
        // 출시된 프로젝트인 경우 판매량 증가
        else {
            // 출시 후 경과 시간에 따라 효과 감소
            const daysSinceRelease = this.gameManager.getTotalDays() - project.releaseDate;
            const ageMultiplier = Math.max(0.1, 1 - (daysSinceRelease / 365)); // 1년 후 효과 10%로 감소
            
            // 일일 판매량 증가
            const salesIncrease = Math.floor(marketingCampaign.salesEffect * ageMultiplier);
            project.sales += salesIncrease;
            
            // 수익 증가
            const revenueIncrease = salesIncrease * project.revenuePerSale;
            project.revenue += revenueIncrease;
            this.gameManager.player.money += revenueIncrease;
            
            // 팬 증가
            const fansIncrease = Math.floor(salesIncrease * 0.1); // 판매량의 10%
            this.gameManager.player.fans += fansIncrease;
        }
    }
    
    // 마케팅 캠페인 완료
    completeCampaign(campaign) {
        // 명성 증가
        this.gameManager.player.reputation += campaign.campaign.reputationEffect;
        
        // 팬 증가
        this.gameManager.player.fans += campaign.campaign.fansIncrease;
        
        this.gameManager.uiManager.showNotification(
            `'${campaign.campaign.name}' 마케팅 캠페인이 완료되었습니다.`,
            'success'
        );
    }
    
    // 랜덤 마케팅 이벤트 발생
    triggerRandomMarketingEvent() {
        // 랜덤 이벤트 선택
        const event = this.marketingEvents[Math.floor(Math.random() * this.marketingEvents.length)];
        
        // 랜덤 프로젝트 선택 (완료된 프로젝트 중에서)
        const completedProjects = this.gameManager.projectManager.completedProjects;
        
        if (completedProjects.length === 0) {
            return;
        }
        
        // 최근 출시된 게임 중에서 선택 (최근 1년 이내)
        const recentProjects = completedProjects.filter(p => {
            const daysSinceRelease = this.gameManager.getTotalDays() - p.releaseDate;
            return daysSinceRelease <= 365; // 1년 이내
        });
        
        if (recentProjects.length === 0) {
            return;
        }
        
        const project = recentProjects[Math.floor(Math.random() * recentProjects.length)];
        
        // 이벤트 효과 적용
        // 판매량 증가
        const salesIncrease = Math.floor(event.salesEffect * project.quality * 100);
        project.sales += salesIncrease;
        
        // 수익 증가
        const revenueIncrease = salesIncrease * project.revenuePerSale;
        project.revenue += revenueIncrease;
        this.gameManager.player.money += revenueIncrease;
        
        // 명성 증가
        this.gameManager.player.reputation += event.reputationEffect;
        
        // 팬 증가
        this.gameManager.player.fans += event.fansIncrease;
        
        // 이벤트 알림
        this.showMarketingEventDialog(event, project, salesIncrease, revenueIncrease);
    }
    
    // 마케팅 이벤트 다이얼로그 표시
    showMarketingEventDialog(event, project, salesIncrease, revenueIncrease) {
        this.gameManager.uiManager.showDialog(
            '마케팅 이벤트!',
            `
            <div class="marketing-event">
                <h3>${event.name}</h3>
                <p>${event.description.replace('{game}', project.title)}</p>
                
                <div class="event-effects">
                    <p>게임: ${project.title}</p>
                    <p>추가 판매량: ${salesIncrease.toLocaleString()}개</p>
                    <p>추가 수익: ${revenueIncrease.toLocaleString()}원</p>
                    <p>명성 증가: +${event.reputationEffect.toFixed(1)}</p>
                    <p>팬 증가: +${event.fansIncrease.toLocaleString()}명</p>
                </div>
            </div>
            `,
            [
                {
                    text: '좋아요!',
                    callback: () => {}
                }
            ]
        );
    }
    
    // 마케팅 탭 UI 업데이트
    updateMarketingDisplay() {
        const marketingTab = document.getElementById('marketing-tab');
        
        if (!marketingTab) return;
        
        // 활성 캠페인 업데이트
        const activeCampaignsContainer = document.getElementById('active-campaigns');
        
        if (activeCampaignsContainer) {
            if (this.activeCampaigns.length > 0) {
                activeCampaignsContainer.innerHTML = this.activeCampaigns.map(campaign => {
                    const progressPercent = Math.min(((campaign.totalDays - campaign.daysLeft) / campaign.totalDays) * 100, 100);
                    
                    return `
                        <div class="campaign-item active">
                            <h3>${campaign.campaign.name}</h3>
                            <p>${campaign.campaign.description}</p>
                            
                            <div class="campaign-target">
                                <span class="label">대상 게임:</span>
                                <span class="value">${campaign.targetProject.title}</span>
                            </div>
                            
                            <div class="campaign-progress">
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${progressPercent}%"></div>
                                </div>
                                <div class="progress-text">${campaign.daysLeft}/${campaign.totalDays} 일 남음</div>
                            </div>
                            
                            <button class="btn btn-danger cancel-campaign-btn" data-campaign-id="${campaign.id}">캠페인 취소</button>
                        </div>
                    `;
                }).join('');
                
                // 취소 버튼 이벤트 리스너
                document.querySelectorAll('.cancel-campaign-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const campaignId = parseInt(btn.getAttribute('data-campaign-id'));
                        this.cancelCampaign(campaignId);
                    });
                });
            } else {
                activeCampaignsContainer.innerHTML = `
                    <div class="campaign-item empty">
                        <p>현재 진행 중인 마케팅 캠페인이 없습니다.</p>
                    </div>
                `;
            }
        }
        
        // 사용 가능한 캠페인 업데이트
        const availableCampaignsContainer = document.getElementById('available-campaigns');
        
        if (availableCampaignsContainer) {
            // 마케팅 대상이 될 수 있는 프로젝트 목록 (현재 프로젝트 + 완료된 프로젝트)
            const targetProjects = [];
            
            if (this.gameManager.projectManager.currentProject) {
                targetProjects.push(this.gameManager.projectManager.currentProject);
            }
            
            // 최근 3년 이내에 출시된 게임만 포함
            const recentProjects = this.gameManager.projectManager.completedProjects.filter(p => {
                const daysSinceRelease = this.gameManager.getTotalDays() - p.releaseDate;
                return daysSinceRelease <= 365 * 3; // 3년 이내
            });
            
            targetProjects.push(...recentProjects);
            
            if (targetProjects.length > 0) {
                availableCampaignsContainer.innerHTML = this.campaigns.map(campaign => {
                    const canAfford = this.gameManager.player.money >= campaign.cost;
                    
                    // 프로젝트 선택 드롭다운 생성
                    let projectOptions = targetProjects.map(project => {
                        const isCurrentProject = project === this.gameManager.projectManager.currentProject;
                        const projectStatus = isCurrentProject ? '(개발 중)' : '(출시됨)';
                        return `<option value="${project.id}">${project.title} ${projectStatus}</option>`;
                    }).join('');
                    
                    return `
                        <div class="campaign-item ${canAfford ? '' : 'cannot-afford'}">
                            <h3>${campaign.name}</h3>
                            <p>${campaign.description}</p>
                            
                            <div class="campaign-details">
                                <div class="campaign-cost">
                                    <span class="label">비용:</span>
                                    <span class="value">${campaign.cost.toLocaleString()}원</span>
                                </div>
                                <div class="campaign-duration">
                                    <span class="label">기간:</span>
                                    <span class="value">${campaign.duration}일</span>
                                </div>
                            </div>
                            
                            <div class="campaign-effects">
                                <p>기대치 효과: +${campaign.hypeEffect.toFixed(1)}</p>
                                <p>판매량 효과: +${campaign.salesEffect}/일</p>
                                <p>명성 효과: +${campaign.reputationEffect.toFixed(1)}</p>
                                <p>팬 증가: +${campaign.fansIncrease.toLocaleString()}명</p>
                            </div>
                            
                            <div class="campaign-target-select">
                                <label for="target-project-${campaign.id}">대상 게임:</label>
                                <select id="target-project-${campaign.id}" class="form-control">
                                    ${projectOptions}
                                </select>
                            </div>
                            
                            <button class="btn btn-primary start-campaign-btn" data-campaign-id="${campaign.id}" ${canAfford ? '' : 'disabled'}>
                                캠페인 시작
                            </button>
                        </div>
                    `;
                }).join('');
                
                // 캠페인 시작 버튼 이벤트 리스너
                document.querySelectorAll('.start-campaign-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const campaignId = btn.getAttribute('data-campaign-id');
                        const targetProjectId = document.getElementById(`target-project-${campaignId}`).value;
                        this.startCampaign(campaignId, targetProjectId);
                    });
                });
            } else {
                availableCampaignsContainer.innerHTML = `
                    <div class="campaign-item empty">
                        <p>마케팅 대상이 될 수 있는 게임이 없습니다. 게임을 개발하거나 출시하세요.</p>
                    </div>
                `;
            }
        }
    }
}

/**
 * 마케팅 캠페인 클래스
 */
class MarketingCampaign {
    constructor(id, name, description, cost, duration, hypeEffect, reputationEffect, fansIncrease) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.cost = cost;
        this.duration = duration;
        this.hypeEffect = hypeEffect;
        this.salesEffect = Math.floor(cost / duration / 2); // 일일 판매량 효과 (비용의 절반을 기간으로 나눔)
        this.reputationEffect = reputationEffect;
        this.fansIncrease = fansIncrease;
    }
}

/**
 * 마케팅 이벤트 클래스
 */
class MarketingEvent {
    constructor(id, name, description, salesEffect, reputationEffect, fansIncrease) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.salesEffect = salesEffect;
        this.reputationEffect = reputationEffect;
        this.fansIncrease = fansIncrease;
    }
}