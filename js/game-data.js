/**
 * game-data.js
 * 게임에 필요한 모든 정적 데이터를 정의합니다.
 * 장르, 플랫폼, 연구 항목, 마케팅 캠페인 등의 기본 데이터를 포함합니다.
 */

const GameData = {
    // 게임 장르 정의
    genres: [
        {
            id: 'action',
            name: '액션',
            difficulty: 1,
            popularity: 0.8,
            baseSales: 1.2,
            devTimeMultiplier: 1.0,
            marketingEffect: 1.0,
            unlocked: true,
            description: '빠른 반응 속도와 손-눈 협응력이 필요한 게임 장르입니다.'
        },
        {
            id: 'adventure',
            name: '어드벤처',
            difficulty: 1.2,
            popularity: 0.7,
            baseSales: 0.9,
            devTimeMultiplier: 1.1,
            marketingEffect: 0.9,
            unlocked: true,
            description: '탐험과 퍼즐 풀이가 중심인 게임 장르입니다.'
        },
        {
            id: 'rpg',
            name: 'RPG',
            difficulty: 1.5,
            popularity: 0.9,
            baseSales: 1.3,
            devTimeMultiplier: 1.4,
            marketingEffect: 1.1,
            unlocked: true,
            description: '캐릭터 성장과 스토리텔링이 중요한 롤플레잉 게임입니다.'
        },
        {
            id: 'strategy',
            name: '전략',
            difficulty: 1.3,
            popularity: 0.6,
            baseSales: 0.8,
            devTimeMultiplier: 1.2,
            marketingEffect: 0.8,
            unlocked: true,
            description: '전술적 사고와 자원 관리가 중요한 게임 장르입니다.'
        },
        {
            id: 'simulation',
            name: '시뮬레이션',
            difficulty: 1.4,
            popularity: 0.7,
            baseSales: 0.9,
            devTimeMultiplier: 1.3,
            marketingEffect: 0.9,
            unlocked: true,
            description: '현실 세계의 활동이나 시스템을 모방하는 게임 장르입니다.'
        },
        {
            id: 'sports',
            name: '스포츠',
            difficulty: 1.2,
            popularity: 0.8,
            baseSales: 1.0,
            devTimeMultiplier: 1.1,
            marketingEffect: 1.2,
            unlocked: false,
            description: '실제 스포츠를 가상으로 즐길 수 있는 게임 장르입니다.'
        },
        {
            id: 'racing',
            name: '레이싱',
            difficulty: 1.1,
            popularity: 0.7,
            baseSales: 0.9,
            devTimeMultiplier: 1.0,
            marketingEffect: 1.1,
            unlocked: false,
            description: '속도감과 경쟁이 중요한 레이싱 게임 장르입니다.'
        },
        {
            id: 'puzzle',
            name: '퍼즐',
            difficulty: 0.9,
            popularity: 0.6,
            baseSales: 0.7,
            devTimeMultiplier: 0.8,
            marketingEffect: 0.7,
            unlocked: false,
            description: '논리적 사고와 문제 해결 능력이 필요한 게임 장르입니다.'
        },
        {
            id: 'horror',
            name: '공포',
            difficulty: 1.3,
            popularity: 0.6,
            baseSales: 0.8,
            devTimeMultiplier: 1.2,
            marketingEffect: 1.0,
            unlocked: false,
            description: '공포와 긴장감을 주는 게임 장르입니다.'
        },
        {
            id: 'mmo',
            name: 'MMO',
            difficulty: 2.0,
            popularity: 0.9,
            baseSales: 1.5,
            devTimeMultiplier: 2.0,
            marketingEffect: 1.3,
            unlocked: false,
            description: '대규모 다중 사용자 온라인 게임으로, 많은 개발 리소스가 필요합니다.'
        }
    ],
    
    // 게임 플랫폼 정의
    platforms: [
        {
            id: 'pc',
            name: 'PC',
            difficulty: 1.0,
            userBase: 1.0,
            revenuePerSale: 1.0,
            devCostMultiplier: 1.0,
            marketingCostMultiplier: 1.0,
            unlocked: true,
            description: '가장 기본적인 게임 플랫폼으로, 다양한 장르의 게임을 지원합니다.'
        },
        {
            id: 'mobile',
            name: '모바일',
            difficulty: 0.8,
            userBase: 1.5,
            revenuePerSale: 0.6,
            devCostMultiplier: 0.7,
            marketingCostMultiplier: 0.9,
            unlocked: true,
            description: '스마트폰과 태블릿을 위한 게임 플랫폼으로, 캐주얼 게임에 적합합니다.'
        },
        {
            id: 'console',
            name: '콘솔',
            difficulty: 1.3,
            userBase: 0.8,
            revenuePerSale: 1.2,
            devCostMultiplier: 1.2,
            marketingCostMultiplier: 1.3,
            unlocked: false,
            description: '전용 게임기를 위한 플랫폼으로, 높은 품질의 게임을 지원합니다.'
        },
        {
            id: 'vr',
            name: 'VR',
            difficulty: 1.5,
            userBase: 0.4,
            revenuePerSale: 1.4,
            devCostMultiplier: 1.5,
            marketingCostMultiplier: 1.2,
            unlocked: false,
            description: '가상현실 기기를 위한 플랫폼으로, 몰입감 있는 게임 경험을 제공합니다.'
        }
    ],
    
    // 연구 항목 정의
    research: [
        {
            id: 'engine_basic',
            name: '기본 게임 엔진',
            category: 'engine',
            level: 1,
            cost: 5000,
            duration: 4, // 주 단위
            requiredSkills: {},
            skillIncrease: { coding: 5 },
            unlocks: ['engine_intermediate'],
            unlocked: true,
            completed: false,
            description: '기본적인 게임 엔진을 개발하여 게임 개발 효율을 높입니다.'
        },
        {
            id: 'engine_intermediate',
            name: '중급 게임 엔진',
            category: 'engine',
            level: 2,
            cost: 15000,
            duration: 6,
            requiredSkills: { coding: 10 },
            skillIncrease: { coding: 10 },
            unlocks: ['engine_advanced', 'console'],
            unlocked: false,
            completed: false,
            description: '더 발전된 게임 엔진을 개발하여 게임 품질을 향상시킵니다.'
        },
        {
            id: 'engine_advanced',
            name: '고급 게임 엔진',
            category: 'engine',
            level: 3,
            cost: 40000,
            duration: 10,
            requiredSkills: { coding: 25 },
            skillIncrease: { coding: 15 },
            unlocks: ['mmo', 'vr'],
            unlocked: false,
            completed: false,
            description: '최첨단 게임 엔진을 개발하여 복잡한 게임 개발을 가능하게 합니다.'
        },
        {
            id: 'graphics_basic',
            name: '기본 그래픽 기술',
            category: 'graphics',
            level: 1,
            cost: 5000,
            duration: 4,
            requiredSkills: {},
            skillIncrease: { design: 5 },
            unlocks: ['graphics_intermediate'],
            unlocked: true,
            completed: false,
            description: '기본적인 그래픽 기술을 개발하여 게임의 시각적 품질을 향상시킵니다.'
        },
        {
            id: 'graphics_intermediate',
            name: '중급 그래픽 기술',
            category: 'graphics',
            level: 2,
            cost: 15000,
            duration: 6,
            requiredSkills: { design: 10 },
            skillIncrease: { design: 10 },
            unlocks: ['graphics_advanced', 'horror'],
            unlocked: false,
            completed: false,
            description: '더 발전된 그래픽 기술을 개발하여 게임의 시각적 품질을 크게 향상시킵니다.'
        },
        {
            id: 'graphics_advanced',
            name: '고급 그래픽 기술',
            category: 'graphics',
            level: 3,
            cost: 40000,
            duration: 10,
            requiredSkills: { design: 25 },
            skillIncrease: { design: 15 },
            unlocks: ['vr'],
            unlocked: false,
            completed: false,
            description: '최첨단 그래픽 기술을 개발하여 사실적인 시각 효과를 구현합니다.'
        },
        {
            id: 'sound_basic',
            name: '기본 사운드 기술',
            category: 'sound',
            level: 1,
            cost: 5000,
            duration: 4,
            requiredSkills: {},
            skillIncrease: { design: 3, writing: 2 },
            unlocks: ['sound_intermediate'],
            unlocked: true,
            completed: false,
            description: '기본적인 사운드 기술을 개발하여 게임의 오디오 품질을 향상시킵니다.'
        },
        {
            id: 'sound_intermediate',
            name: '중급 사운드 기술',
            category: 'sound',
            level: 2,
            cost: 15000,
            duration: 6,
            requiredSkills: { design: 8, writing: 5 },
            skillIncrease: { design: 5, writing: 5 },
            unlocks: ['sound_advanced', 'sports', 'racing'],
            unlocked: false,
            completed: false,
            description: '더 발전된 사운드 기술을 개발하여 게임의 오디오 품질을 크게 향상시킵니다.'
        },
        {
            id: 'sound_advanced',
            name: '고급 사운드 기술',
            category: 'sound',
            level: 3,
            cost: 40000,
            duration: 10,
            requiredSkills: { design: 20, writing: 15 },
            skillIncrease: { design: 10, writing: 10 },
            unlocks: [],
            unlocked: false,
            completed: false,
            description: '최첨단 사운드 기술을 개발하여 몰입감 있는 오디오 경험을 제공합니다.'
        },
        {
            id: 'ai_basic',
            name: '기본 AI 기술',
            category: 'ai',
            level: 1,
            cost: 5000,
            duration: 4,
            requiredSkills: {},
            skillIncrease: { coding: 3, design: 2 },
            unlocks: ['ai_intermediate'],
            unlocked: true,
            completed: false,
            description: '기본적인 AI 기술을 개발하여 게임 내 NPC의 행동을 향상시킵니다.'
        },
        {
            id: 'ai_intermediate',
            name: '중급 AI 기술',
            category: 'ai',
            level: 2,
            cost: 15000,
            duration: 6,
            requiredSkills: { coding: 10, design: 5 },
            skillIncrease: { coding: 5, design: 5 },
            unlocks: ['ai_advanced', 'strategy', 'puzzle'],
            unlocked: false,
            completed: false,
            description: '더 발전된 AI 기술을 개발하여 지능적인 게임 경험을 제공합니다.'
        },
        {
            id: 'ai_advanced',
            name: '고급 AI 기술',
            category: 'ai',
            level: 3,
            cost: 40000,
            duration: 10,
            requiredSkills: { coding: 20, design: 15 },
            skillIncrease: { coding: 10, design: 10 },
            unlocks: ['mmo'],
            unlocked: false,
            completed: false,
            description: '최첨단 AI 기술을 개발하여 복잡하고 적응력 있는 게임 시스템을 구현합니다.'
        }
    ],
    
    // 마케팅 캠페인 정의
    marketingCampaigns: [
        {
            id: 'social',
            name: '소셜 미디어 캠페인',
            cost: 2000,
            duration: 2, // 주 단위
            effects: {
                hype: 10,
                salesMultiplier: 1.1,
                reputationGain: 5
            },
            description: '소셜 미디어를 통해 게임을 홍보합니다. 비용이 적게 들지만 효과도 제한적입니다.'
        },
        {
            id: 'online',
            name: '온라인 광고',
            cost: 5000,
            duration: 3,
            effects: {
                hype: 20,
                salesMultiplier: 1.2,
                reputationGain: 10
            },
            description: '온라인 광고를 통해 게임을 홍보합니다. 중간 정도의 비용과 효과를 가집니다.'
        },
        {
            id: 'influencer',
            name: '인플루언서 마케팅',
            cost: 8000,
            duration: 2,
            effects: {
                hype: 30,
                salesMultiplier: 1.3,
                reputationGain: 15,
                fansGain: 500
            },
            description: '유명 인플루언서를 통해 게임을 홍보합니다. 팬층 확보에 효과적입니다.'
        },
        {
            id: 'expo',
            name: '게임 엑스포 참가',
            cost: 15000,
            duration: 1,
            effects: {
                hype: 40,
                salesMultiplier: 1.4,
                reputationGain: 25,
                fansGain: 1000
            },
            description: '게임 전시회에 참가하여 게임을 홍보합니다. 단기간에 큰 효과를 볼 수 있습니다.'
        },
        {
            id: 'tv',
            name: 'TV 광고',
            cost: 30000,
            duration: 4,
            effects: {
                hype: 60,
                salesMultiplier: 1.6,
                reputationGain: 40,
                fansGain: 2000
            },
            description: 'TV 광고를 통해 게임을 홍보합니다. 비용이 많이 들지만 효과가 매우 큽니다.'
        }
    ],
    
    // 마케팅 이벤트 정의
    marketingEvents: [
        {
            id: 'viral',
            name: '바이럴 영상',
            probability: 0.05,
            effects: {
                hype: 30,
                salesMultiplier: 1.3,
                reputationGain: 20,
                fansGain: 1000
            },
            description: '게임 영상이 인터넷에서 바이럴이 되었습니다!'
        },
        {
            id: 'review',
            name: '긍정적인 리뷰',
            probability: 0.1,
            effects: {
                hype: 15,
                salesMultiplier: 1.2,
                reputationGain: 15
            },
            description: '유명 게임 리뷰어가 게임에 대해 긍정적인 리뷰를 남겼습니다!'
        },
        {
            id: 'award',
            name: '게임 어워드 수상',
            probability: 0.02,
            effects: {
                hype: 50,
                salesMultiplier: 1.5,
                reputationGain: 50,
                fansGain: 2000
            },
            description: '게임이 권위 있는 게임 어워드를 수상했습니다!'
        },
        {
            id: 'community',
            name: '커뮤니티 이벤트',
            probability: 0.08,
            effects: {
                hype: 10,
                salesMultiplier: 1.1,
                reputationGain: 10,
                fansGain: 500
            },
            description: '팬들이 자발적으로 게임 커뮤니티 이벤트를 개최했습니다!'
        }
    ],
    
    // 대출 상품 정의
    loans: [
        {
            id: 'small',
            name: '소액 대출',
            amount: 10000,
            interestRate: 0.05, // 5%
            term: 12, // 개월 단위
            description: '소액의 대출로, 낮은 이자율을 제공합니다.'
        },
        {
            id: 'medium',
            name: '중액 대출',
            amount: 50000,
            interestRate: 0.08, // 8%
            term: 24,
            description: '중간 규모의 대출로, 적절한 이자율을 제공합니다.'
        },
        {
            id: 'large',
            name: '대액 대출',
            amount: 100000,
            interestRate: 0.12, // 12%
            term: 36,
            description: '대규모 대출로, 높은 이자율을 가지지만 많은 자금을 제공합니다.'
        },
        {
            id: 'emergency',
            name: '긴급 대출',
            amount: 20000,
            interestRate: 0.15, // 15%
            term: 6,
            description: '파산 위기에 처했을 때 제공되는 긴급 대출입니다. 높은 이자율을 가집니다.'
        }
    ],
    
    // 투자자 정의
    investors: [
        {
            id: 'angel',
            name: '엔젤 투자자',
            minReputation: 20,
            investmentRange: [20000, 50000],
            equityRange: [0.1, 0.2], // 10-20%
            description: '소규모 투자를 제공하는 개인 투자자입니다.'
        },
        {
            id: 'venture',
            name: '벤처 캐피탈',
            minReputation: 50,
            investmentRange: [100000, 300000],
            equityRange: [0.2, 0.3], // 20-30%
            description: '중규모 투자를 제공하는 전문 투자 기업입니다.'
        },
        {
            id: 'corporate',
            name: '기업 투자자',
            minReputation: 100,
            investmentRange: [500000, 1000000],
            equityRange: [0.3, 0.4], // 30-40%
            description: '대규모 투자를 제공하는 대기업 투자자입니다.'
        }
    ],
    
    // 게임 난이도 설정
    difficulties: [
        {
            id: 'easy',
            name: '쉬움',
            startingMoney: 20000,
            costMultiplier: 0.8,
            revenueMultiplier: 1.2,
            fanGainMultiplier: 1.2,
            description: '더 많은 초기 자금과 낮은 비용으로 시작합니다.'
        },
        {
            id: 'normal',
            name: '보통',
            startingMoney: 10000,
            costMultiplier: 1.0,
            revenueMultiplier: 1.0,
            fanGainMultiplier: 1.0,
            description: '균형 잡힌 게임 경험을 제공합니다.'
        },
        {
            id: 'hard',
            name: '어려움',
            startingMoney: 5000,
            costMultiplier: 1.2,
            revenueMultiplier: 0.8,
            fanGainMultiplier: 0.8,
            description: '적은 초기 자금과 높은 비용으로 도전적인 경험을 제공합니다.'
        }
    ],
    
    // 게임 전문화 분야
    specializations: [
        {
            id: 'balanced',
            name: '균형',
            skills: { coding: 5, design: 5, writing: 5, marketing: 5 },
            description: '모든 분야에서 균형 잡힌 능력을 가집니다.'
        },
        {
            id: 'technical',
            name: '기술',
            skills: { coding: 10, design: 7, writing: 3, marketing: 0 },
            description: '코딩과 기술적 측면에서 뛰어난 능력을 가집니다.'
        },
        {
            id: 'creative',
            name: '창의',
            skills: { coding: 3, design: 10, writing: 7, marketing: 0 },
            description: '디자인과 창의적 측면에서 뛰어난 능력을 가집니다.'
        },
        {
            id: 'narrative',
            name: '서사',
            skills: { coding: 0, design: 5, writing: 10, marketing: 5 },
            description: '스토리텔링과 서사적 측면에서 뛰어난 능력을 가집니다.'
        },
        {
            id: 'business',
            name: '비즈니스',
            skills: { coding: 0, design: 3, writing: 3, marketing: 14 },
            description: '마케팅과 비즈니스 측면에서 뛰어난 능력을 가집니다.'
        }
    ],
    
    // 직원 이름 목록 (한국어 이름)
    employeeNames: [
        '김민준', '이지훈', '박서준', '최준호', '정우진',
        '강도현', '윤민석', '임지호', '한승우', '송현우',
        '김지민', '이서연', '박민지', '최수빈', '정유진',
        '강지은', '윤서영', '임지원', '한미나', '송지현',
        '김태호', '이민수', '박준영', '최동현', '정민재',
        '강현우', '윤재원', '임준혁', '한지훈', '송민석',
        '김서영', '이지은', '박수진', '최예은', '정다은',
        '강민지', '윤지원', '임수빈', '한서연', '송지은'
    ],
    
    // 게임 제목 생성을 위한 단어 목록
    gameTitleWords: {
        prefixes: [
            '슈퍼', '울트라', '메가', '판타지', '미스터리', '어드벤처', '배틀', '레전드', '히어로', '다크',
            '에픽', '그랜드', '마이티', '글로리', '인피니티', '스타', '프로젝트', '크리스탈', '섀도우', '라이징'
        ],
        nouns: [
            '워리어', '헌터', '퀘스트', '킹덤', '레전드', '월드', '타워', '던전', '시티', '엠파이어',
            '히어로', '나이트', '소드', '드래곤', '타이쿤', '시뮬레이터', '매니저', '마스터', '챔피언', '아레나'
        ],
        suffixes: [
            '크로니클', '사가', '스토리', '어드벤처', '레볼루션', '오리진', '디펜스', '워', '라이더', '키퍼',
            '메이커', '챌린지', '레이싱', '러너', '디펜더', '컨퀘스트', '마스터리', '레이드', '오디세이', '레전드'
        ]
    }
};