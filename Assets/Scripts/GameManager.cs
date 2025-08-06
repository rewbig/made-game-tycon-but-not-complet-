using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

public class GameManager : MonoBehaviour
{
    // 싱글톤 패턴 구현
    public static GameManager Instance { get; private set; }

    // 게임 상태 관리
    public enum GameState { MainMenu, Playing, Paused }
    public GameState CurrentState { get; private set; }

    // 게임 시간 관리
    public float GameTime { get; private set; }
    public int CurrentDay { get; private set; }
    public int CurrentWeek { get; private set; }
    public int CurrentMonth { get; private set; }
    public int CurrentYear { get; private set; }
    public float TimeScale { get; private set; } = 1f;

    // 플레이어 데이터
    public PlayerData PlayerData { get; private set; }

    // 이벤트
    public event Action<GameState> OnGameStateChanged;
    public event Action OnDayChanged;
    public event Action OnWeekChanged;
    public event Action OnMonthChanged;
    public event Action OnYearChanged;

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

        // 초기 설정
        CurrentState = GameState.MainMenu;
        InitializeGame();
    }

    private void Start()
    {
        // 게임 시작 시 초기화
    }

    private void Update()
    {
        if (CurrentState == GameState.Playing)
        {
            UpdateGameTime();
        }
    }

    private void InitializeGame()
    {
        // 게임 초기화
        GameTime = 0f;
        CurrentDay = 1;
        CurrentWeek = 1;
        CurrentMonth = 1;
        CurrentYear = 1;
        TimeScale = 1f;

        // 플레이어 데이터 초기화
        PlayerData = new PlayerData();
    }

    private void UpdateGameTime()
    {
        // 게임 시간 업데이트
        GameTime += Time.deltaTime * TimeScale;

        // 하루가 지났는지 확인 (1일 = 10분 게임 시간)
        if (GameTime >= 600f)
        {
            GameTime = 0f;
            CurrentDay++;
            OnDayChanged?.Invoke();

            // 일주일이 지났는지 확인
            if (CurrentDay > 7)
            {
                CurrentDay = 1;
                CurrentWeek++;
                OnWeekChanged?.Invoke();

                // 한 달이 지났는지 확인 (4주 = 1달)
                if (CurrentWeek > 4)
                {
                    CurrentWeek = 1;
                    CurrentMonth++;
                    OnMonthChanged?.Invoke();

                    // 일 년이 지났는지 확인 (12달 = 1년)
                    if (CurrentMonth > 12)
                    {
                        CurrentMonth = 1;
                        CurrentYear++;
                        OnYearChanged?.Invoke();
                    }
                }
            }
        }
    }

    public void SetGameState(GameState newState)
    {
        CurrentState = newState;
        OnGameStateChanged?.Invoke(newState);

        // 게임 상태에 따른 처리
        switch (newState)
        {
            case GameState.Playing:
                Time.timeScale = TimeScale;
                break;
            case GameState.Paused:
                Time.timeScale = 0f;
                break;
            case GameState.MainMenu:
                Time.timeScale = 0f;
                break;
        }
    }

    public void SetTimeScale(float scale)
    {
        TimeScale = Mathf.Clamp(scale, 0.5f, 3f);
        if (CurrentState == GameState.Playing)
        {
            Time.timeScale = TimeScale;
        }
    }

    public void StartNewGame()
    {
        InitializeGame();
        SetGameState(GameState.Playing);
    }

    public void SaveGame()
    {
        // 게임 저장 기능 구현
        Debug.Log("게임 저장됨");
    }

    public void LoadGame()
    {
        // 게임 불러오기 기능 구현
        Debug.Log("게임 불러옴");
    }
}

// 플레이어 데이터 클래스
[System.Serializable]
public class PlayerData
{
    public string StudioName = "새 스튜디오";
    public float Money = 10000f;
    public float Reputation = 0f;
    public int EmployeeCount = 1;
    public List<GameProject> CompletedGames = new List<GameProject>();
    public GameProject CurrentProject = null;

    // 플레이어 스킬 및 능력치
    public Dictionary<string, float> Skills = new Dictionary<string, float>()
    {
        { "Programming", 50f },
        { "Art", 50f },
        { "Design", 50f },
        { "Sound", 50f },
        { "Marketing", 50f },
        { "Management", 50f }
    };
}

// 게임 프로젝트 클래스
[System.Serializable]
public class GameProject
{
    public string Title;
    public string Genre;
    public string Platform;
    public float Budget;
    public float Development;
    public float Quality;
    public float Marketing;
    public float Sales;
    public float Revenue;
    public bool IsReleased;
    public int ReleaseYear;
    public int ReleaseMonth;

    public GameProject(string title, string genre, string platform)
    {
        Title = title;
        Genre = genre;
        Platform = platform;
        Budget = 0f;
        Development = 0f;
        Quality = 0f;
        Marketing = 0f;
        Sales = 0f;
        Revenue = 0f;
        IsReleased = false;
        ReleaseYear = GameManager.Instance.CurrentYear;
        ReleaseMonth = GameManager.Instance.CurrentMonth;
    }
}