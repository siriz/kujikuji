/**
 * KUJIKUJI - Particle Effects
 * Three.js 기반 시네마틱 파티클 효과 시스템
 */

import * as THREE from 'three';

export const ParticleEffects = {
    /**
     * 시네마틱한 캐릭터 선택 파티클 효과 (빛나는 트레일 + 슬로우 모션)
     * @param {THREE.Scene} scene Three.js scene
     * @param {THREE.Vector3} position 파티클 생성 위치
     * @param {Object} options 옵션 설정
     */
    createSelectionEffect(scene, position, options = {}) {
        const defaults = {
            particleCount: 200,
            colors: [0xFFD700, 0xFFA500, 0xFFFF00, 0xFFE4B5], // Gold gradient
            size: 0.15,
            duration: 3,
            spread: 1.5,
            riseSpeed: 0.08
        };

        const config = { ...defaults, ...options };

        // Create main particle system with color gradient
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(config.particleCount * 3);
        const colors = new Float32Array(config.particleCount * 3);
        const sizes = new Float32Array(config.particleCount);
        const velocities = [];
        const lifetimes = [];

        for (let i = 0; i < config.particleCount; i++) {
            const i3 = i * 3;
            
            // Spawn in a cylinder shape rising from character
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * config.spread;
            const height = Math.random() * 0.5;
            
            positions[i3] = position.x + Math.cos(angle) * radius;
            positions[i3 + 1] = position.y + height;
            positions[i3 + 2] = position.z + Math.sin(angle) * radius;

            // Color gradient (gold to white)
            const colorChoice = config.colors[Math.floor(Math.random() * config.colors.length)];
            const color = new THREE.Color(colorChoice);
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;

            // Size variation
            sizes[i] = Math.random() * config.size * 2 + config.size;

            // Cinematic velocity (spiral upward + outward)
            const spiralForce = 0.02;
            velocities.push({
                x: Math.cos(angle) * spiralForce + (Math.random() - 0.5) * 0.01,
                y: config.riseSpeed + Math.random() * 0.05,
                z: Math.sin(angle) * spiralForce + (Math.random() - 0.5) * 0.01,
                rotationSpeed: (Math.random() - 0.5) * 0.1
            });

            lifetimes.push(Math.random() * 0.3); // Staggered spawn
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        // Cinematic material with glow
        const material = new THREE.PointsMaterial({
            size: config.size,
            transparent: true,
            opacity: 1,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            sizeAttenuation: true,
            map: this.createGlowTexture()
        });

        const particles = new THREE.Points(geometry, material);
        scene.add(particles);

        // Cinematic animation with easing
        let startTime = Date.now();
        const animateParticles = () => {
            const elapsed = (Date.now() - startTime) / 1000;
            const progress = elapsed / config.duration;

            if (progress < 1) {
                const positions = particles.geometry.attributes.position.array;
                const sizesAttr = particles.geometry.attributes.size.array;

                for (let i = 0; i < config.particleCount; i++) {
                    const i3 = i * 3;
                    const lifetime = lifetimes[i];
                    const localProgress = Math.max(0, progress - lifetime);

                    if (localProgress > 0) {
                        // Spiral motion
                        const angle = velocities[i].rotationSpeed * elapsed * 10;
                        positions[i3] += velocities[i].x * Math.cos(angle);
                        positions[i3 + 1] += velocities[i].y;
                        positions[i3 + 2] += velocities[i].z * Math.sin(angle);

                        // Size pulsation
                        const pulse = Math.sin(elapsed * 5 + i * 0.1) * 0.5 + 1;
                        sizesAttr[i] = sizes[i] * pulse * (1 - localProgress * 0.5);
                    }
                }

                particles.geometry.attributes.position.needsUpdate = true;
                particles.geometry.attributes.size.needsUpdate = true;

                // Smooth fade out with easing
                const fadeProgress = Math.pow(progress, 0.5);
                material.opacity = 1 - fadeProgress;

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
     * Create glowing circular texture for particles
     */
    createGlowTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');

        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.2, 'rgba(255,255,255,0.8)');
        gradient.addColorStop(0.4, 'rgba(255,255,255,0.4)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);

        const texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        return texture;
    },

    /**
     * 시네마틱 폭죽 효과 (느린 모션 블러 효과)
     * @param {THREE.Scene} scene Three.js scene
     * @param {THREE.Vector3} position 폭죽 위치
     * @param {Object} options 옵션
     */
    createFireworkEffect(scene, position, options = {}) {
        const defaults = {
            particleCount: 120,
            colors: [0xFF6B6B, 0x4ECDC4, 0xFFE66D, 0xA8E6CF, 0xFF8B94],
            size: 0.2,
            duration: 2.5,
            explosionForce: 0.25,
            trails: true
        };

        const config = { ...defaults, ...options };

        // Main explosion particles
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(config.particleCount * 3);
        const colors = new Float32Array(config.particleCount * 3);
        const sizes = new Float32Array(config.particleCount);
        const velocities = [];
        const trails = [];

        for (let i = 0; i < config.particleCount; i++) {
            const i3 = i * 3;

            // Start at center
            positions[i3] = position.x;
            positions[i3 + 1] = position.y;
            positions[i3 + 2] = position.z;

            // Vibrant color palette
            const colorChoice = config.colors[Math.floor(Math.random() * config.colors.length)];
            const color = new THREE.Color(colorChoice);
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;

            // Size variation
            sizes[i] = Math.random() * config.size + config.size * 0.5;

            // Spherical explosion with varying speeds
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);
            const force = config.explosionForce * (0.5 + Math.random() * 0.5);

            velocities.push({
                x: Math.sin(phi) * Math.cos(theta) * force,
                y: Math.sin(phi) * Math.sin(theta) * force,
                z: Math.cos(phi) * force,
                drag: 0.98 // Air resistance
            });

            // Trail history
            trails.push([]);
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.PointsMaterial({
            size: config.size,
            transparent: true,
            opacity: 1,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            map: this.createGlowTexture()
        });

        const particles = new THREE.Points(geometry, material);
        scene.add(particles);

        // Animate with cinematic timing
        let startTime = Date.now();
        const animate = () => {
            const elapsed = (Date.now() - startTime) / 1000;
            const progress = elapsed / config.duration;

            if (progress < 1) {
                const positions = particles.geometry.attributes.position.array;
                const sizesAttr = particles.geometry.attributes.size.array;

                for (let i = 0; i < config.particleCount; i++) {
                    const i3 = i * 3;

                    // Apply velocity with drag
                    velocities[i].x *= velocities[i].drag;
                    velocities[i].y *= velocities[i].drag;
                    velocities[i].z *= velocities[i].drag;

                    // Gravity
                    velocities[i].y -= 0.008;

                    positions[i3] += velocities[i].x;
                    positions[i3 + 1] += velocities[i].y;
                    positions[i3 + 2] += velocities[i].z;

                    // Dynamic size (expand then shrink)
                    const sizeProgress = progress < 0.3 ? progress / 0.3 : 1 - (progress - 0.3) / 0.7;
                    sizesAttr[i] = sizes[i] * (1 + sizeProgress * 0.5);
                }

                particles.geometry.attributes.position.needsUpdate = true;
                particles.geometry.attributes.size.needsUpdate = true;

                // Smooth opacity fade
                material.opacity = Math.pow(1 - progress, 1.5);

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
     * 시네마틱 스파크/섬광 효과 (렌즈 플레어 스타일)
     * @param {THREE.Scene} scene Three.js scene
     * @param {THREE.Vector3} position 위치
     * @param {Object} options 옵션
     */
    createSparkleEffect(scene, position, options = {}) {
        const defaults = {
            particleCount: 80,
            colors: [0xFFFFFF, 0xFFEEBB, 0xFFDD88],
            size: 0.25,
            duration: 1.8,
            range: 2
        };

        const config = { ...defaults, ...options };

        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(config.particleCount * 3);
        const colors = new Float32Array(config.particleCount * 3);
        const sizes = new Float32Array(config.particleCount);
        const phases = [];

        for (let i = 0; i < config.particleCount; i++) {
            const i3 = i * 3;
            
            // Radial distribution
            const angle = (i / config.particleCount) * Math.PI * 2;
            const distance = Math.random() * config.range;
            
            positions[i3] = position.x + Math.cos(angle) * distance;
            positions[i3 + 1] = position.y + (Math.random() - 0.5) * config.range * 0.5;
            positions[i3 + 2] = position.z + Math.sin(angle) * distance;

            // Warm white to gold gradient
            const colorChoice = config.colors[Math.floor(Math.random() * config.colors.length)];
            const color = new THREE.Color(colorChoice);
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;

            sizes[i] = Math.random() * config.size + config.size * 0.5;
            phases.push(Math.random() * Math.PI * 2);
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.PointsMaterial({
            size: config.size,
            transparent: true,
            opacity: 1,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            map: this.createGlowTexture()
        });

        const particles = new THREE.Points(geometry, material);
        scene.add(particles);

        // Cinematic pulse animation
        let startTime = Date.now();
        const animate = () => {
            const elapsed = (Date.now() - startTime) / 1000;
            const progress = elapsed / config.duration;

            if (progress < 1) {
                const sizesAttr = particles.geometry.attributes.size.array;

                // Multiple pulse waves
                for (let i = 0; i < config.particleCount; i++) {
                    const wave1 = Math.sin(elapsed * 8 + phases[i]);
                    const wave2 = Math.sin(elapsed * 4 + phases[i] * 0.5);
                    const pulse = (wave1 + wave2) * 0.5 + 1;
                    sizesAttr[i] = sizes[i] * pulse * (1 - progress * 0.5);
                }

                particles.geometry.attributes.size.needsUpdate = true;

                // Dramatic fade with double peak
                const fadeProgress = progress < 0.3 ? progress / 0.3 : 1 - (progress - 0.3) / 0.7;
                material.opacity = Math.pow(fadeProgress, 0.8);

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
     * 컨페티 폭죽 효과 - 화면 중앙에서 터지는 색종이
     * @param {THREE.Scene} scene Three.js scene
     * @param {THREE.Vector3} position 폭죽 위치
     * @param {Object} options 옵션
     */
    createConfettiBurst(scene, position, options = {}) {
        const defaults = {
            particleCount: 150,
            colors: [
                0xFF6B9D, 0xC44569, 0xFFA502, 0xFFD32A, 
                0x05C46B, 0x0ABDE3, 0x833471, 0xF8B500
            ],
            duration: 4,
            explosionForce: 0.35,
            gravity: 0.012,
            shapes: ['rect', 'square', 'circle']
        };

        const config = { ...defaults, ...options };
        const confettiPieces = [];

        for (let i = 0; i < config.particleCount; i++) {
            // 각 색종이 조각 생성
            const shape = config.shapes[Math.floor(Math.random() * config.shapes.length)];
            const colorChoice = config.colors[Math.floor(Math.random() * config.colors.length)];
            
            let geometry;
            if (shape === 'rect') {
                geometry = new THREE.PlaneGeometry(0.08, 0.15);
            } else if (shape === 'square') {
                geometry = new THREE.PlaneGeometry(0.12, 0.12);
            } else {
                geometry = new THREE.CircleGeometry(0.08, 8);
            }

            const material = new THREE.MeshBasicMaterial({
                color: colorChoice,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 1
            });

            const confetti = new THREE.Mesh(geometry, material);
            
            // 초기 위치
            confetti.position.copy(position);
            
            // 구형으로 폭발
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);
            const force = config.explosionForce * (0.7 + Math.random() * 0.6);
            
            confetti.userData.velocity = {
                x: Math.sin(phi) * Math.cos(theta) * force,
                y: Math.sin(phi) * Math.sin(theta) * force * 1.2, // 위쪽으로 더 많이
                z: Math.cos(phi) * force
            };
            
            // 회전 속도
            confetti.userData.rotation = {
                x: (Math.random() - 0.5) * 0.15,
                y: (Math.random() - 0.5) * 0.15,
                z: (Math.random() - 0.5) * 0.15
            };
            
            confetti.userData.drag = 0.98;
            
            scene.add(confetti);
            confettiPieces.push(confetti);
        }

        // 애니메이션
        let startTime = Date.now();
        const animate = () => {
            const elapsed = (Date.now() - startTime) / 1000;
            const progress = elapsed / config.duration;

            if (progress < 1) {
                confettiPieces.forEach(confetti => {
                    const vel = confetti.userData.velocity;
                    const rot = confetti.userData.rotation;
                    
                    // 속도 감소 (공기 저항)
                    vel.x *= confetti.userData.drag;
                    vel.y *= confetti.userData.drag;
                    vel.z *= confetti.userData.drag;
                    
                    // 중력
                    vel.y -= config.gravity;
                    
                    // 위치 업데이트
                    confetti.position.x += vel.x;
                    confetti.position.y += vel.y;
                    confetti.position.z += vel.z;
                    
                    // 회전 (하늘하늘 효과)
                    confetti.rotation.x += rot.x;
                    confetti.rotation.y += rot.y;
                    confetti.rotation.z += rot.z;
                    
                    // 페이드 아웃
                    confetti.material.opacity = 1 - Math.pow(progress, 0.8);
                });

                requestAnimationFrame(animate);
            } else {
                // 정리
                confettiPieces.forEach(confetti => {
                    scene.remove(confetti);
                    confetti.geometry.dispose();
                    confetti.material.dispose();
                });
            }
        };

        animate();
    },

    /**
     * 컨페티 레인 효과 - 하늘에서 하늘하늘 떨어지는 색종이
     * @param {THREE.Scene} scene Three.js scene
     * @param {THREE.Camera} camera 카메라
     * @param {Object} options 옵션
     */
    createConfettiRain(scene, camera, options = {}) {
        const defaults = {
            particleCount: 100,
            colors: [
                0xFF6B9D, 0xC44569, 0xFFA502, 0xFFD32A, 
                0x05C46B, 0x0ABDE3, 0x833471, 0xF8B500,
                0xFF3838, 0xFF8C00, 0x00D2FF, 0x7D5FFF
            ],
            duration: 6,
            fallSpeed: 0.02,
            horizontalDrift: 0.015,
            spawnHeight: 8,
            spawnRadius: 6
        };

        const config = { ...defaults, ...options };
        const confettiPieces = [];

        for (let i = 0; i < config.particleCount; i++) {
            const shapes = ['rect', 'square', 'circle'];
            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            const colorChoice = config.colors[Math.floor(Math.random() * config.colors.length)];
            
            let geometry;
            if (shape === 'rect') {
                geometry = new THREE.PlaneGeometry(0.1, 0.18);
            } else if (shape === 'square') {
                geometry = new THREE.PlaneGeometry(0.14, 0.14);
            } else {
                geometry = new THREE.CircleGeometry(0.09, 8);
            }

            const material = new THREE.MeshBasicMaterial({
                color: colorChoice,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 1
            });

            const confetti = new THREE.Mesh(geometry, material);
            
            // 카메라 위쪽 넓은 영역에서 스폰
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * config.spawnRadius;
            
            confetti.position.x = camera.position.x + Math.cos(angle) * radius;
            confetti.position.y = config.spawnHeight + Math.random() * 2;
            confetti.position.z = camera.position.z + Math.sin(angle) * radius;
            
            // 각 조각마다 다른 낙하 속도와 흔들림
            confetti.userData.fallSpeed = config.fallSpeed * (0.6 + Math.random() * 0.8);
            confetti.userData.driftSpeed = {
                x: (Math.random() - 0.5) * config.horizontalDrift,
                z: (Math.random() - 0.5) * config.horizontalDrift
            };
            
            // 회전 (하늘하늘 효과)
            confetti.userData.rotation = {
                x: (Math.random() - 0.5) * 0.1,
                y: (Math.random() - 0.5) * 0.12,
                z: (Math.random() - 0.5) * 0.08
            };
            
            // 흔들림 파라미터
            confetti.userData.swayPhase = Math.random() * Math.PI * 2;
            confetti.userData.swaySpeed = 1.5 + Math.random() * 1;
            confetti.userData.swayAmount = 0.02 + Math.random() * 0.03;
            
            // 지연 스폰 (순차적으로 나타남)
            confetti.userData.spawnDelay = Math.random() * 1.5;
            confetti.userData.spawned = false;
            confetti.visible = false;
            
            scene.add(confetti);
            confettiPieces.push(confetti);
        }

        // 애니메이션
        let startTime = Date.now();
        const animate = () => {
            const elapsed = (Date.now() - startTime) / 1000;
            const progress = elapsed / config.duration;

            if (progress < 1) {
                confettiPieces.forEach(confetti => {
                    // 지연 스폰 체크
                    if (!confetti.userData.spawned) {
                        if (elapsed >= confetti.userData.spawnDelay) {
                            confetti.userData.spawned = true;
                            confetti.visible = true;
                        } else {
                            return;
                        }
                    }
                    
                    const vel = confetti.userData.driftSpeed;
                    const rot = confetti.userData.rotation;
                    
                    // 낙하
                    confetti.position.y -= confetti.userData.fallSpeed;
                    
                    // 좌우 흔들림 (사인파 움직임)
                    const sway = Math.sin(elapsed * confetti.userData.swaySpeed + confetti.userData.swayPhase);
                    confetti.position.x += sway * confetti.userData.swayAmount;
                    confetti.position.z += Math.cos(elapsed * confetti.userData.swaySpeed + confetti.userData.swayPhase) * confetti.userData.swayAmount * 0.5;
                    
                    // 일정한 수평 드리프트
                    confetti.position.x += vel.x;
                    confetti.position.z += vel.z;
                    
                    // 회전 (하늘하늘 떨어지는 효과)
                    confetti.rotation.x += rot.x;
                    confetti.rotation.y += rot.y;
                    confetti.rotation.z += rot.z;
                    
                    // 페이드 아웃 (후반부에만)
                    if (progress > 0.7) {
                        const fadeProgress = (progress - 0.7) / 0.3;
                        confetti.material.opacity = 1 - fadeProgress;
                    }
                });

                requestAnimationFrame(animate);
            } else {
                // 정리
                confettiPieces.forEach(confetti => {
                    scene.remove(confetti);
                    confetti.geometry.dispose();
                    confetti.material.dispose();
                });
            }
        };

        animate();
    },

    /**
     * 시네마틱 연출 - 통합 파티클 효과 (타이밍과 레이어링 최적화)
     * @param {THREE.Scene} scene Three.js scene
     * @param {THREE.Vector3} position 위치
     */
    createCombinedEffect(scene, position) {
        // Initial impact sparkle (빠른 섬광)
        this.createSparkleEffect(scene, position, {
            particleCount: 60,
            duration: 1.2,
            range: 1.5
        });

        // Main rising particles (100ms delay for drama)
        setTimeout(() => {
            this.createSelectionEffect(scene, position, {
                particleCount: 180,
                duration: 2.8
            });
        }, 100);

        // Secondary sparkle burst (강조 효과)
        setTimeout(() => {
            this.createSparkleEffect(scene, position, {
                particleCount: 40,
                duration: 1.5,
                range: 2.5,
                colors: [0xFFFFFF, 0xFFD700, 0xFFA500]
            });
        }, 400);

        // Grand finale firework (클라이맥스)
        setTimeout(() => {
            const fireworkPos = new THREE.Vector3(
                position.x,
                position.y + 2.5,
                position.z
            );
            this.createFireworkEffect(scene, fireworkPos, {
                particleCount: 100,
                explosionForce: 0.3,
                duration: 2.2
            });
        }, 800);
    },

    /**
     * 컨페티 셀레브레이션 - 폭죽 + 레인 조합
     * @param {THREE.Scene} scene Three.js scene
     * @param {THREE.Vector3} position 폭죽 위치
     * @param {THREE.Camera} camera 카메라
     */
    createConfettiCelebration(scene, position, camera) {
        // 중앙 폭죽 터트리기
        this.createConfettiBurst(scene, position, {
            particleCount: 150,
            explosionForce: 0.4,
            duration: 4.5
        });

        // 하늘에서 떨어지는 컨페티 레인
        setTimeout(() => {
            this.createConfettiRain(scene, camera, {
                particleCount: 120,
                duration: 6,
                fallSpeed: 0.025
            });
        }, 300);
    }
};
