/**
 * KUJIKUJI - Storage Manager
 * localStorage 기반 데이터 관리 모듈
 */

const StorageManager = {
    // Storage 키 상수
    STORAGE_KEY: 'kujikuji',
    SETTINGS_KEY: 'kujikuji-settings',

    /**
     * 기본 데이터 구조 반환
     * @returns {Object} 기본 데이터 구조
     */
    getDefaultData() {
        return {
            characters: [],
            selectedCharacters: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
    },

    /**
     * localStorage에서 데이터 불러오기
     * @returns {Object} 저장된 데이터 또는 기본 데이터
     */
    loadData() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            if (data) {
                const parsed = JSON.parse(data);
                console.log('✅ 데이터 로드 성공:', parsed);
                return parsed;
            }
        } catch (error) {
            console.error('❌ 데이터 로드 실패:', error);
        }
        return this.getDefaultData();
    },

    /**
     * localStorage에 데이터 저장
     * @param {Object} data 저장할 데이터
     * @returns {boolean} 저장 성공 여부
     */
    saveData(data) {
        try {
            data.updatedAt = new Date().toISOString();
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
            console.log('✅ 데이터 저장 성공:', data);
            return true;
        } catch (error) {
            console.error('❌ 데이터 저장 실패:', error);
            return false;
        }
    },

    /**
     * 캐릭터 추가
     * @param {string} name 캐릭터 이름
     * @param {string} avatarSeed 아바타 시드 (선택)
     * @returns {Object} 추가된 캐릭터 객체
     */
    addCharacter(name, avatarSeed = null) {
        const data = this.loadData();
        
        const character = {
            id: this.generateId(),
            name: name.trim(),
            avatarSeed: avatarSeed || this.generateSeed(),
            selected: false,
            selectedAt: null,
            createdAt: new Date().toISOString()
        };

        data.characters.push(character);
        this.saveData(data);
        
        console.log('✅ 캐릭터 추가:', character);
        return character;
    },

    /**
     * 여러 캐릭터 일괄 추가
     * @param {Array<string>} names 캐릭터 이름 배열
     * @returns {Array<Object>} 추가된 캐릭터 배열
     */
    addCharacters(names) {
        const data = this.loadData();
        const characters = [];

        names.forEach(name => {
            if (name && name.trim()) {
                const character = {
                    id: this.generateId(),
                    name: name.trim(),
                    avatarSeed: this.generateSeed(),
                    selected: false,
                    selectedAt: null,
                    createdAt: new Date().toISOString()
                };
                characters.push(character);
                data.characters.push(character);
            }
        });

        this.saveData(data);
        console.log(`✅ ${characters.length}명의 캐릭터 추가 완료`);
        return characters;
    },

    /**
     * 숫자 기반 캐릭터 자동 생성 (기존 데이터 초기화)
     * @param {number} count 생성할 캐릭터 수
     * @returns {Array<Object>} 생성된 캐릭터 배열
     */
    generateCharacters(count) {
        // 기존 데이터 초기화
        this.clearAll();
        
        const names = [];
        for (let i = 1; i <= count; i++) {
            names.push(`User ${i}`);
        }
        return this.addCharacters(names);
    },

    /**
     * 캐릭터 업데이트
     * @param {string} id 캐릭터 ID
     * @param {Object} updates 업데이트할 속성들
     * @returns {Object|null} 업데이트된 캐릭터 또는 null
     */
    updateCharacter(id, updates) {
        const data = this.loadData();
        const character = data.characters.find(c => c.id === id);

        if (character) {
            Object.assign(character, updates);
            this.saveData(data);
            console.log('✅ 캐릭터 업데이트:', character);
            return character;
        }

        console.warn('⚠️ 캐릭터를 찾을 수 없음:', id);
        return null;
    },

    /**
     * 캐릭터 삭제
     * @param {string} id 캐릭터 ID
     * @returns {boolean} 삭제 성공 여부
     */
    deleteCharacter(id) {
        const data = this.loadData();
        const index = data.characters.findIndex(c => c.id === id);

        if (index !== -1) {
            const deleted = data.characters.splice(index, 1)[0];
            this.saveData(data);
            console.log('✅ 캐릭터 삭제:', deleted);
            return true;
        }

        console.warn('⚠️ 캐릭터를 찾을 수 없음:', id);
        return false;
    },

    /**
     * 모든 캐릭터 가져오기
     * @returns {Array<Object>} 캐릭터 배열
     */
    getAllCharacters() {
        const data = this.loadData();
        return data.characters || [];
    },

    /**
     * 선택되지 않은 캐릭터만 가져오기
     * @returns {Array<Object>} 선택되지 않은 캐릭터 배열
     */
    getUnselectedCharacters() {
        const data = this.loadData();
        return data.characters.filter(c => !c.selected);
    },

    /**
     * 선택된 캐릭터만 가져오기
     * @returns {Array<Object>} 선택된 캐릭터 배열
     */
    getSelectedCharacters() {
        const data = this.loadData();
        return data.characters.filter(c => c.selected);
    },

    /**
     * 캐릭터를 선택됨으로 표시
     * @param {string} id 캐릭터 ID
     * @returns {Object|null} 업데이트된 캐릭터
     */
    selectCharacter(id) {
        const data = this.loadData();
        const character = data.characters.find(c => c.id === id);

        if (character && !character.selected) {
            character.selected = true;
            character.selectedAt = new Date().toISOString();
            
            // 선택 순서를 기록
            if (!data.selectedCharacters) {
                data.selectedCharacters = [];
            }
            data.selectedCharacters.push({
                id: character.id,
                name: character.name,
                selectedAt: character.selectedAt
            });

            this.saveData(data);
            console.log('✅ 캐릭터 선택:', character);
            return character;
        }

        return null;
    },

    /**
     * 모든 선택 상태 초기화
     * @param {boolean} keepCharacters 캐릭터 정보 유지 여부
     * @returns {boolean} 초기화 성공 여부
     */
    resetSelections(keepCharacters = true) {
        const data = this.loadData();

        if (keepCharacters) {
            // 캐릭터는 유지하되 선택 상태만 초기화
            data.characters.forEach(c => {
                c.selected = false;
                c.selectedAt = null;
            });
            data.selectedCharacters = [];
        } else {
            // 전체 초기화
            return this.clearAll();
        }

        this.saveData(data);
        console.log('✅ 선택 상태 초기화 완료');
        return true;
    },

    /**
     * 모든 데이터 삭제
     * @returns {boolean} 삭제 성공 여부
     */
    clearAll() {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
            console.log('✅ 모든 데이터 삭제 완료');
            return true;
        } catch (error) {
            console.error('❌ 데이터 삭제 실패:', error);
            return false;
        }
    },

    /**
     * 캐릭터 배열 셔플 (Fisher-Yates 알고리즘)
     * @param {Array} array 셔플할 배열
     * @returns {Array} 셔플된 배열
     */
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },

    /**
     * 고유 ID 생성
     * @returns {string} 고유 ID
     */
    generateId() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    },

    /**
     * 랜덤 시드 생성 (아바타용)
     * @returns {string} 랜덤 시드
     */
    generateSeed() {
        return Math.random().toString(36).substr(2, 9);
    },

    /**
     * DiceBear 아바타 URL 생성
     * @param {string} seed 시드 값
     * @param {string} style 스타일 (기본: bottts-neutral)
     * @returns {string} 아바타 URL
     */
    getAvatarUrl(seed, style = 'bottts-neutral') {
        return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`;
    },

    /**
     * 통계 정보 가져오기
     * @returns {Object} 통계 정보
     */
    getStatistics() {
        const data = this.loadData();
        const total = data.characters.length;
        const selected = data.characters.filter(c => c.selected).length;
        const remaining = total - selected;

        return {
            total,
            selected,
            remaining,
            percentage: total > 0 ? Math.round((selected / total) * 100) : 0,
            isComplete: remaining === 0 && total > 0
        };
    },

    /**
     * 설정 저장
     * @param {Object} settings 설정 객체
     */
    saveSettings(settings) {
        try {
            localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
            console.log('✅ 설정 저장:', settings);
        } catch (error) {
            console.error('❌ 설정 저장 실패:', error);
        }
    },

    /**
     * 설정 불러오기
     * @returns {Object} 설정 객체
     */
    loadSettings() {
        try {
            const settings = localStorage.getItem(this.SETTINGS_KEY);
            return settings ? JSON.parse(settings) : {};
        } catch (error) {
            console.error('❌ 설정 로드 실패:', error);
            return {};
        }
    },

    /**
     * 데이터 내보내기 (JSON)
     * @returns {string} JSON 문자열
     */
    exportData() {
        const data = this.loadData();
        return JSON.stringify(data, null, 2);
    },

    /**
     * 데이터 가져오기 (JSON)
     * @param {string} jsonString JSON 문자열
     * @returns {boolean} 가져오기 성공 여부
     */
    importData(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            this.saveData(data);
            console.log('✅ 데이터 가져오기 성공');
            return true;
        } catch (error) {
            console.error('❌ 데이터 가져오기 실패:', error);
            return false;
        }
    }
};

// ES6 모듈로 내보내기
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StorageManager;
}
