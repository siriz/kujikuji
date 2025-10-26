/**
 * KUJIKUJI - Utility Functions
 * 공통으로 사용되는 유틸리티 함수 모음
 */

// ===== 배치 설정 상수 =====
const POSITION_CONFIG = {
    // 그리드 배치 설정
    CELL_SIZE: 6,                // 각 셀의 크기 (캐릭터당 할당된 공간)
    RANDOM_OFFSET_RANGE: 2,      // 셀 내부에서 랜덤 오프셋 범위 (±2)
    RANDOM_ROTATION_RANGE: 90,   // 회전 랜덤 범위 (±30도)
    GRID_COLUMNS: 0,             // 열 개수 (0이면 자동 계산)
    MIN_DISTANCE: 8,             // 최소 거리 (충돌 검사용)
    MAX_ATTEMPTS: 50             // 최대 배치 시도 횟수
};

const Utils = {
    /**
     * 배열을 랜덤하게 섞기 (Fisher-Yates)
     * @param {Array} array 섞을 배열
     * @returns {Array} 섞인 배열
     */
    shuffle(array) {
        const result = [...array];
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    },

    /**
     * 배열에서 랜덤 요소 선택
     * @param {Array} array 배열
     * @returns {*} 랜덤 요소
     */
    randomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    },

    /**
     * 두 점 사이의 거리 계산
     * @param {Object} pos1 {x, z}
     * @param {Object} pos2 {x, z}
     * @returns {number} 거리
     */
    distance(pos1, pos2) {
        const dx = pos1.x - pos2.x;
        const dz = pos1.z - pos2.z;
        return Math.sqrt(dx * dx + dz * dz);
    },

    /**
     * 충돌 검사
     * @param {Object} newPos 새 위치 {x, z}
     * @param {Array} existingPositions 기존 위치 배열
     * @param {number} minDistance 최소 거리
     * @returns {boolean} 충돌 여부
     */
    checkCollision(newPos, existingPositions, minDistance) {
        for (let pos of existingPositions) {
            if (this.distance(newPos, pos) < minDistance) {
                return true;
            }
        }
        return false;
    },

    /**
     * 원형 배치 위치 계산
     * @param {number} index 인덱스
     * @param {number} total 전체 개수
     * @param {number} radius 반지름
     * @param {number} layer 레이어 번호
     * @returns {Object} {x, z} 위치
     */
    circularPosition(index, total, radius, layer = 0) {
        const angle = (Math.PI * 2 * index) / total;
        const layerRadius = radius + (layer * 5);
        
        return {
            x: Math.cos(angle) * layerRadius,
            z: Math.sin(angle) * layerRadius
        };
    },

    /**
     * 나선형 배치 위치 계산
     * @param {number} index 인덱스
     * @param {number} spacing 간격
     * @returns {Object} {x, z, rotation} 위치와 회전
     */
    spiralPosition(index, spacing = 3) {
        const angle = index * 0.5; // 각도 증가율
        const radius = spacing * Math.sqrt(index);
        
        return {
            x: Math.cos(angle) * radius,
            z: Math.sin(angle) * radius,
            rotation: (angle * 180 / Math.PI) % 360
        };
    },

    /**
     * 격자 배치 위치 계산
     * @param {number} index 인덱스
     * @param {number} columns 열 개수
     * @param {number} spacing 간격
     * @returns {Object} {x, z} 위치
     */
    gridPosition(index, columns, spacing = 3) {
        const row = Math.floor(index / columns);
        const col = index % columns;
        
        // 중앙 정렬을 위한 오프셋
        const offsetX = -(columns - 1) * spacing / 2;
        const offsetZ = -(Math.ceil(columns / columns) - 1) * spacing / 2;
        
        return {
            x: col * spacing + offsetX,
            z: row * spacing + offsetZ
        };
    },

    /**
     * 나선형 그리드 배치 (중심에서 바깥으로 - 울람 나선 스타일)
     * 각 캐릭터는 지정된 셀 안에서 랜덤 배치
     * @param {number} count 캐릭터 수
     * @param {number} minDistance 최소 거리
     * @param {number} maxAttempts 최대 시도 횟수
     * @returns {Array<Object>} 위치 배열 [{x, z, rotation}]
     */
    generatePositions(count, minDistance = POSITION_CONFIG.MIN_DISTANCE, maxAttempts = POSITION_CONFIG.MAX_ATTEMPTS) {
        const positions = [];
        
        // 나선형 좌표 생성 (중심에서 바깥으로)
        const spiralCoords = this.generateSpiralCoordinates(count);

        for (let i = 0; i < count; i++) {
            const {col, row} = spiralCoords[i];
            
            let placed = false;
            let attempts = 0;

            while (!placed && attempts < maxAttempts) {
                // 셀의 중심 위치 계산
                const cellCenterX = col * POSITION_CONFIG.CELL_SIZE;
                const cellCenterZ = row * POSITION_CONFIG.CELL_SIZE;
                
                // 셀 내부에서 랜덤 오프셋 적용
                const randomX = (Math.random() - 0.5) * POSITION_CONFIG.RANDOM_OFFSET_RANGE * 2;
                const randomZ = (Math.random() - 0.5) * POSITION_CONFIG.RANDOM_OFFSET_RANGE * 2;
                
                const pos = {
                    x: cellCenterX + randomX,
                    z: cellCenterZ + randomZ
                };

                // 충돌 검사
                if (!this.checkCollision(pos, positions, minDistance)) {
                    // 중앙을 향하도록 기본 회전 + 랜덤 회전
                    const baseRotation = Math.atan2(pos.x, pos.z) * (180 / Math.PI);
                    const randomRotation = (Math.random() - 0.5) * POSITION_CONFIG.RANDOM_ROTATION_RANGE * 2;
                    
                    positions.push({
                        x: pos.x,
                        z: pos.z,
                        rotation: baseRotation + randomRotation
                    });
                    
                    placed = true;
                }

                attempts++;
            }

            // 최대 시도 횟수 초과 시 셀 중앙에 강제 배치
            if (!placed) {
                const cellCenterX = col * POSITION_CONFIG.CELL_SIZE;
                const cellCenterZ = row * POSITION_CONFIG.CELL_SIZE;
                
                positions.push({
                    x: cellCenterX,
                    z: cellCenterZ,
                    rotation: Math.atan2(cellCenterX, cellCenterZ) * (180 / Math.PI)
                });
                console.warn(`⚠️ 캐릭터 ${i} 강제 배치 (셀 중앙)`);
            }
        }

        console.log(`✅ 나선형 그리드 배치 완료: ${count}개 캐릭터`);
        return positions;
    },

    /**
     * 울람 나선 좌표 생성 (중심에서 바깥으로)
     * 0: (0,0) → 1: (1,0) → 2: (1,1) → 3: (0,1) → 4: (-1,1) → 5: (-1,0) → ...
     * @param {number} count 필요한 좌표 개수
     * @returns {Array<Object>} [{col, row}, ...]
     */
    generateSpiralCoordinates(count) {
        const coords = [];
        let x = 0, z = 0;
        let dx = 0, dz = -1; // 시작 방향: 아래
        
        for (let i = 0; i < count; i++) {
            coords.push({col: x, row: z});
            
            // 방향 전환 판단 (나선의 모서리)
            if (x === z || (x < 0 && x === -z) || (x > 0 && x === 1 - z)) {
                const temp = dx;
                dx = -dz;
                dz = temp;
            }
            
            x += dx;
            z += dz;
        }
        
        return coords;
    },

    /**
     * 디바운스 함수
     * @param {Function} func 실행할 함수
     * @param {number} wait 대기 시간 (ms)
     * @returns {Function} 디바운스된 함수
     */
    debounce(func, wait = 300) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * 쓰로틀 함수
     * @param {Function} func 실행할 함수
     * @param {number} limit 제한 시간 (ms)
     * @returns {Function} 쓰로틀된 함수
     */
    throttle(func, limit = 300) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * 숫자를 특정 범위로 제한
     * @param {number} value 값
     * @param {number} min 최소값
     * @param {number} max 최대값
     * @returns {number} 제한된 값
     */
    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    },

    /**
     * 선형 보간
     * @param {number} start 시작값
     * @param {number} end 끝값
     * @param {number} t 보간 계수 (0~1)
     * @returns {number} 보간된 값
     */
    lerp(start, end, t) {
        return start + (end - start) * t;
    },

    /**
     * 날짜를 포맷팅
     * @param {string|Date} date 날짜
     * @param {string} format 포맷 (기본: 'YYYY-MM-DD HH:mm:ss')
     * @returns {string} 포맷된 날짜 문자열
     */
    formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        const seconds = String(d.getSeconds()).padStart(2, '0');

        return format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day)
            .replace('HH', hours)
            .replace('mm', minutes)
            .replace('ss', seconds);
    },

    /**
     * 모바일 기기 감지
     * @returns {boolean} 모바일 여부
     */
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },

    /**
     * 터치 지원 여부 감지
     * @returns {boolean} 터치 지원 여부
     */
    isTouchDevice() {
        return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    },

    /**
     * WebGL 지원 여부 확인
     * @returns {boolean} WebGL 지원 여부
     */
    isWebGLSupported() {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && 
                (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    },

    /**
     * 로컬스토리지 사용 가능 여부 확인
     * @returns {boolean} 사용 가능 여부
     */
    isLocalStorageAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    },

    /**
     * 파일 다운로드
     * @param {string} content 파일 내용
     * @param {string} filename 파일명
     * @param {string} mimeType MIME 타입
     */
    downloadFile(content, filename, mimeType = 'application/json') {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    },

    /**
     * 색상을 hex에서 rgb로 변환
     * @param {string} hex hex 색상 (#RRGGBB)
     * @returns {Object} {r, g, b}
     */
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    },

    /**
     * 랜덤 색상 생성
     * @returns {string} hex 색상
     */
    randomColor() {
        return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    }
};

// ES6 모듈로 내보내기
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}
