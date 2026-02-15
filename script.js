// ============================================================
// AIMES Eleven Industrial - Interactive Script
// Three.js + GSAP + i18n + Card Modal
// ============================================================

// ==================== Three.js Background ====================
(function initThreeBackground() {
    const container = document.getElementById('canvas-container');
    if (!container || typeof THREE === 'undefined') return;

    try {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // Particle system - 11 industry colors
        const particleCount = 900;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        const colorPalette = [
            new THREE.Color(0x0ea5e9), // primary - cyan
            new THREE.Color(0x8b5cf6), // accent - purple
            new THREE.Color(0x10b981), // success - green
            new THREE.Color(0xf472b6), // companion - pink
            new THREE.Color(0xf59e0b), // warning - amber
            new THREE.Color(0xef4444), // danger - red
        ];

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 22;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 22;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 22;

            const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.03,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true,
        });

        const particles = new THREE.Points(geometry, material);
        scene.add(particles);

        // Connection lines
        const lineGeometry = new THREE.BufferGeometry();
        const linePositions = new Float32Array(250 * 6);
        let lineIndex = 0;

        for (let i = 0; i < particleCount && lineIndex < 250; i++) {
            for (let j = i + 1; j < particleCount && lineIndex < 250; j++) {
                const dx = positions[i * 3] - positions[j * 3];
                const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
                const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (dist < 1.5) {
                    linePositions[lineIndex * 6] = positions[i * 3];
                    linePositions[lineIndex * 6 + 1] = positions[i * 3 + 1];
                    linePositions[lineIndex * 6 + 2] = positions[i * 3 + 2];
                    linePositions[lineIndex * 6 + 3] = positions[j * 3];
                    linePositions[lineIndex * 6 + 4] = positions[j * 3 + 1];
                    linePositions[lineIndex * 6 + 5] = positions[j * 3 + 2];
                    lineIndex++;
                }
            }
        }

        lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x0ea5e9,
            transparent: true,
            opacity: 0.08,
        });
        const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
        scene.add(lines);

        camera.position.z = 8;

        let mouseX = 0, mouseY = 0;
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        function animate() {
            requestAnimationFrame(animate);
            particles.rotation.y += 0.0005;
            particles.rotation.x += 0.0002;
            lines.rotation.y += 0.0005;
            lines.rotation.x += 0.0002;

            camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.02;
            camera.position.y += (mouseY * 0.3 - camera.position.y) * 0.02;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        }

        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    } catch (e) {
        console.warn('WebGL not available:', e.message);
    }
})();

// ==================== Scroll Animations ====================
(function initScrollAnimations() {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        try {
            gsap.registerPlugin(ScrollTrigger);

            gsap.utils.toArray('.fade-in').forEach(el => {
                gsap.from(el, {
                    y: 30,
                    duration: 0.6,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 90%',
                        toggleActions: 'play none none none',
                    },
                });
            });

            gsap.from('.content-fade-up', {
                y: 40, duration: 0.8, delay: 0.2, ease: 'power3.out',
            });

            gsap.from('.hero-industry-ring', {
                scale: 0.8, opacity: 0, duration: 1, delay: 0.5, ease: 'power3.out',
            });
        } catch (e) {
            console.warn('GSAP animation error:', e);
        }
    }
})();

// ==================== Counter Animation ====================
(function initCounters() {
    const counters = document.querySelectorAll('[data-count]');

    function animateCounter(el) {
        if (el.dataset.animated) return;
        el.dataset.animated = 'true';
        const target = parseInt(el.getAttribute('data-count'));
        let current = 0;
        const increment = target / 60;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                el.textContent = target;
                clearInterval(timer);
            } else {
                el.textContent = Math.floor(current);
            }
        }, 25);
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    counters.forEach(counter => observer.observe(counter));

    setTimeout(() => {
        counters.forEach(counter => animateCounter(counter));
    }, 2000);
})();

// ==================== Smooth Scroll ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });

            const navCollapse = document.getElementById('navbarNav');
            if (navCollapse && navCollapse.classList.contains('show')) {
                const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
                if (bsCollapse) bsCollapse.hide();
            }
        }
    });
});

