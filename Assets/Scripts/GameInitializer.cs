using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GameInitializer : MonoBehaviour
{
    // 매니저 프리팹
    public GameObject gameManagerPrefab;
    public GameObject projectManagerPrefab;
    public GameObject employeeManagerPrefab;
    public GameObject uiManagerPrefab;
    public GameObject cameraControllerPrefab;
    
    // 3D 오브젝트
    public GameObject officeBuildingPrefab;
    public GameObject environmentPrefab;
    
    private void Awake()
    {
        // 매니저 오브젝트 생성
        CreateManagersIfNeeded();
        
        // 3D 환경 생성
        CreateGameEnvironment();
    }
    
    private void CreateManagersIfNeeded()
    {
        // 게임 매니저 생성
        if (GameManager.Instance == null && gameManagerPrefab != null)
        {
            Instantiate(gameManagerPrefab);
        }
        
        // 프로젝트 매니저 생성
        if (ProjectManager.Instance == null && projectManagerPrefab != null)
        {
            Instantiate(projectManagerPrefab);
        }
        
        // 직원 매니저 생성
        if (EmployeeManager.Instance == null && employeeManagerPrefab != null)
        {
            Instantiate(employeeManagerPrefab);
        }
        
        // UI 매니저 생성
        if (UIManager.Instance == null && uiManagerPrefab != null)
        {
            Instantiate(uiManagerPrefab);
        }
        
        // 카메라 컨트롤러 생성
        if (cameraControllerPrefab != null)
        {
            Instantiate(cameraControllerPrefab);
        }
    }
    
    private void CreateGameEnvironment()
    {
        // 오피스 빌딩 생성
        if (officeBuildingPrefab != null)
        {
            Instantiate(officeBuildingPrefab, Vector3.zero, Quaternion.identity);
        }
        
        // 환경 생성
        if (environmentPrefab != null)
        {
            Instantiate(environmentPrefab, Vector3.zero, Quaternion.identity);
        }
    }
}