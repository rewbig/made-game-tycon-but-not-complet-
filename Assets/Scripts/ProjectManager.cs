using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

public class ProjectManager : MonoBehaviour
{
    // 싱글톤 패턴 구현
    public static ProjectManager Instance { get; private set; }

    // 게임 장르 목록
    public List<GameGenre> AvailableGenres = new List<GameGenre>();
    
    // 게임 플랫폼 목록
    public List<GamePlatform> AvailablePlatforms = new List<GamePlatform>();
    
    // 현재 개발 중인 프로젝트
    public GameProject CurrentProject { get; private set; }
    
    // 개발 단계
    public enum DevelopmentStage { Planning, PreProduction, Production, Testing, Release, Marketing }
    public DevelopmentStage CurrentStage { get; private set; }
    
    // 개발 진행도
    public float DevelopmentProgress { get; private set; }
    
    // 이벤트
    public event Action<GameProject> OnProjectStarted;
    public event Action<GameProject> OnProjectCompleted;
    public event Action<DevelopmentStage> OnStageChanged;
    public event Action<float> OnProgressChanged;
    
    private void Awake()
    {
        // 싱글톤 패턴 구현
        if (Instance != null && Instance != this)
        {
            Destroy(gameObject);
            return;
        }

        Instance = this;
        DontDestroyOnLoad(gameObject);
        
        // 초기화
        InitializeGenres();
        InitializePlatforms();
    }
    
    private void Start()
    {
        // 게임 매니저 이벤트 구독
        GameManager.Instance.OnDayChanged += OnDayChanged;
    }
    
    private void OnDestroy()
    {
        // 이벤트 구독 해제
        if (GameManager.Instance != null)
        {
            GameManager.Instance.OnDayChanged -= OnDayChanged;
        }
    }
    
    private void InitializeGenres()
    {
        // 게임 장르 초기화
        AvailableGenres.Add(new GameGenre("액션", "빠른 반응 속도와 손-눈 협응이 필요한 게임", 1.0f));
        AvailableGenres.Add(new GameGenre("어드벤처", "탐험과 퍼즐 해결이 중심인 게임", 0.9f));
        AvailableGenres.Add(new GameGenre("롤플레잉", "캐릭터 성장과 스토리가 중요한 게임", 1.2f));
        AvailableGenres.Add(new GameGenre("시뮬레이션", "현실적인 상황을 시뮬레이션하는 게임", 1.1f));
        AvailableGenres.Add(new GameGenre("전략", "전술적 사고와 자원 관리가 중요한 게임", 1.0f));
        AvailableGenres.Add(new GameGenre("스포츠", "실제 스포츠를 모방한 게임", 0.8f));
        AvailableGenres.Add(new GameGenre("퍼즐", "논리적 사고와 문제 해결이 중심인 게임", 0.7f));
        AvailableGenres.Add(new GameGenre("캐주얼", "간단하고 접근하기 쉬운 게임", 0.6f));
    }
    
    private void InitializePlatforms()
    {
        // 게임 플랫폼 초기화
        AvailablePlatforms.Add(new GamePlatform("PC", "개인용 컴퓨터", 1.0f, 5000f));
        AvailablePlatforms.Add(new GamePlatform("콘솔", "가정용 게임 콘솔", 1.2f, 10000f));
        AvailablePlatforms.Add(new GamePlatform("모바일", "스마트폰 및 태블릿", 0.8f, 2000f));
        AvailablePlatforms.Add(new GamePlatform("VR", "가상현실 기기", 1.5f, 15000f));
    }
    
    private void OnDayChanged()
    {
        // 매일 프로젝트 진행 업데이트
        if (CurrentProject != null && !CurrentProject.IsReleased)
        {
            UpdateProjectDevelopment();
        }
    }
    