// ==================== Navbar Scroll ====================
(function initNavbar() {
    const nav = document.querySelector('.glass-nav');
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 100) {
            nav.style.background = 'rgba(5, 6, 8, 0.9)';
            nav.style.padding = '0.5rem 0';
        } else {
            nav.style.background = 'rgba(5, 6, 8, 0.7)';
            nav.style.padding = '1rem 0';
        }
    });
})();

// ==================== Domain Card Modal ====================
(function initCardModal() {
    const overlay = document.getElementById('cardModal');
    const modalHeader = document.getElementById('modalHeader');
    const modalBody = document.getElementById('modalBody');
    const modalClose = document.getElementById('modalClose');
    if (!overlay || !modalHeader || !modalBody) return;

    const cards = document.querySelectorAll('.domain-card');

    cards.forEach(card => {
        card.addEventListener('click', () => {
            // Build header: card header + description + services + regulations
            let headerHtml = '';
            const cardHeader = card.querySelector('.domain-card-header');
            const desc = card.querySelector('p');
            if (cardHeader) headerHtml += cardHeader.outerHTML;
            if (desc) headerHtml += '<p style="color:var(--text-muted); font-size:0.9rem; line-height:1.7; margin-top:0.75rem;">' + desc.innerHTML + '</p>';

            const services = card.querySelector('.services-list');
            if (services) headerHtml += '<div class="mt-2">' + services.outerHTML + '</div>';

            const regs = card.querySelector('.regulations');
            if (regs) headerHtml += '<div class="mt-2">' + regs.outerHTML + '</div>';

            modalHeader.innerHTML = headerHtml;

            // Build body: detail content
            let bodyHtml = '';
            const detail = card.querySelector('.card-detail');
            if (detail) bodyHtml = detail.innerHTML;

            modalBody.innerHTML = bodyHtml;

            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeModal() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (modalClose) modalClose.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
})();

// ==================== Language Toggle (KR/EN) ====================
const translations = {
    en: {
        // Nav
        nav_domains: 'Industries',
        nav_arch: 'Architecture',
        nav_stack: 'Tech Stack',
        nav_workflow: 'Workflow',
        nav_ai: 'AI/ML',
        nav_security: 'Security',
        nav_compare: 'Matrix',
        nav_roi: 'ROI',

        // Hero
        hero_title_1: 'Spanning 11 Industries',
        hero_title_2: 'AI Manufacturing Platform',
        hero_subtitle: 'AIMES (AI-based Manufacturing Execution System) is a next-generation unified MES platform that provides domain-specific capabilities on top of a shared technology stack and architecture across 11 manufacturing industries: Food, Pharmaceutical, Chemical, Semiconductor, Automotive, Battery, Metal, Medical Device, Cosmetics, Agricultural, and Textile.',
        hero_btn_domains: 'Explore 11 Industries',
        hero_btn_arch: 'Common Architecture',
        stat_domains: 'Industries',
        stat_services: '+ Microservices',
        stat_api: '+ API Endpoints',
        stat_ai: '+ AI/ML Models',

        // Overview
        ov_tag: 'PLATFORM OVERVIEW',
        ov_title: 'One Platform, 11 Industries',
        ov_desc: 'AIMES extends domain-specific services as plugins on a shared tech foundation (React + FastAPI + PostgreSQL). The same architecture, workflow, and AI/ML pipeline accelerate AX transformation across 11 manufacturing industries.',
        ov_arch_title: 'Unified Architecture',
        ov_arch_desc: 'ISA-95 based 8-layer architecture with OT/IT separation. Flexible microservices-based modular design.',
        ov_domain_title: 'Domain Specialization',
        ov_domain_desc: 'Dedicated services and AI models tailored to each industry\'s regulations, processes, and quality standards.',
        ov_sec_title: 'Built-in Security',
        ov_sec_desc: 'Zero Trust architecture applied to all industries based on A3 Security\'s OT/IT security expertise.',

        // Domains
        dom_tag: '11 INDUSTRIAL DOMAINS',
        dom_title: '11 Industry Domains',
        dom_desc: 'AIMES optimized for each industry\'s regulatory requirements and process characteristics. Click cards for details.',
        dom_food_title: 'Food Manufacturing',
        dom_food_sub: 'Food Manufacturing (KSIC 10/11)',
        dom_food_desc: 'HACCP CCP monitoring, recipe optimization, cold chain management, LOT traceability — revolutionizing food safety and quality with AI.',
        dom_pharma_title: 'Pharmaceutical',
        dom_pharma_sub: 'Pharmaceutical (GMP)',
        dom_pharma_desc: 'FDA 21 CFR Part 11 electronic batch records, GMP deviation management, 4-zone cold chain monitoring, and serialization for drug integrity.',
        dom_chem_title: 'Chemical Products',
        dom_chem_sub: 'Chemical Manufacturing (PSM)',
        dom_chem_desc: 'PSM, K-REACH chemical registration, gas leak detection, carbon emission management, and ESG reporting for integrated chemical process safety.',
        dom_elec_title: 'Semiconductor/Electronics',
        dom_elec_sub: 'Semiconductor & Electronics (SECS/GEM)',
        dom_elec_desc: 'Lot/Wafer tracking, AOI vision inspection, SPC, FDC/APC advanced process control, SECS/GEM equipment interface, and cleanroom monitoring.',
        dom_auto_title: 'Automotive Parts',
        dom_auto_sub: 'Automotive (IATF 16949)',
        dom_auto_desc: 'IATF 16949 quality standard compliance, process capability analysis (Ppk/Cpk), FMEA management, VIN tracking, and tool lifecycle management.',
        dom_bat_title: 'Battery/Cell',
        dom_bat_sub: 'Battery Cell & Pack (Li-ion)',
        dom_bat_desc: 'Cell ID tracking, dryroom management, electrode process (coating/drying/slitting), formation/aging, and capacity/impedance testing.',
        dom_metal_title: 'Metal/Steel',
        dom_metal_sub: 'Metal & Steel Manufacturing',
        dom_metal_desc: 'Melting/casting/rolling/annealing process tracking, alloy composition monitoring, tensile/hardness testing, corrosion prediction, and mold management.',
        dom_med_title: 'Medical Device',
        dom_med_sub: 'Medical Device (FDA 510(k))',
        dom_med_desc: 'FDA 510(k) compliance, ISO 13485 quality system, sterilization validation, biocompatibility testing, and device serial traceability.',
        dom_cosm_title: 'Cosmetics',
        dom_cosm_sub: 'Cosmetics (CGMP / ISO 22716)',
        dom_cosm_desc: 'CGMP/ISO 22716 compliance, formulation (INCI) management, EU 26 allergen tracking, pH/viscosity/color quality control, and multi-country regulatory filing.',
        dom_agri_title: 'Agricultural/Marine',
        dom_agri_sub: 'Agricultural & Marine Products',
        dom_agri_desc: 'SmartFarm/aquaculture IoT integration, 5-zone cold chain monitoring, freshness prediction (Arrhenius), AI grading, and HACCP compliance.',
        dom_text_title: 'Textile',
        dom_text_sub: 'Textile Manufacturing',
        dom_text_desc: 'Dyeing/finishing process management, color matching AI, fabric defect detection, environmental regulation compliance, and energy optimization.',

        // Architecture
        arch_tag: 'COMMON ARCHITECTURE',
        arch_title: '8-Layer Common Architecture',
        arch_desc: 'ISA-95 standard based Purdue Model for OT/IT separation, with microservices architecture applied uniformly across all 11 industries.',

        // Tech Stack
        stack_tag: 'TECHNOLOGY STACK',
        stack_title: 'Common Tech Stack for 11 Industries',
        stack_desc: 'All domains are built on the same technology foundation. Industry differences only occur in L6 Application Layer domain-specific services.',

        // Workflow
        wf_tag: 'COMMON WORKFLOW',
        wf_title: 'Common Manufacturing Workflow',
        wf_desc: 'All 11 industries follow the same 8-step workflow framework. AI is integrated at each step to support autonomous decision-making.',
        wf_s1: 'Demand Forecasting / Production Planning',
        wf_s1_desc: 'AI demand forecast model → Production planning → Auto material ordering. Prophet/LSTM prediction engine used across all industries.',
        wf_s2: 'Material Receiving / Inspection',
        wf_s2_desc: 'Material LOT registration → Quality inspection → Regulatory check (allergen/chemical/GMP) → Receiving approval.',
        wf_s3: 'Pre-processing / Mixing',
        wf_s3_desc: 'AI recipe/formulation optimization → Real-time material variance correction → CCP/process parameter monitoring start.',
        wf_s4: 'Main Processing',
        wf_s4_desc: 'AI process parameter optimization → Real-time quality prediction → Anomaly detection → Predictive maintenance integration.',
        wf_s5: 'Quality Inspection',
        wf_s5_desc: 'Vision AI inspection → Auto defect classification → SPC control charts → Pass/Fail decision → Root cause analysis.',
        wf_s6: 'Packaging / Labeling',
        wf_s6_desc: 'Weight check → Label verification (regulatory info, expiry) → Serialization → LOT traceability complete.',
        wf_s7: 'Shipping / Distribution',
        wf_s7_desc: 'Final inspection & environmental check → Shipping approval → Forward LOT tracking activated → Distribution history management.',
        wf_s8: 'Post Management / Reporting',
        wf_s8_desc: 'Regulatory report auto-generation → Audit trail → AI model retraining → KPI dashboard refresh.',

        // AI/ML
        ai_tag: 'AI/ML PIPELINE',
        ai_title: 'Common AI/ML Pipeline',
        ai_desc: 'A hybrid AI strategy combining Edge AI real-time inference with server-side advanced analytics, applied uniformly across 11 industries.',
        ai_quality: 'Quality Prediction',
        ai_quality_desc: 'Predicts quality deviations through time-series analysis of process variables. 40~60% defect rate reduction.',
        ai_anomaly: 'Anomaly Detection',
        ai_anomaly_desc: 'Real-time detection of subtle anomalies after learning normal patterns. Industry-specific sensor data models.',
        ai_vision: 'Vision Inspection',
        ai_vision_desc: 'Auto-detection of surface defects, foreign objects, labels. Edge AI real-time inference under 100ms.',
        ai_process: 'Process Optimization',
        ai_process_desc: 'Auto-search for optimal process parameters. Adaptive control for material variations, 5~10% yield improvement.',
        ai_maintenance: 'Predictive Maintenance',
        ai_maintenance_desc: 'RUL prediction from vibration/temperature/current data. 30~50% unplanned downtime reduction.',
        ai_demand: 'Demand Forecasting',
        ai_demand_desc: 'Time-series demand forecasting for production planning optimization. Inventory cost reduction and delivery compliance improvement.',
        ai_edge_title: 'Edge AI (NVIDIA Jetson)',
        ai_edge_sub: 'Real-time inference < 100ms',
        ai_edge_desc: 'Independent operation during IT network disconnection. Vision inspection, CCP deviation instant alerts. ONNX Runtime based.',
        ai_server_title: 'GPU Server (NVIDIA L40S)',
        ai_server_sub: 'Advanced analytics & model training',
        ai_server_desc: 'Large-scale data analysis, model training/retraining. MLflow automated deployment. Batch inference < 500ms.',

        // Microservices
        svc_tag: 'MICROSERVICES PATTERN',
        svc_title: 'Common Microservices Pattern',
        svc_desc: 'All domains follow the same service pattern. Composed of 8-10 microservices, only domain-specific services differ by industry.',
        svc_common_title: 'Common Services (All Industries)',
        svc_domain_title: 'Industry-Specific Services',

        // Comparison
        comp_tag: 'COMPARISON MATRIX',
        comp_title: 'Industry Feature Comparison Matrix',
        comp_desc: 'Compare functional coverage across 11 industry domains at a glance. Common features are identical; differences occur in domain-specific features.',
        comp_feature: 'Feature Area',

        // Security
        sec_tag: 'SECURITY',
        sec_title: 'Purdue Model Security Architecture',
        sec_desc: 'Zero Trust architecture applied across all 11 industries based on A3 Security\'s OT/IT security expertise.',
        sec_purdue_title: 'Purdue Model Network Layers',
        sec_l5: 'Enterprise Network (Internet/External) — Enterprise Firewall + IDS/IPS',
        sec_l4: 'IT Zone — MES Server, AI Server, DB Server, Grafana, Vault, SIEM',
        sec_l3: 'DMZ — Edge Gateway, Protocol Converter, Data Diode (Unidirectional)',
        sec_l2: 'OT Zone — SCADA, HMI',
        sec_l1: 'OT Zone — PLC, RTU',
        sec_l0: 'OT Zone — Sensors, Vision Camera, Detectors, Actuators',

        // ROI
        roi_tag: 'ROI ANALYSIS',
        roi_title: 'Expected Benefits of AIMES',
        roi_desc: 'Based on 11-industry averages, AIMES deployment is expected to deliver annual cost savings of 200M~600M KRW with quality and productivity improvements.',
        roi_th1: 'Metric',
        roi_th2: 'Before (As-Is)',
        roi_th3: 'After (To-Be)',
        roi_th4: 'Improvement',
        roi_r_defect: 'Defect Rate',
        roi_r_downtime: 'Unplanned Downtime',
        roi_dt_before: '8~20 hrs/month',
        roi_dt_after: '2~8 hrs/month',
        roi_r_yield: 'Material Yield',
        roi_r_energy: 'Energy Cost',
        roi_en_before: '100% (baseline)',
        roi_r_regulation: 'Regulatory Compliance Time',
        roi_reg_before: '40~80 hrs/month',
        roi_reg_after: '8~16 hrs/month',
        roi_invest: 'Investment (per domain)',
        roi_save: 'Annual Savings',
        roi_payback: 'Payback Period',
        roi_5yr: '5-Year Cumulative ROI',

        // Roadmap
        rm_tag: 'ROADMAP',
        rm_title: 'Implementation Roadmap',
        rm_desc: 'Targeting 12-18 month prototype completion per industry with Agile + Domain Expert hybrid methodology.',
        rm_p0_dur: '1-2 months',
        rm_p0_title: 'Planning & Preparation',
        rm_p0_desc: 'Market research, pilot company selection, As-Is analysis, ROI target setting, industry regulatory analysis',
        rm_p1_dur: '2-3 months',
        rm_p1_title: 'Prototype Design',
        rm_p1_desc: 'System architecture design, AI model selection, IoT/sensor installation planning, security architecture design',
        rm_p2_dur: '4-6 months',
        rm_p2_title: 'Prototype Development',
        rm_p2_desc: 'AIMES Core + domain-specific service development, IoT infrastructure, AI model training, dashboard implementation',
        rm_p3_dur: '3-4 months',
        rm_p3_title: 'Validation & Verification',
        rm_p3_desc: 'Pilot line 24/7 operation, AI model tuning, ROI measurement & verification, regulatory compliance check',
        rm_p4_dur: '6 months+',
        rm_p4_title: 'Commercialization & Expansion',
        rm_p4_desc: 'Commercial release, additional customer acquisition, module expansion, cross-industry domain expansion',

        // Footer
        footer_sub: 'AI-based next-gen MES for 11 manufacturing industries',
        footer_by: 'Designed by Brian Lee / A3-AI Working Group',
        footer_links: 'Quick Links',
        footer_domains: 'Industries',
        footer_arch: 'Architecture',
        footer_stack: 'Tech Stack',
        footer_ai: 'AI/ML',
        footer_industries: '11 Industries',
    }
};

let currentLang = 'ko';

function setLanguage(lang) {
    currentLang = lang;

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    if (lang === 'ko') {
        // Reset to original Korean text (reload page content is in Korean by default)
        document.querySelectorAll('[data-i18n]').forEach(el => {
            if (el._originalText) {
                el.textContent = el._originalText;
            }
        });
    } else if (translations[lang]) {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            // Store original Korean text
            if (!el._originalText) {
                el._originalText = el.textContent;
            }
            if (translations[lang][key]) {
                el.textContent = translations[lang][key];
            }
        });
    }
}

// Store original Korean text on load
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        el._originalText = el.textContent;
    });
});

document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        setLanguage(btn.dataset.lang);
    });
});
