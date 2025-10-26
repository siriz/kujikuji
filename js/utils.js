/**
 * KUJIKUJI - Utility Functions
 * 공통으로 사용되는 유틸리티 함수 모음
 */

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
     * 중심에서 멀어지는 순서로 위치 생성 (겹침 방지)
     * @param {number} count 캐릭터 수
     * @param {number} minDistance 최소 거리
     * @param {number} maxAttempts 최대 시도 횟수
     * @returns {Array<Object>} 위치 배열 [{x, z, rotation}]
     */
    generatePositions(count, minDistance = 3, maxAttempts = 50) {
        const positions = [];
        let currentLayer = 0;
        let itemsInLayer = 8; // 첫 번째 레이어의 아이템 수
        let currentIndex = 0;

        for (let i = 0; i < count; i++) {
            let placed = false;
            let attempts = 0;

            while (!placed && attempts < maxAttempts) {
                // 현재 레이어의 위치 계산
                const layerIndex = currentIndex % itemsInLayer;
                const pos = this.circularPosition(
                    layerIndex,
                    itemsInLayer,
                    5, // 기본 반지름
                    currentLayer
                );

                // 약간의 랜덤성 추가
                pos.x += (Math.random() - 0.5) * 1;
                pos.z += (Math.random() - 0.5) * 1;

                // 충돌 검사
                if (!this.checkCollision(pos, positions, minDistance)) {
                    // 중앙을 향하도록 회전 각도 계산
                    const rotation = Math.atan2(pos.x, pos.z) * (180 / Math.PI);
                    
                    positions.push({
                        x: pos.x,
                        z: pos.z,
                        rotation: rotation + (Math.random() - 0.5) * 30 // 약간의 랜덤 회전
                    });
                    
                    placed = true;
                    currentIndex++;

                    // 레이어가 가득 차면 다음 레이어로
                    if (currentIndex >= itemsInLayer) {
                        currentLayer++;
                        itemsInLayer = Math.ceil(itemsInLayer * 1.5); // 각 레이어마다 증가
                        currentIndex = 0;
                    }
                }

                attempts++;
            }

            // 최대 시도 횟수 초과 시 강제 배치
            if (!placed) {
                const fallbackPos = this.spiralPosition(i, minDistance);
                positions.push(fallbackPos);
                console.warn(`⚠️ 캐릭터 ${i} 강제 배치`);
            }
        }

        return positions;
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
