/**
 * 2D 환경 관리 클래스
 */

class TwoDManager {
    constructor() {
        this.container = null;
        this.employees = [];
        this.selectedEmployee = null;
        
        this.init();
    }
    
    init() {
        // 컨테이너 요소 가져오기
        this.container = document.getElementById('game-canvas');
        
        // 2D 캔버스로 스타일 변경
        this.container.style.backgroundImage = 'url("img/office_background.png")';
        this.container.style.backgroundSize = 'cover';
        this.container.style.backgroundPosition = 'center';
        this.container.style.pointerEvents = 'none'; // UI 요소와의 상호작용을 방해하지 않도록 설정
        this.container.style.zIndex = '-1'; // UI 요소보다 낮은 z-index 설정
        
        // 이벤트 리스너 추가
        window.addEventListener('resize', this.onWindowResize.bind(this));
        // 게임 캔버스 클릭 이벤트는 pointer-events: none으로 인해 작동하지 않으므로 제거
        // this.container.addEventListener('click', this.onMouseClick.bind(this));
        
        console.log('2D 환경 초기화 완료');
    }
    
    onWindowResize() {
        // 창 크기 변경 시 처리
        console.log('창 크기 변경됨');
    }
    
    onMouseClick(event) {
        // 클릭 위치 계산
        const rect = this.container.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // 직원 선택 확인
        const clickedEmployee = this.employees.find(emp => {
            const empRect = emp.element.getBoundingClientRect();
            return (
                x >= (empRect.left - rect.left) &&
                x <= (empRect.right - rect.left) &&
                y >= (empRect.top - rect.top) &&
                y <= (empRect.bottom - rect.top)
            );
        });
        
        if (clickedEmployee) {
            this.selectEmployee(clickedEmployee);
        } else {
            this.deselectEmployee();
        }
    }
    
    selectEmployee(employee) {
        // 이전 선택 해제
        if (this.selectedEmployee) {
            this.selectedEmployee.element.classList.remove('selected');
        }
        
        // 새 직원 선택
        this.selectedEmployee = employee;
        employee.element.classList.add('selected');
        
        // 직원 선택 이벤트 발생
        const event = new CustomEvent('employeeSelected', {
            detail: { id: employee.userData.id }
        });
        document.dispatchEvent(event);
    }
    
    deselectEmployee() {
        if (this.selectedEmployee) {
            this.selectedEmployee.element.classList.remove('selected');
            this.selectedEmployee = null;
        }
    }
    
    addEmployee(position) {
        // 직원 요소 생성
        const employeeElement = document.createElement('div');
        employeeElement.className = 'employee-sprite';
        employeeElement.style.left = `${position.x + 50}%`;
        employeeElement.style.top = `${position.y + 50}%`;
        
        // 랜덤 아바타 선택
        const avatarIndex = Math.floor(Math.random() * 8) + 1;
        employeeElement.style.backgroundImage = `url("img/employee_${avatarIndex}.png")`;
        
        // 컨테이너에 추가
        this.container.appendChild(employeeElement);
        
        // 직원 객체 생성
        const employee = {
            element: employeeElement,
            userData: {
                id: this.employees.length + 1,
                position: position
            }
        };
        
        // 직원 목록에 추가
        this.employees.push(employee);
        
        return employee;
    }
    
    removeEmployee(id) {
        const employee = this.employees.find(emp => emp.userData.id === id);
        if (employee) {
            this.container.removeChild(employee.element);
            this.employees = this.employees.filter(emp => emp.userData.id !== id);
        }
    }
    
    upgradeOffice(level) {
        // 레벨에 따라 배경 이미지 변경
        this.container.style.backgroundImage = `url("img/office_level_${level}.png")`;
    }
    
    // 애니메이션이나 업데이트가 필요한 경우 사용
    update() {
        // 필요한 업데이트 로직
    }
}