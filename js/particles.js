/**
 * KUJIKUJI - Particle Effects
 * Three.js 기반 파티클 효과 시스템
 */

const ParticleEffects = {
    /**
     * 캐릭터 선택 시 파티클 효과 생성
     * @param {THREE.Scene} scene Three.js scene
     * @param {THREE.Vector3} position 파티클 생성 위치
     * @param {Object} options 옵션 설정
     */
    createSelectionEffect(scene, position, options = {}) {
        const defaults = {
            particleCount: 100,
            color: 0xFFD700, // Gold color
            size: 0.1,
            duration: 2,
            spread: 2,
            upwardForce: 3
        };

        const config = { ...defaults, ...options };

        // Create particle geometry
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(config.particleCount * 3);
        const velocities = [];

        for (let i = 0; i < config.particleCount * 3; i += 3) {
            // Initial position (slightly randomized around the character)
            positions[i] = position.x + (Math.random() - 0.5) * config.spread;
            positions[i + 1] = position.y + Math.random() * 0.5;
            positions[i + 2] = position.z + (Math.random() - 0.5) * config.spread;

            // Velocity for each particle
            velocities.push({
                x: (Math.random() - 0.5) * 0.1,
                y: Math.random() * 0.15 + 0.1,
                z: (Math.random() - 0.5) * 0.1
            });
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        // Create particle material
        const material = new THREE.PointsMaterial({
            color: config.color,
            size: config.size,
            transparent: true,
            opacity: 1,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const particles = new THREE.Points(geometry, material);
        scene.add(particles);

        // Animate particles
        let startTime = Date.now();
        const animateParticles = () => {
            const elapsed = (Date.now() - startTime) / 1000;
            const progress = elapsed / config.duration;

            if (progress < 1) {
                const positions = particles.geometry.attributes.position.array;

                for (let i = 0; i < config.particleCount; i++) {
                    const i3 = i * 3;
                    positions[i3] += velocities[i].x;
                    positions[i3 + 1] += velocities[i].y;
                    positions[i3 + 2] += velocities[i].z;

                    // Apply gravity
                    velocities[i].y -= 0.005;
                }

                particles.geometry.attributes.position.needsUpdate = true;
                material.opacity = 1 - progress;

                requestAnimationFrame(animateParticles);
            } else {
                scene.remove(particles);
                geometry.dispose();
                material.dispose();
            }
        };

        animateParticles();

        return particles;
    },

    /**
     * 폭죽 효과
     * @param {THREE.Scene} scene Three.js scene
     * @param {THREE.Vector3} position 폭죽 위치
     * @param {Object} options 옵션
     */
    createFireworkEffect(scene, position, options = {}) {
        const defaults = {
            particleCount: 50,
            colors: [0xFF0000, 0x00FF00, 0x0000FF, 0xFFFF00, 0xFF00FF],
            size: 0.15,
            duration: 1.5,
            explosionForce: 0.3
        };

        const config = { ...defaults, ...options };

        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(config.particleCount * 3);
        const colors = new Float32Array(config.particleCount * 3);
        const velocities = [];

        for (let i = 0; i < config.particleCount; i++) {
            const i3 = i * 3;

            // Start at center
            positions[i3] = position.x;
            positions[i3 + 1] = position.y;
            positions[i3 + 2] = position.z;

            // Random color from palette
            const color = new THREE.Color(config.colors[Math.floor(Math.random() * config.colors.length)]);
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;

            // Explosion velocity (spherical distribution)
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);
            const force = config.explosionForce;

            velocities.push({
                x: Math.sin(phi) * Math.cos(theta) * force,
                y: Math.sin(phi) * Math.sin(theta) * force,
                z: Math.cos(phi) * force
            });
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: config.size,
            transparent: true,
            opacity: 1,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const particles = new THREE.Points(geometry, material);
        scene.add(particles);

        // Animate
        let startTime = Date.now();
        const animate = () => {
            const elapsed = (Date.now() - startTime) / 1000;
            const progress = elapsed / config.duration;

            if (progress < 1) {
                const positions = particles.geometry.attributes.position.array;

                for (let i = 0; i < config.particleCount; i++) {
                    const i3 = i * 3;
                    positions[i3] += velocities[i].x;
                    positions[i3 + 1] += velocities[i].y;
                    positions[i3 + 2] += velocities[i].z;

                    velocities[i].y -= 0.01; // Gravity
                }

                particles.geometry.attributes.position.needsUpdate = true;
                material.opacity = 1 - progress;

                requestAnimationFrame(animate);
            } else {
                scene.remove(particles);
                geometry.dispose();
                material.dispose();
            }
        };

        animate();
    },

    /**
     * 반짝임 효과 (별 모양)
     * @param {THREE.Scene} scene Three.js scene
     * @param {THREE.Vector3} position 위치
     * @param {Object} options 옵션
     */
    createSparkleEffect(scene, position, options = {}) {
        const defaults = {
            particleCount: 30,
            color: 0xFFFFFF,
            size: 0.2,
            duration: 1,
            range: 1.5
        };

        const config = { ...defaults, ...options };

        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(config.particleCount * 3);
        const scales = [];

        for (let i = 0; i < config.particleCount * 3; i += 3) {
            positions[i] = position.x + (Math.random() - 0.5) * config.range;
            positions[i + 1] = position.y + (Math.random() - 0.5) * config.range;
            positions[i + 2] = position.z + (Math.random() - 0.5) * config.range;

            scales.push(Math.random());
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            color: config.color,
            size: config.size,
            transparent: true,
            opacity: 1,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const particles = new THREE.Points(geometry, material);
        scene.add(particles);

        // Pulse animation
        let startTime = Date.now();
        const animate = () => {
            const elapsed = (Date.now() - startTime) / 1000;
            const progress = elapsed / config.duration;

            if (progress < 1) {
                // Pulse effect
                const pulse = Math.sin(progress * Math.PI);
                material.opacity = pulse;
                material.size = config.size * (1 + pulse * 0.5);

                requestAnimationFrame(animate);
            } else {
                scene.remove(particles);
                geometry.dispose();
                material.dispose();
            }
        };

        animate();
    },

    /**
     * 연속 파티클 효과 (여러 효과를 순차적으로 실행)
     * @param {THREE.Scene} scene Three.js scene
     * @param {THREE.Vector3} position 위치
     */
    createCombinedEffect(scene, position) {
        // Selection particles
        this.createSelectionEffect(scene, position, {
            particleCount: 80,
            color: 0xFFD700
        });

        // Delayed sparkle
        setTimeout(() => {
            this.createSparkleEffect(scene, position, {
                particleCount: 40,
                color: 0xFFFFFF
            });
        }, 300);

        // Delayed firework
        setTimeout(() => {
            const fireworkPos = new THREE.Vector3(
                position.x,
                position.y + 2,
                position.z
            );
            this.createFireworkEffect(scene, fireworkPos, {
                particleCount: 60,
                explosionForce: 0.25
            });
        }, 600);
    }
};

// ES6 모듈로 내보내기
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ParticleEffects;
}