    private void UpdateProjectDevelopment()
    {
        // 개발 진행도 업데이트
        float dailyProgress = CalculateDailyProgress();
        DevelopmentProgress += dailyProgress;
        OnProgressChanged?.Invoke(DevelopmentProgress);
        
        // 개발 단계 확인 및 변경
        CheckDevelopmentStage();
        
        // 프로젝트 품질 업데이트
        UpdateProjectQuality(dailyProgress);
        
        // 예산 소비
        ConsumeProjectBudget();
    }
    
    private float CalculateDailyProgress()
    {
        // 일일 개발 진행도 계산
        float baseProgress = 0.5f;
        float skillMultiplier = CalculateSkillMultiplier();
        float teamSizeMultiplier = Mathf.Sqrt(GameManager.Instance.PlayerData.EmployeeCount) / 2f;
        
        return baseProgress * skillMultiplier * teamSizeMultiplier;
    }
    
    private float CalculateSkillMultiplier()
    {
        // 스킬 기반 진행도 배수 계산
        PlayerData playerData = GameManager.Instance.PlayerData;
        float programmingFactor = playerData.Skills["Programming"] / 50f;
        float artFactor = playerData.Skills["Art"] / 50f;
        float designFactor = playerData.Skills["Design"] / 50f;
        float soundFactor = playerData.Skills["Sound"] / 50f;
        
        return (programmingFactor + artFactor + designFactor + soundFactor) / 4f;
    }
    
    private void CheckDevelopmentStage()
    {
        // 개발 단계 확인 및 변경
        DevelopmentStage newStage = CurrentStage;
        
        if (DevelopmentProgress < 20f)
        {
            newStage = DevelopmentStage.Planning;
        }
        else if (DevelopmentProgress < 40f)
        {
            newStage = DevelopmentStage.PreProduction;
        }
        else if (DevelopmentProgress < 70f)
        {
            newStage = DevelopmentStage.Production;
        }
        else if (DevelopmentProgress < 90f)
        {
            newStage = DevelopmentStage.Testing;
        }
        else if (DevelopmentProgress < 100f)
        {
            newStage = DevelopmentStage.Release;
        }
        else
        {
            newStage = DevelopmentStage.Marketing;
            
            // 개발 완료
            if (!CurrentProject.IsReleased)
            {
                CompleteProject();
            }
        }
        
        // 단계 변경 이벤트 발생
        if (newStage != CurrentStage)
        {
            CurrentStage = newStage;
            OnStageChanged?.Invoke(CurrentStage);
        }
    }
    
    private void UpdateProjectQuality(float progress)
    {
        // 프로젝트 품질 업데이트
        PlayerData playerData = GameManager.Instance.PlayerData;
        float qualityIncrease = progress * (playerData.Skills["Programming"] + playerData.Skills["Art"] + 
                                          playerData.Skills["Design"] + playerData.Skills["Sound"]) / 200f;
        
        CurrentProject.Quality += qualityIncrease;
    }
    
    private void ConsumeProjectBudget()
    {
        // 일일 예산 소비
        float dailyCost = 100f * GameManager.Instance.PlayerData.EmployeeCount;
        CurrentProject.Budget += dailyCost;
        GameManager.Instance.PlayerData.Money -= dailyCost;
    }
    
    public void StartNewProject(string title, string genreName, string platformName)
    {
        // 새 프로젝트 시작
        GameGenre genre = AvailableGenres.Find(g => g.Name == genreName);
        GamePlatform platform = AvailablePlatforms.Find(p => p.Name == platformName);
        
        if (genre == null || platform == null)
        {
            Debug.LogError("Invalid genre or platform!");
            return;
        }
        
        // 초기 비용 지불
        if (GameManager.Instance.PlayerData.Money < platform.LicenseCost)
        {
            Debug.LogError("Not enough money to start project!");
            return;
        }
        
        GameManager.Instance.PlayerData.Money -= platform.LicenseCost;
        
        // 새 프로젝트 생성
        CurrentProject = new GameProject(title, genre.Name, platform.Name);
        GameManager.Instance.PlayerData.CurrentProject = CurrentProject;
        
        // 개발 단계 초기화
        CurrentStage = DevelopmentStage.Planning;
        DevelopmentProgress = 0f;
        
        // 이벤트 발생
        OnProjectStarted?.Invoke(CurrentProject);
        OnStageChanged?.Invoke(CurrentStage);
        OnProgressChanged?.Invoke(DevelopmentProgress);
    }
    
