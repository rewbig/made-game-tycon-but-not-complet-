/**
 * Three.js 설정 및 3D 환경 관리
 */

class ThreeJSManager {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.office = null;
        this.employees = [];
        this.lights = [];
        this.animationMixers = [];
        this.clock = new THREE.Clock();
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.selectedObject = null;
        
        this.init();
    }
    
    init() {
        // 컨테이너 요소 가져오기
        this.container = document.getElementById('game-canvas');
        
        // 씬 생성
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a1a);
        
        // 카메라 설정
        this.setupCamera();
        
        // 렌더러 설정
        this.setupRenderer();
        
        // 조명 설정
        this.setupLights();
        
        // 기본 오피스 생성
        this.createOffice();
        
        // 이벤트 리스너 추가
        window.addEventListener('resize', this.onWindowResize.bind(this));
        this.container.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.container.addEventListener('click', this.onMouseClick.bind(this));
        
        // 애니메이션 루프 시작
        this.animate();
    }
    
    setupCamera() {
        // 원근 카메라 생성
        const aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
        this.camera.position.set(10, 10, 10);
        this.camera.lookAt(0, 0, 0);
    }
    
    setupRenderer() {
        // WebGL 렌더러 생성 - 성능 최적화
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: false, // 안티앨리어싱 비활성화로 성능 향상
            powerPreference: 'high-performance' // 고성능 모드 설정
        });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // 픽셀 비율 제한으로 성능 향상
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowMap; // 더 가벼운 그림자 맵 타입으로 변경
        this.container.appendChild(this.renderer.domElement);
    }
    
    setupLights() {
        // 주변광 추가 - 밝기 증가로 다른 조명 효과 감소
        const ambientLight = new THREE.AmbientLight(0x606060, 1.2);
        this.scene.add(ambientLight);
        this.lights.push(ambientLight);
        
        // 방향성 조명 추가 (태양광) - 그림자 맵 크기 감소로 성능 향상
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
        directionalLight.position.set(10, 20, 10);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 1024; // 그림자 해상도 감소
        directionalLight.shadow.mapSize.height = 1024; // 그림자 해상도 감소
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.left = -20;
        directionalLight.shadow.camera.right = 20;
        directionalLight.shadow.camera.top = 20;
        directionalLight.shadow.camera.bottom = -20;
        directionalLight.shadow.bias = -0.001; // 그림자 아티팩트 감소
        this.scene.add(directionalLight);
        this.lights.push(directionalLight);
        
        // 포인트 조명 추가 (실내 조명) - 그림자 비활성화로 성능 향상
        const pointLight = new THREE.PointLight(0xffffcc, 0.6, 20);
        pointLight.position.set(0, 5, 0);
        pointLight.castShadow = false; // 그림자 비활성화로 성능 향상
        this.scene.add(pointLight);
        this.lights.push(pointLight);
    }
    
    createOffice() {
        // 바닥 생성 - 더 가벼운 MeshLambertMaterial 사용
        const floorGeometry = new THREE.PlaneGeometry(20, 20);
        const floorMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x808080
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        this.scene.add(floor);
        
        // 벽 생성 - 더 가벼운 MeshLambertMaterial 사용
        const wallMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xaaaaaa
        });
        
        // 벽 지오메트리 재사용으로 메모리 절약
        const wallGeometry = new THREE.PlaneGeometry(20, 10);
        
        // 뒷벽
        const backWall = new THREE.Mesh(wallGeometry, wallMaterial);
        backWall.position.z = -10;
        backWall.position.y = 5;
        backWall.receiveShadow = true;
        this.scene.add(backWall);
        
        // 왼쪽 벽
        const leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
        leftWall.position.x = -10;
        leftWall.position.y = 5;
        leftWall.rotation.y = Math.PI / 2;
        leftWall.receiveShadow = true;
        this.scene.add(leftWall);
        
        // 오른쪽 벽
        const rightWall = new THREE.Mesh(wallGeometry, wallMaterial);
        rightWall.position.x = 10;
        rightWall.position.y = 5;
        rightWall.rotation.y = -Math.PI / 2;
        rightWall.receiveShadow = true;
        this.scene.add(rightWall);
        
        // 책상과 컴퓨터 생성 - 인스턴스 재사용으로 성능 향상
        const deskPositions = [
            { x: 0, y: 0, z: 0 },
            { x: -5, y: 0, z: -5 },
            { x: 5, y: 0, z: -5 }
        ];
        
        // 책상과 컴퓨터 생성 - 한 번에 처리하여 함수 호출 줄임
        for (const pos of deskPositions) {
            this.createDesk(pos.x, pos.y, pos.z);
            this.createComputer(pos.x, pos.y + 0.75, pos.z);
        }
    }
    
    // 책상 지오메트리와 재질을 클래스 변수로 선언하여 재사용
    static deskTopGeometry = null;
    static deskLegGeometry = null;
    static deskMaterial = null;
    
    createDesk(x, y, z) {
        // 지오메트리와 재질 초기화 (한 번만 생성)
        if (!ThreeJSManager.deskTopGeometry) {
            ThreeJSManager.deskTopGeometry = new THREE.BoxGeometry(2, 0.1, 1.5);
            ThreeJSManager.deskLegGeometry = new THREE.BoxGeometry(0.1, 0.7, 0.1);
            ThreeJSManager.deskMaterial = new THREE.MeshLambertMaterial({ 
                color: 0x8B4513
            });
        }
        
        // 책상 상판
        const deskTop = new THREE.Mesh(ThreeJSManager.deskTopGeometry, ThreeJSManager.deskMaterial);
        deskTop.position.set(x, y + 0.7, z);
        deskTop.castShadow = true;
        deskTop.receiveShadow = true;
        this.scene.add(deskTop);
        
        // 다리 위치 배열
        const legPositions = [
            { x: x - 0.9, y: y + 0.35, z: z - 0.7 },
            { x: x - 0.9, y: y + 0.35, z: z + 0.7 },
            { x: x + 0.9, y: y + 0.35, z: z - 0.7 },
            { x: x + 0.9, y: y + 0.35, z: z + 0.7 }
        ];
        
        // 네 개의 다리 생성 - 반복문으로 코드 간소화
        for (const pos of legPositions) {
            const leg = new THREE.Mesh(ThreeJSManager.deskLegGeometry, ThreeJSManager.deskMaterial);
            leg.position.set(pos.x, pos.y, pos.z);
            leg.castShadow = true;
            this.scene.add(leg);
        }
    }
    
    // 컴퓨터 지오메트리와 재질을 클래스 변수로 선언하여 재사용
    static computerGeometries = null;
    static computerMaterials = null;
    
    createComputer(x, y, z) {
        // 지오메트리와 재질 초기화 (한 번만 생성)
        if (!ThreeJSManager.computerGeometries) {
            // 지오메트리 초기화
            ThreeJSManager.computerGeometries = {
                monitorBase: new THREE.BoxGeometry(0.5, 0.05, 0.3),
                stand: new THREE.BoxGeometry(0.05, 0.3, 0.05),
                screen: new THREE.BoxGeometry(0.8, 0.5, 0.05),
                display: new THREE.PlaneGeometry(0.75, 0.45),
                keyboard: new THREE.BoxGeometry(0.6, 0.05, 0.2),
                mouse: new THREE.BoxGeometry(0.1, 0.03, 0.15)
            };
            
            // 재질 초기화
            ThreeJSManager.computerMaterials = {
                monitor: new THREE.MeshLambertMaterial({ color: 0x333333 }),
                screen: new THREE.MeshLambertMaterial({ color: 0x111111 }),
                display: new THREE.MeshBasicMaterial({ color: 0x4488ff }),
                peripherals: new THREE.MeshLambertMaterial({ color: 0x222222 })
            };
        }
        
        // 컴퓨터 부품 정의
        const parts = [
            // 모니터 베이스
            {
                geometry: ThreeJSManager.computerGeometries.monitorBase,
                material: ThreeJSManager.computerMaterials.monitor,
                position: { x: x, y: y + 0.025, z: z - 0.3 },
                castShadow: true
            },
            // 모니터 스탠드
            {
                geometry: ThreeJSManager.computerGeometries.stand,
                material: ThreeJSManager.computerMaterials.monitor,
                position: { x: x, y: y + 0.15, z: z - 0.3 },
                castShadow: true
            },
            // 모니터 화면
            {
                geometry: ThreeJSManager.computerGeometries.screen,
                material: ThreeJSManager.computerMaterials.screen,
                position: { x: x, y: y + 0.4, z: z - 0.3 },
                castShadow: true
            },
            // 화면 디스플레이
            {
                geometry: ThreeJSManager.computerGeometries.display,
                material: ThreeJSManager.computerMaterials.display,
                position: { x: x, y: y + 0.4, z: z - 0.27 },
                castShadow: false
            },
            // 키보드
            {
                geometry: ThreeJSManager.computerGeometries.keyboard,
                material: ThreeJSManager.computerMaterials.peripherals,
                position: { x: x, y: y + 0.025, z: z },
                castShadow: true
            },
            // 마우스
            {
                geometry: ThreeJSManager.computerGeometries.mouse,
                material: ThreeJSManager.computerMaterials.peripherals,
                position: { x: x + 0.3, y: y + 0.015, z: z },
                castShadow: true
            }
        ];
        
        // 컴퓨터 부품 생성
        for (const part of parts) {
            const mesh = new THREE.Mesh(part.geometry, part.material);
            mesh.position.set(part.position.x, part.position.y, part.position.z);
            if (part.castShadow) mesh.castShadow = true;
            this.scene.add(mesh);
        }
    }
    
    addEmployee(position) {
        // 간단한 직원 캐릭터 생성 (큐브로 대체)
        const employeeGeometry = new THREE.BoxGeometry(0.5, 1.8, 0.5);
        const employeeMaterial = new THREE.MeshStandardMaterial({ 
            color: Math.random() * 0xffffff,
            roughness: 0.7,
            metalness: 0.3
        });
        const employee = new THREE.Mesh(employeeGeometry, employeeMaterial);
        employee.position.copy(position);
        employee.position.y += 0.9; // 바닥 위에 배치
        employee.castShadow = true;
        employee.userData.isEmployee = true;
        employee.userData.id = this.employees.length;
        
        // 머리 추가
        const headGeometry = new THREE.SphereGeometry(0.25, 32, 32);
        const headMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xffdbac,
            roughness: 0.7,
            metalness: 0.3
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 1.0;
        head.castShadow = true;
        employee.add(head);
        
        this.scene.add(employee);
        this.employees.push(employee);
        
        return employee;
    }
    
    removeEmployee(id) {
        const employee = this.employees.find(emp => emp.userData.id === id);
        if (employee) {
            this.scene.remove(employee);
            this.employees = this.employees.filter(emp => emp.userData.id !== id);
        }
    }
    
    upgradeOffice(level) {
        // 현재 오피스 제거 (구현 필요)
        
        // 새 오피스 생성 (구현 필요)
        // 레벨에 따라 더 큰 오피스, 더 많은 책상 등 생성
    }
    
    onWindowResize() {
        // 창 크기 변경 시 카메라와 렌더러 업데이트
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }
    
    onMouseMove(event) {
        // 마우스 위치 정규화 (-1 ~ 1)
        const rect = this.container.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / this.container.clientWidth) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / this.container.clientHeight) * 2 + 1;
        
        // 레이캐스팅으로 마우스 아래 객체 확인
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);
        
        // 커서 스타일 변경
        if (intersects.length > 0) {
            const object = intersects[0].object;
            if (object.userData.isEmployee) {
                this.container.style.cursor = 'pointer';
            } else {
                this.container.style.cursor = 'default';
            }
        } else {
            this.container.style.cursor = 'default';
        }
    }
    
    onMouseClick(event) {
        // 레이캐스팅으로 클릭한 객체 확인
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);
        
        if (intersects.length > 0) {
            const object = intersects[0].object;
            
            // 직원 클릭 시 처리
            if (object.userData.isEmployee) {
                this.selectedObject = object;
                // 직원 정보 표시 이벤트 발생
                const event = new CustomEvent('employeeSelected', { 
                    detail: { id: object.userData.id }
                });
                document.dispatchEvent(event);
            }
        }
    }
    
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        // 애니메이션 업데이트
        const delta = this.clock.getDelta();
        
        // 애니메이션 믹서 업데이트 - 믹서가 있을 때만 실행
        if (this.animationMixers.length > 0) {
            for (const mixer of this.animationMixers) {
                mixer.update(delta);
            }
        }
        
        // 씬 렌더링 - 성능 최적화
        this.renderer.render(this.scene, this.camera);
    }
}

// 게임 시작 시 ThreeJS 매니저 인스턴스 생성
let threeManager;

document.addEventListener('DOMContentLoaded', () => {
    threeManager = new ThreeJSManager();
});