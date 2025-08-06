/**
 * 게임 메인 스크립트 - 게임 초기화 및 실행
 */

// 게임 초기화 함수
function initGame() {
    console.log('게임 초기화 중...');
    
    // 2D 환경 초기화
    const twoDManager = new TwoDManager();
    
    // 게임 매니저 생성
    const gameManager = new GameManager();
    
    // 프로젝트 매니저 생성
    const projectManager = new ProjectManager(gameManager);
    gameManager.projectManager = projectManager;
    
    // 직원 매니저 생성
    const employeeManager = new EmployeeManager(gameManager);
    gameManager.employeeManager = employeeManager;
    
    // UI 매니저 생성
    const uiManager = new UIManager(gameManager);
    gameManager.uiManager = uiManager;
    
    // 연구 매니저 생성
    const researchManager = new ResearchManager(gameManager);
    gameManager.researchManager = researchManager;
    
    // 마케팅 매니저 생성
    const marketingManager = new MarketingManager(gameManager);
    gameManager.marketingManager = marketingManager;
    
    // 재정 매니저 생성
    const financeManager = new FinanceManager(gameManager);
    gameManager.financeManager = financeManager;
    
    // 2D 매니저 연결
    gameManager.twoDManager = twoDManager;
    // 전역 변수로 설정 (기존 코드와의 호환성을 위해)
    window.threeManager = twoDManager;
    
    // 게임 초기화
    gameManager.init();
    
    // 이벤트 리스너 설정
    setupEventListeners(gameManager);
    
    console.log('게임 초기화 완료!');
    
    // 로컬 스토리지에 저장된 게임이 있는지 확인
    if (localStorage.getItem('gameDevTycoonSave')) {
        // 저장된 게임 불러오기 버튼 활성화
        const loadGameBtn = document.getElementById('load-game-btn');
        if (loadGameBtn) {
            loadGameBtn.disabled = false;
            loadGameBtn.classList.remove('disabled');
        }
    }
    
    return gameManager;
}

// 이벤트 리스너 설정
function setupEventListeners(gameManager) {
    console.log('이벤트 리스너 설정 함수 호출됨');
    // 새 게임 시작 버튼
    const newGameBtn = document.getElementById('new-game-btn');
    console.log('새 게임 버튼 요소:', newGameBtn);
    if (newGameBtn) {
        newGameBtn.addEventListener('click', () => {
            console.log('새 게임 버튼 클릭됨');
            startNewGame(gameManager);
        });
        console.log('새 게임 버튼 이벤트 리스너 추가됨');
    }
    
    // 저장된 게임 불러오기 버튼
    const loadGameBtn = document.getElementById('load-game-btn');
    if (loadGameBtn) {
        loadGameBtn.addEventListener('click', () => {
            gameManager.loadGame();
        });
    }
    
    // 게임 속도 조절 버튼
    document.getElementById('pause-btn').addEventListener('click', () => gameManager.setGameSpeed(0));
    document.getElementById('play-btn').addEventListener('click', () => gameManager.setGameSpeed(1));
    document.getElementById('fast-btn').addEventListener('click', () => gameManager.setGameSpeed(2));
    
    // 창 크기 변경 이벤트
    window.addEventListener('resize', () => {
        gameManager.threeManager.onWindowResize();
    });
}

// 새 게임 시작 함수
function startNewGame(gameManager) {
    console.log('새 게임 시작 함수 호출됨');
    // GameManager의 showNewGameDialog 메서드 호출
    gameManager.showNewGameDialog();
}

// 페이지 로드 시 게임 초기화 - 성능 최적화
window.addEventListener('DOMContentLoaded', () => {
    // 게임 초기화 - requestIdleCallback 사용하여 브라우저 유휴 시간에 초기화
    if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => {
            window.gameManager = initGame();
        }, { timeout: 1000 }); // 최대 1초 대기
    } else {
        // requestIdleCallback을 지원하지 않는 브라우저용 폴백
        setTimeout(() => {
            window.gameManager = initGame();
        }, 100);
    }
});