    private void CompleteProject()
    {
        // 프로젝트 완료 처리
        CurrentProject.IsReleased = true;
        CurrentProject.ReleaseYear = GameManager.Instance.CurrentYear;
        CurrentProject.ReleaseMonth = GameManager.Instance.CurrentMonth;
        
        // 판매량 및 수익 계산
        CalculateProjectSales();
        
        // 완료된 게임 목록에 추가
        GameManager.Instance.PlayerData.CompletedGames.Add(CurrentProject);
        GameManager.Instance.PlayerData.CurrentProject = null;
        
        // 이벤트 발생
        OnProjectCompleted?.Invoke(CurrentProject);
        
        // 현재 프로젝트 초기화
        CurrentProject = null;
    }
    
    private void CalculateProjectSales()
    {
        // 판매량 및 수익 계산
        float qualityFactor = CurrentProject.Quality / 100f;
        float marketingFactor = CurrentProject.Marketing / 100f;
        float reputationFactor = GameManager.Instance.PlayerData.Reputation / 100f;
        
        // 장르 및 플랫폼 배수 적용
        GameGenre genre = AvailableGenres.Find(g => g.Name == CurrentProject.Genre);
        GamePlatform platform = AvailablePlatforms.Find(p => p.Name == CurrentProject.Platform);
        
        float genreMultiplier = genre != null ? genre.PopularityMultiplier : 1.0f;
        float platformMultiplier = platform != null ? platform.MarketShareMultiplier : 1.0f;
        
        // 기본 판매량 계산
        float baseSales = 1000f * qualityFactor * (1f + marketingFactor) * (1f + reputationFactor) * 
                         genreMultiplier * platformMultiplier;
        
        // 랜덤 요소 추가 (80% ~ 120%)
        float randomFactor = UnityEngine.Random.Range(0.8f, 1.2f);
        
        // 최종 판매량 및 수익 설정
        CurrentProject.Sales = Mathf.Round(baseSales * randomFactor);
        
        // 수익 계산 (판매량 * 평균 가격 - 개발 비용)
        float averagePrice = 30f; // 평균 게임 가격
        CurrentProject.Revenue = CurrentProject.Sales * averagePrice - CurrentProject.Budget;
        
        // 플레이어 돈과 평판 업데이트
        GameManager.Instance.PlayerData.Money += CurrentProject.Revenue;
        GameManager.Instance.PlayerData.Reputation += CurrentProject.Quality / 10f;
    }
    
    public void InvestInMarketing(float amount)
    {
        // 마케팅에 투자
        if (CurrentProject == null || CurrentProject.IsReleased)
        {
            Debug.LogError("No active project to invest in marketing!");
            return;
        }
        
        if (GameManager.Instance.PlayerData.Money < amount)
        {
            Debug.LogError("Not enough money for marketing!");
            return;
        }
        
        GameManager.Instance.PlayerData.Money -= amount;
        CurrentProject.Marketing += amount / 100f;
    }
}

// 게임 장르 클래스
[System.Serializable]
public class GameGenre
{
    public string Name;
    public string Description;
    public float PopularityMultiplier;
    
    public GameGenre(string name, string description, float popularityMultiplier)
    {
        Name = name;
        Description = description;
        PopularityMultiplier = popularityMultiplier;
    }
}

// 게임 플랫폼 클래스
[System.Serializable]
public class GamePlatform
{
    public string Name;
    public string Description;
    public float MarketShareMultiplier;
    public float LicenseCost;
    
    public GamePlatform(string name, string description, float marketShareMultiplier, float licenseCost)
    {
        Name = name;
        Description = description;
        MarketShareMultiplier = marketShareMultiplier;
        LicenseCost = licenseCost;
    }
}