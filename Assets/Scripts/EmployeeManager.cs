using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

public class EmployeeManager : MonoBehaviour
{
    // 싱글톤 패턴 구현
    public static EmployeeManager Instance { get; private set; }

    // 직원 목록
    public List<Employee> Employees { get; private set; } = new List<Employee>();
    
    // 사용 가능한 직원 목록 (고용 가능한 후보자)
    public List<Employee> AvailableCandidates { get; private set; } = new List<Employee>();
    
    // 최대 직원 수
    public int MaxEmployees { get; private set; } = 5;
    
    // 이벤트
    public event Action<Employee> OnEmployeeHired;
    public event Action<Employee> OnEmployeeFired;
    public event Action<Employee> OnEmployeeSkillImproved;
    public event Action OnCandidatesRefreshed;
    
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
        GameManager.Instance.OnWeekChanged += OnWeekChanged;
        
        // 초기 후보자 생성
        GenerateCandidates();
    }
    
    private void OnDestroy()
    {
        // 이벤트 구독 해제
        if (GameManager.Instance != null)
        {
            GameManager.Instance.OnWeekChanged -= OnWeekChanged;
        }
    }
    
    private void OnWeekChanged()
    {
        // 매주 직원 관리 업데이트
        PaySalaries();
        ImproveEmployeeSkills();
        
        // 2주마다 새로운 후보자 생성
        if (GameManager.Instance.CurrentWeek % 2 == 0)
        {
            GenerateCandidates();
        }
    }
    
    private void PaySalaries()
    {
        // 직원 급여 지급
        float totalSalary = 0f;
        
        foreach (Employee employee in Employees)
        {
            totalSalary += employee.Salary;
        }
        
        GameManager.Instance.PlayerData.Money -= totalSalary;
        
        // 자금 부족 시 직원 불만족도 증가
        if (GameManager.Instance.PlayerData.Money < 0)
        {
            foreach (Employee employee in Employees)
            {
                employee.Satisfaction -= 10f;
                
                // 만족도가 너무 낮으면 직원이 퇴사
                if (employee.Satisfaction <= 0)
                {
                    FireEmployee(employee);
                }
            }
        }
    }
    
    private void ImproveEmployeeSkills()
    {
        // 직원 스킬 향상
        foreach (Employee employee in Employees)
        {
            // 주요 스킬 향상
            float mainSkillImprovement = UnityEngine.Random.Range(0.1f, 0.5f);
            employee.Skills[employee.MainSkill] += mainSkillImprovement;
            
            // 다른 스킬도 약간 향상
            foreach (var skill in employee.Skills)
            {
                if (skill.Key != employee.MainSkill)
                {
                    float otherSkillImprovement = UnityEngine.Random.Range(0.05f, 0.2f);
                    employee.Skills[skill.Key] += otherSkillImprovement;
                }
            }
            
            // 스킬 최대값 제한
            foreach (var skill in employee.Skills.Keys.ToArray())
            {
                employee.Skills[skill] = Mathf.Min(employee.Skills[skill], 100f);
            }
            
            // 이벤트 발생
            OnEmployeeSkillImproved?.Invoke(employee);
        }
    }
    
    private void GenerateCandidates()
    {
        // 새로운 후보자 생성
        AvailableCandidates.Clear();
        
        int candidateCount = UnityEngine.Random.Range(3, 6);
        
        for (int i = 0; i < candidateCount; i++)
        {
            Employee candidate = GenerateRandomEmployee();
            AvailableCandidates.Add(candidate);
        }
        
        // 이벤트 발생
        OnCandidatesRefreshed?.Invoke();
    }
    
    private Employee GenerateRandomEmployee()
    {
        // 랜덤 직원 생성
        string[] firstNames = { "김", "이", "박", "최", "정", "강", "조", "윤", "장", "임" };
        string[] lastNames = { "민준", "서준", "예준", "도윤", "시우", "주원", "하준", "지호", "준서", "준우", 
                              "서연", "서윤", "지우", "서현", "민서", "하은", "하윤", "윤서", "지민", "채원" };
        
        string firstName = firstNames[UnityEngine.Random.Range(0, firstNames.Length)];
        string lastName = lastNames[UnityEngine.Random.Range(0, lastNames.Length)];
        string fullName = firstName + lastName;
        
        // 주요 스킬 결정
        string[] skillTypes = { "Programming", "Art", "Design", "Sound", "Marketing", "Management" };
        string mainSkill = skillTypes[UnityEngine.Random.Range(0, skillTypes.Length)];
        
        // 스킬 초기화
        Dictionary<string, float> skills = new Dictionary<string, float>();
        foreach (string skill in skillTypes)
        {
            if (skill == mainSkill)
            {
                // 주요 스킬은 더 높은 값
                skills[skill] = UnityEngine.Random.Range(40f, 70f);
            }
            else
            {
                // 다른 스킬은 낮은 값
                skills[skill] = UnityEngine.Random.Range(10f, 40f);
            }
        }
        
        // 경력에 따른 급여 결정
        int experience = UnityEngine.Random.Range(0, 10);
        float baseSalary = 1000f;
        float experienceMultiplier = 1f + (experience * 0.2f);
        float skillMultiplier = skills[mainSkill] / 50f;
        
        float salary = baseSalary * experienceMultiplier * skillMultiplier;
        
        // 새 직원 생성
        return new Employee(fullName, mainSkill, skills, salary, experience);
    }
    
    public bool HireEmployee(Employee employee)
    {
        // 직원 고용
        if (Employees.Count >= MaxEmployees)
        {
            Debug.LogWarning("Maximum employee limit reached!");
            return false;
        }
        
        if (GameManager.Instance.PlayerData.Money < employee.Salary)
        {
            Debug.LogWarning("Not enough money to hire employee!");
            return false;
        }
        
        // 후보자 목록에서 제거
        AvailableCandidates.Remove(employee);
        
        // 직원 목록에 추가
        Employees.Add(employee);
        GameManager.Instance.PlayerData.EmployeeCount = Employees.Count;
        
        // 이벤트 발생
        OnEmployeeHired?.Invoke(employee);
        
        return true;
    }
    
    public void FireEmployee(Employee employee)
    {
        // 직원 해고
        if (!Employees.Contains(employee))
        {
            Debug.LogWarning("Employee not found!");
            return;
        }
        
        // 해고 비용 (한 달 급여의 2배)
        float severancePay = employee.Salary * 2f;
        GameManager.Instance.PlayerData.Money -= severancePay;
        
        // 직원 목록에서 제거
        Employees.Remove(employee);
        GameManager.Instance.PlayerData.EmployeeCount = Employees.Count;
        
        // 이벤트 발생
        OnEmployeeFired?.Invoke(employee);
    }
    
    public void TrainEmployee(Employee employee, string skillToImprove, float trainingCost)
    {
        // 직원 교육
        if (!Employees.Contains(employee))
        {
            Debug.LogWarning("Employee not found!");
            return;
        }
        
        if (GameManager.Instance.PlayerData.Money < trainingCost)
        {
            Debug.LogWarning("Not enough money for training!");
            return;
        }
        
        // 교육 비용 지불
        GameManager.Instance.PlayerData.Money -= trainingCost;
        
        // 스킬 향상
        float improvementAmount = trainingCost / 1000f * 5f; // 1000당 5포인트 향상
        employee.Skills[skillToImprove] += improvementAmount;
        
        // 최대값 제한
        employee.Skills[skillToImprove] = Mathf.Min(employee.Skills[skillToImprove], 100f);
        
        // 만족도 향상
        employee.Satisfaction += 5f;
        employee.Satisfaction = Mathf.Min(employee.Satisfaction, 100f);
        
        // 이벤트 발생
        OnEmployeeSkillImproved?.Invoke(employee);
    }
    
    public void UpgradeOffice()
    {
        // 사무실 업그레이드로 최대 직원 수 증가
        float upgradeCost = 10000f * (MaxEmployees - 4);
        
        if (GameManager.Instance.PlayerData.Money < upgradeCost)
        {
            Debug.LogWarning("Not enough money to upgrade office!");
            return;
        }
        
        GameManager.Instance.PlayerData.Money -= upgradeCost;
        MaxEmployees += 1;
        
        // 모든 직원의 만족도 향상
        foreach (Employee employee in Employees)
        {
            employee.Satisfaction += 10f;
            employee.Satisfaction = Mathf.Min(employee.Satisfaction, 100f);
        }
    }
}

// 직원 클래스
[System.Serializable]
public class Employee
{
    public string Name;
    public string MainSkill;
    public Dictionary<string, float> Skills;
    public float Salary;
    public int Experience;
    public float Satisfaction;
    
    public Employee(string name, string mainSkill, Dictionary<string, float> skills, float salary, int experience)
    {
        Name = name;
        MainSkill = mainSkill;
        Skills = skills;
        Salary = salary;
        Experience = experience;
        Satisfaction = 100f; // 초기 만족도는 100%
    }
}