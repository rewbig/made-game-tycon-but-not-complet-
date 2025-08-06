using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro;
using System;

public class UIManager : MonoBehaviour
{
    // 싱글톤 패턴 구현
    public static UIManager Instance { get; private set; }

    // UI 패널
    [Header("Main Panels")]
    public GameObject mainMenuPanel;
    public GameObject gameplayPanel;
    public GameObject pausePanel;
    
    [Header("Gameplay Panels")]
    public GameObject studioPanel;
    public GameObject projectPanel;
    public GameObject employeePanel;
    public GameObject researchPanel;
    public GameObject marketingPanel;
    public GameObject financePanel;
    
    [Header("Studio Info")]
    public TextMeshProUGUI studioNameText;
    public TextMeshProUGUI moneyText;
    public TextMeshProUGUI reputationText;
    public TextMeshProUGUI dateText;
    
    [Header("Project Info")]
    public TextMeshProUGUI projectTitleText;
    public TextMeshProUGUI projectGenreText;
    public TextMeshProUGUI projectPlatformText;
    public TextMeshProUGUI projectStageText;
    public Slider projectProgressSlider;
    public TextMeshProUGUI projectQualityText;
    
    [Header("Employee Info")]
    public Transform employeeListContainer;
    public GameObject employeeItemPrefab;
    public Transform candidateListContainer;
    public GameObject candidateItemPrefab;
    
    [Header("Game Speed Controls")]
    public Button pauseButton;
    public Button playButton;
    public Button fastForwardButton;
    
    // 현재 활성화된 패널
    private GameObject currentPanel;
    
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
    }
    
    private void Start()
    {
        // 게임 매니저 이벤트 구독
        GameManager.Instance.OnGameStateChanged += OnGameStateChanged;
        GameManager.Instance.OnDayChanged += UpdateDateDisplay;
        
        // 프로젝트 매니저 이벤트 구독
        ProjectManager.Instance.OnProjectStarted += UpdateProjectDisplay;
        ProjectManager.Instance.OnProgressChanged += UpdateProjectProgress;
        ProjectManager.Instance.OnStageChanged += UpdateProjectStage;
        
        // 직원 매니저 이벤트 구독
        EmployeeManager.Instance.OnEmployeeHired += UpdateEmployeeList;
        EmployeeManager.Instance.OnEmployeeFired += UpdateEmployeeList;
        EmployeeManager.Instance.OnCandidatesRefreshed += UpdateCandidateList;
        
        // 초기 UI 설정
        SetupButtons();
        ShowMainMenu();
    }
    
    private void OnDestroy()
    {
        // 이벤트 구독 해제
        if (GameManager.Instance != null)
        {
            GameManager.Instance.OnGameStateChanged -= OnGameStateChanged;
            GameManager.Instance.OnDayChanged -= UpdateDateDisplay;
        }
        
        if (ProjectManager.Instance != null)
        {
            ProjectManager.Instance.OnProjectStarted -= UpdateProjectDisplay;
            ProjectManager.Instance.OnProgressChanged -= UpdateProjectProgress;
            ProjectManager.Instance.OnStageChanged -= UpdateProjectStage;
        }
        
        if (EmployeeManager.Instance != null)
        {
            EmployeeManager.Instance.OnEmployeeHired -= UpdateEmployeeList;
            EmployeeManager.Instance.OnEmployeeFired -= UpdateEmployeeList;
            EmployeeManager.Instance.OnCandidatesRefreshed -= UpdateCandidateList;
        }
    }
    
    private void Update()
    {
        // 게임 플레이 중일 때만 UI 업데이트
        if (GameManager.Instance.CurrentState == GameManager.GameState.Playing)
        {
            UpdateStudioInfo();
        }
    }
    
    private void SetupButtons()
    {
        // 게임 속도 제어 버튼 설정
        pauseButton.onClick.AddListener(() => {
            GameManager.Instance.SetTimeScale(0f);
            GameManager.Instance.SetGameState(GameManager.GameState.Paused);
        });
        
        playButton.onClick.AddListener(() => {
            GameManager.Instance.SetTimeScale(1f);
            GameManager.Instance.SetGameState(GameManager.GameState.Playing);
        });
        
        fastForwardButton.onClick.AddListener(() => {
            GameManager.Instance.SetTimeScale(2f);
            GameManager.Instance.SetGameState(GameManager.GameState.Playing);
        });
    }
    
    private void OnGameStateChanged(GameManager.GameState newState)
    {
        // 게임 상태 변경에 따른 UI 업데이트
        switch (newState)
        {
            case GameManager.GameState.MainMenu:
                ShowMainMenu();
                break;
            case GameManager.GameState.Playing:
                ShowGameplay();
                break;
            case GameManager.GameState.Paused:
                ShowPauseMenu();
                break;
        }
    }
    
    public void ShowMainMenu()
    {
        // 메인 메뉴 표시
        HideAllPanels();
        mainMenuPanel.SetActive(true);
        currentPanel = mainMenuPanel;
    }
    
    public void ShowGameplay()
    {
        // 게임플레이 화면 표시
        HideAllPanels();
        gameplayPanel.SetActive(true);
        ShowStudioPanel(); // 기본적으로 스튜디오 패널 표시
    }
    
    public void ShowPauseMenu()
    {
        // 일시 정지 메뉴 표시
        pausePanel.SetActive(true);
    }
    
    public void HideAllPanels()
    {
        // 모든 패널 숨기기
        mainMenuPanel.SetActive(false);
        gameplayPanel.SetActive(false);
        pausePanel.SetActive(false);
        
        // 게임플레이 서브 패널 숨기기
        studioPanel.SetActive(false);
        projectPanel.SetActive(false);
        employeePanel.SetActive(false);
        researchPanel.SetActive(false);
        marketingPanel.SetActive(false);
        financePanel.SetActive(false);
    }
    
    public void ShowStudioPanel()
    {
        // 스튜디오 패널 표시
        HideGameplayPanels();
        studioPanel.SetActive(true);
        currentPanel = studioPanel;
        UpdateStudioInfo();
    }
    
    public void ShowProjectPanel()
    {
        // 프로젝트 패널 표시
        HideGameplayPanels();
        projectPanel.SetActive(true);
        currentPanel = projectPanel;
        UpdateProjectDisplay(GameManager.Instance.PlayerData.CurrentProject);
    }
    
    public void ShowEmployeePanel()
    {
        // 직원 패널 표시
        HideGameplayPanels();
        employeePanel.SetActive(true);
        currentPanel = employeePanel;
        UpdateEmployeeList(null);
        UpdateCandidateList();
    }
    
    public void ShowResearchPanel()
    {
        // 연구 패널 표시
        HideGameplayPanels();
        researchPanel.SetActive(true);
        currentPanel = researchPanel;
    }
    
    public void ShowMarketingPanel()
    {
        // 마케팅 패널 표시
        HideGameplayPanels();
        marketingPanel.SetActive(true);
        currentPanel = marketingPanel;
    }
    
    public void ShowFinancePanel()
    {
        // 재정 패널 표시
        HideGameplayPanels();
        financePanel.SetActive(true);
        currentPanel = financePanel;
    }
    
    private void HideGameplayPanels()
    {
        // 게임플레이 서브 패널 숨기기
        studioPanel.SetActive(false);
        projectPanel.SetActive(false);
        employeePanel.SetActive(false);
        researchPanel.SetActive(false);
        marketingPanel.SetActive(false);
        financePanel.SetActive(false);
    }
    
    private void UpdateStudioInfo()
    {
        // 스튜디오 정보 업데이트
        PlayerData playerData = GameManager.Instance.PlayerData;
        
        studioNameText.text = playerData.StudioName;
        moneyText.text = $"￦{playerData.Money:N0}";
        reputationText.text = $"평판: {playerData.Reputation:F1}";
        
        UpdateDateDisplay();
    }
    
    private void UpdateDateDisplay()
    {
        // 날짜 표시 업데이트
        int day = GameManager.Instance.CurrentDay;
        int week = GameManager.Instance.CurrentWeek;
        int month = GameManager.Instance.CurrentMonth;
        int year = GameManager.Instance.CurrentYear;
        
        dateText.text = $"{year}년 {month}월 {week}주차 {day}일";
    }
    
    private void UpdateProjectDisplay(GameProject project)
    {
        // 프로젝트 정보 업데이트
        if (project == null)
        {
            projectTitleText.text = "진행 중인 프로젝트 없음";
            projectGenreText.text = "";
            projectPlatformText.text = "";
            projectStageText.text = "";
            projectProgressSlider.value = 0f;
            projectQualityText.text = "품질: 0";
            return;
        }
        
        projectTitleText.text = project.Title;
        projectGenreText.text = $"장르: {project.Genre}";
        projectPlatformText.text = $"플랫폼: {project.Platform}";
        UpdateProjectStage(ProjectManager.Instance.CurrentStage);
        UpdateProjectProgress(ProjectManager.Instance.DevelopmentProgress);
        projectQualityText.text = $"품질: {project.Quality:F1}";
    }
    
    private void UpdateProjectProgress(float progress)
    {
        // 프로젝트 진행도 업데이트
        projectProgressSlider.value = progress / 100f;
    }
    
    private void UpdateProjectStage(ProjectManager.DevelopmentStage stage)
    {
        // 프로젝트 단계 업데이트
        string stageText = "";
        
        switch (stage)
        {
            case ProjectManager.DevelopmentStage.Planning:
                stageText = "기획 단계";
                break;
            case ProjectManager.DevelopmentStage.PreProduction:
                stageText = "사전 제작 단계";
                break;
            case ProjectManager.DevelopmentStage.Production:
                stageText = "제작 단계";
                break;
            case ProjectManager.DevelopmentStage.Testing:
                stageText = "테스트 단계";
                break;
            case ProjectManager.DevelopmentStage.Release:
                stageText = "출시 준비 단계";
                break;
            case ProjectManager.DevelopmentStage.Marketing:
                stageText = "마케팅 단계";
                break;
        }
        
        projectStageText.text = $"단계: {stageText}";
    }
    
    private void UpdateEmployeeList(Employee employee)
    {
        // 직원 목록 업데이트
        // 기존 항목 제거
        foreach (Transform child in employeeListContainer)
        {
            Destroy(child.gameObject);
        }
        
        // 새 항목 생성
        foreach (Employee emp in EmployeeManager.Instance.Employees)
        {
            GameObject item = Instantiate(employeeItemPrefab, employeeListContainer);
            SetupEmployeeItem(item, emp);
        }
    }
    
    private void UpdateCandidateList()
    {
        // 후보자 목록 업데이트
        // 기존 항목 제거
        foreach (Transform child in candidateListContainer)
        {
            Destroy(child.gameObject);
        }
        
        // 새 항목 생성
        foreach (Employee candidate in EmployeeManager.Instance.AvailableCandidates)
        {
            GameObject item = Instantiate(candidateItemPrefab, candidateListContainer);
            SetupCandidateItem(item, candidate);
        }
    }
    
    private void SetupEmployeeItem(GameObject item, Employee employee)
    {
        // 직원 항목 설정
        TextMeshProUGUI nameText = item.transform.Find("NameText").GetComponent<TextMeshProUGUI>();
        TextMeshProUGUI skillText = item.transform.Find("SkillText").GetComponent<TextMeshProUGUI>();
        TextMeshProUGUI salaryText = item.transform.Find("SalaryText").GetComponent<TextMeshProUGUI>();
        Slider satisfactionSlider = item.transform.Find("SatisfactionSlider").GetComponent<Slider>();
        Button fireButton = item.transform.Find("FireButton").GetComponent<Button>();
        Button trainButton = item.transform.Find("TrainButton").GetComponent<Button>();
        
        nameText.text = employee.Name;
        skillText.text = $"{employee.MainSkill}: {employee.Skills[employee.MainSkill]:F1}";
        salaryText.text = $"￦{employee.Salary:N0}/주";
        satisfactionSlider.value = employee.Satisfaction / 100f;
        
        fireButton.onClick.AddListener(() => {
            EmployeeManager.Instance.FireEmployee(employee);
        });
        
        trainButton.onClick.AddListener(() => {
            // 교육 비용은 스킬 레벨에 비례
            float trainingCost = 1000f * (employee.Skills[employee.MainSkill] / 50f);
            EmployeeManager.Instance.TrainEmployee(employee, employee.MainSkill, trainingCost);
        });
    }
    
    private void SetupCandidateItem(GameObject item, Employee candidate)
    {
        // 후보자 항목 설정
        TextMeshProUGUI nameText = item.transform.Find("NameText").GetComponent<TextMeshProUGUI>();
        TextMeshProUGUI skillText = item.transform.Find("SkillText").GetComponent<TextMeshProUGUI>();
        TextMeshProUGUI salaryText = item.transform.Find("SalaryText").GetComponent<TextMeshProUGUI>();
        TextMeshProUGUI experienceText = item.transform.Find("ExperienceText").GetComponent<TextMeshProUGUI>();
        Button hireButton = item.transform.Find("HireButton").GetComponent<Button>();
        
        nameText.text = candidate.Name;
        skillText.text = $"{candidate.MainSkill}: {candidate.Skills[candidate.MainSkill]:F1}";
        salaryText.text = $"￦{candidate.Salary:N0}/주";
        experienceText.text = $"경력: {candidate.Experience}년";
        
        hireButton.onClick.AddListener(() => {
            EmployeeManager.Instance.HireEmployee(candidate);
        });
    }
    
    public void StartNewGame()
    {
        // 새 게임 시작
        GameManager.Instance.StartNewGame();
    }
    
    public void OpenNewProjectDialog()
    {
        // 새 프로젝트 다이얼로그 열기
        // 실제 구현에서는 다이얼로그 UI를 표시하고 사용자 입력을 받음
        // 여기서는 간단히 하드코딩된 값으로 새 프로젝트 시작
        ProjectManager.Instance.StartNewProject("새 게임", "액션", "PC");
    }
    
    public void SaveGame()
    {
        // 게임 저장
        GameManager.Instance.SaveGame();
    }
    
    public void LoadGame()
    {
        // 게임 불러오기
        GameManager.Instance.LoadGame();
    }
    
    public void QuitGame()
    {
        // 게임 종료
        #if UNITY_EDITOR
        UnityEditor.EditorApplication.isPlaying = false;
        #else
        Application.Quit();
        #endif
    }
}