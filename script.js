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

        // Nav
        nav_status: 'Status',

        // Hero
        hero_title_1: 'Spanning 11 Industries',
        hero_title_2: 'AI Manufacturing Platform',
        hero_subtitle: 'AIMES (AI-based Manufacturing Execution System) is a next-generation unified MES platform that provides domain-specific capabilities on top of a shared technology stack and architecture across 11 manufacturing industries: Food, Pharmaceutical, Chemical, Semiconductor, Automotive, Battery, Metal, Medical Device, Cosmetics, Agricultural, and Textile.',
        hero_btn_domains: 'Explore 11 Industries',
        hero_btn_arch: 'Common Architecture',
        stat_domains: 'Industries',
        stat_services: 'Microservices',
        stat_files: 'Source Files',
        stat_tests: 'Tests 100% PASS',

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

        // Project Status
        ps_tag: 'PROJECT STATUS',
        ps_title: '11-Domain Implementation Status',
        ps_desc: 'All 11 domains are fully implemented with 100% test pass rate. Total: 2,394 source files, 96 microservices, 1,313 tests all PASS.',
        ps_th_domain: 'Domain',
        ps_th_services: 'Services',
        ps_th_pages: 'Pages',
        ps_th_files: 'Source Files',
        ps_th_tests: 'Tests',
        ps_th_pass: 'Pass Rate',
        ps_th_fe_port: 'Frontend',
        ps_th_gw_port: 'Gateway',
        ps_total: 'Total',
        ps_launcher_title: 'Unified Launcher',
        ps_launcher_desc: 'Start_all_AIMES.sh launches all 11 projects simultaneously with a single command.',
        ps_test_title: '1,313 Tests 100% PASS',
        ps_test_desc: 'All 11 domains pass 100% of their tests. Most tests: Medical (161).',
        ps_i18n_title: 'Multilingual (i18n)',
        ps_i18n_desc: '9 of 11 domains support Korean/English. Real-time switching via useLanguageStore.',

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
        svc_desc: 'All domains follow the same service pattern. Composed of 1-10 microservices (96 total), only domain-specific services differ by industry.',
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
        footer_by: 'Designed by Brian Lee / A3 Security AITF Working Group',
        footer_links: 'Quick Links',
        footer_status: 'Project Status',
        footer_domains: 'Industries',
        footer_arch: 'Architecture',
        footer_stack: 'Tech Stack',
        footer_ai: 'AI/ML',
        footer_industries: '11 Industries',
    }
};

// ==================== Static Text Translation (non data-i18n elements) ====================
// Korean → English mapping for elements without data-i18n attributes
const koEnMap = {
    // Hero ring labels
    '식품': 'Food', '제약': 'Pharma', '화학': 'Chemical', '반도체': 'Semi',
    '자동차': 'Auto', '배터리': 'Battery', '금속': 'Metal', '의료': 'Medical',
    '화장품': 'Cosmetics', '농수산': 'Agri', '섬유': 'Textile',
    '11개 산업': 'Eleven Industries',

    // Overview feature tags
    '8계층 아키텍처': '8-Layer Architecture', '마이크로서비스': 'Microservices',
    '퍼듀 모델': 'Purdue Model', '제로 트러스트': 'Zero Trust',
    '온프레미스': 'On-Premises', '종단간 암호화': 'E2E Encryption',

    // Domain card feature tags
    '생산관리': 'Production', '품질관리': 'Quality', '이력추적': 'Traceability',
    '재고관리': 'Inventory', '설비정비': 'Maintenance',
    'GMP 준수': 'GMP Compliance', '배치 기록': 'Batch Record', '콜드체인': 'Cold Chain',
    '시리얼라이제이션': 'Serialization', '공정안전관리': 'PSM', '반응공정': 'Reaction',
    '화학물질 안전': 'Chemical Safety', '환경관리': 'Environment',
    '수율관리': 'Yield', '레시피관리': 'Recipe',
    'IATF 준수': 'IATF Compliance', '금형/공구관리': 'Tool Mgmt',
    '셀 추적': 'Cell Tracking', '드라이룸': 'Dryroom', '전극공정': 'Electrode',
    '화성/에이징': 'Formation', '공정제어': 'Process Control', '안전관리': 'Safety',
    '금형/공구': 'Tool/Mold', '규제관리': 'Regulatory', '멸균관리': 'Sterilization',
    '처방관리': 'Formulation', '알레르겐': 'Allergen',
    '스마트팜': 'SmartFarm', '원료관리': 'Raw Material',
    '염색공정': 'Dyeing', '가공/후처리': 'Finishing',

    // Domain meta badges
    '9 서비스': '9 Services', '10 서비스': '10 Services', '8 서비스': '8 Services', '1 서비스': '1 Service',
    '359 파일': '359 Files', '376 파일': '376 Files', '126 파일': '126 Files',
    '341 파일': '341 Files', '129 파일': '129 Files', '51 파일': '51 Files',
    '130 파일': '130 Files', '131 파일': '131 Files', '273 파일': '273 Files',
    '402 파일': '402 Files', '76 파일': '76 Files',

    // AI / Regulation badges
    'AI 모델 6종': '6 AI Models', 'AI 모델 8종': '8 AI Models',
    'EU 규정': 'EU Reg', 'SEMI 표준': 'SEMI Standards',

    // Architecture layer names
    '프레젠테이션 계층': 'Presentation Layer', 'API 게이트웨이 계층': 'API Gateway Layer',
    '애플리케이션 서비스 계층': 'Application Service Layer',
    'AI/ML 서비스 계층': 'AI/ML Service Layer',
    '데이터 처리 계층': 'Data Processing Layer', '데이터 저장 계층': 'Data Storage Layer',
    '엣지 게이트웨이 계층': 'Edge Gateway Layer', 'OT 통합 계층': 'OT Integration Layer',

    // Architecture items
    '17~21개 표준 페이지': '17-21 Standard Pages', 'JWT 인증': 'JWT Auth',
    '역할 기반 접근제어': 'RBAC', '요청 제한': 'Rate Limiting',
    '서킷 브레이커': 'Circuit Breaker', '웹 방화벽': 'WAF',
    '도메인 특화 ×N': 'Domain-Specific ×N',
    '품질 예측': 'Quality Prediction', '이상 탐지': 'Anomaly Detection',
    '비전 AI': 'Vision AI', '공정 최적화': 'Process Optimization',
    '데이터 검증': 'Data Validation', '스트림 처리': 'Stream Processing',
    '프로토콜 변환기': 'Protocol Converter', '엣지 AI 추론': 'Edge AI Inference',
    '데이터 버퍼링': 'Data Buffering', '센서': 'Sensors', '비전 카메라': 'Vision Camera',

    // Tech stack titles
    '프론트엔드': 'Frontend', '백엔드': 'Backend',
    '데이터베이스 및 저장소': 'Database & Storage',
    '데브옵스 및 인프라': 'DevOps & Infra', '보안': 'Security',
    '리포지토리 패턴': 'Repository Pattern',

    // Security badges
    '역할/속성 기반 접근제어': 'RBAC + ABAC',

    // Purdue levels
    '레벨 5': 'Level 5', '레벨 4': 'Level 4', '레벨 3': 'Level 3',
    '레벨 2': 'Level 2', '레벨 1': 'Level 1', '레벨 0': 'Level 0',

    // Roadmap phases
    '단계 0': 'Phase 0', '단계 1': 'Phase 1', '단계 2': 'Phase 2',
    '단계 3': 'Phase 3', '단계 4': 'Phase 4',
};

// Selectors for elements that need static text translation
const staticSelectors = [
    '.ring-item span', '.ring-center-label small',
    '.feature-tag', '.ai-badge', '.regulation-badge', '.security-badge',
    '.arch-name', '.arch-item',
    '.stack-card-title', '.stack-item',
    '.purdue-label', '.rm-phase',
    '.meta-badge',
];

// Selectors for elements where full innerHTML/textContent needs mapping
const textSelectors = [
    '.services-list .feature-tag',
    '.regulations .ai-badge',
    '.regulations .regulation-badge',
];

// Microservice names & descriptions (selector → [ko, en])
const blockTranslations = {
    en: [
        // Microservice names & descriptions
        { sel: '.icon-box + div strong', pairs: [
            ['API 게이트웨이', 'API Gateway'],
            ['생산관리 서비스', 'Production Service'],
            ['품질관리 서비스', 'Quality Service'],
            ['설비정비 서비스', 'Maintenance Service'],
            ['알림 서비스', 'Notification Service'],
            ['데이터 수집 서비스', 'Data Ingestion Service'],
        ]},
        { sel: '.icon-box + div small, .icon-box-accent + div small, .icon-box-companion + div small, .icon-box-success + div small, .icon-box-warning + div small, [class^="icon-box"] + div small', pairs: [
            ['Express.js | JWT 인증, 역할기반접근제어, 요청제한, 서킷브레이커', 'Express.js | JWT, RBAC, Rate Limiting, Circuit Breaker'],
            ['Node.js | 실시간 알림, SMS/이메일 연동', 'Node.js | Real-time alerts, SMS/Email integration'],
            ['Node.js | 센서 데이터 수집, 엣지 통신', 'Node.js | Sensor data collection, Edge communication'],
        ]},
        // Domain-specific service descriptions (right panel)
        { sel: '#microservices .col-lg-6:last-child .text-muted', pairs: [
            ['HACCP, 이력추적, 재고관리', 'HACCP, Traceability, Inventory'],
            ['GMP, 배치기록, 시리얼라이제이션, 콜드체인', 'GMP, Batch Record, Serialization, Cold Chain'],
            ['공정안전관리, 화학물질 안전, 환경관리', 'PSM, Chemical Safety, Environment'],
            ['결함탐지, 공정제어, SECS/GEM, 수율관리', 'FDC, APC, SECS/GEM, Yield'],
            ['IATF 준수, 금형/공구 관리', 'IATF Compliance, Tool Management'],
            ['셀 추적, 드라이룸, 화성/에이징', 'Cell Tracking, Dryroom, Formation'],
            ['공정제어, 안전관리, 금형/공구', 'Process Control, Safety, Tool/Mold'],
            ['규제관리, 멸균관리, 이력추적', 'Regulatory, Sterilization, Traceability'],
            ['CGMP, 처방관리, 알레르겐, 규제관리', 'CGMP, Formulation, Allergen, Regulatory'],
            ['스마트팜, 콜드체인, 원료관리', 'SmartFarm, Cold Chain, Raw Material'],
            ['염색, 가공/후처리, 환경관리', 'Dyeing, Finishing, Environment'],
        ]},
    ],
};

let currentLang = 'ko';

function applyStaticTranslations(lang) {
    if (lang === 'en') {
        // Apply Korean → English for static elements
        staticSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                const text = el.textContent.trim();
                if (!el._originalStaticText) el._originalStaticText = text;
                if (koEnMap[text]) el.textContent = koEnMap[text];
            });
        });

        // Apply block translations
        if (blockTranslations.en) {
            blockTranslations.en.forEach(block => {
                document.querySelectorAll(block.sel).forEach(el => {
                    const text = el.textContent.trim();
                    if (!el._originalStaticText) el._originalStaticText = text;
                    block.pairs.forEach(([ko, en]) => {
                        if (text === ko) el.textContent = en;
                    });
                });
            });
        }

        // Footer copyright
        const copyright = document.querySelector('.footer-copyright');
        if (copyright) {
            if (!copyright._originalStaticText) copyright._originalStaticText = copyright.innerHTML;
            copyright.innerHTML = '&copy; 2026 A3 Security Co., Ltd. | AIMES Eleven Industrial Platform | All rights reserved.';
        }

        // Stack card titles (need special handling because they contain icons)
        document.querySelectorAll('.stack-card-title').forEach(el => {
            if (!el._originalStaticHTML) el._originalStaticHTML = el.innerHTML;
            const iconMatch = el.innerHTML.match(/(<i[^>]*><\/i>)/);
            const icon = iconMatch ? iconMatch[1] : '';
            const text = el.textContent.trim();
            if (koEnMap[text]) el.innerHTML = icon + ' ' + koEnMap[text];
        });

        // Microservice strong names (inside divs with icon-box)
        document.querySelectorAll('#microservices strong').forEach(el => {
            const text = el.textContent.trim();
            if (!el._originalStaticText) el._originalStaticText = text;
            const map = {
                'API 게이트웨이': 'API Gateway', '생산관리 서비스': 'Production Service',
                '품질관리 서비스': 'Quality Service', '설비정비 서비스': 'Maintenance Service',
                '알림 서비스': 'Notification Service', '데이터 수집 서비스': 'Data Ingestion Service',
            };
            if (map[text]) el.textContent = map[text];
        });

        // Microservice small descriptions
        document.querySelectorAll('#microservices small').forEach(el => {
            const text = el.textContent.trim();
            if (!el._originalStaticText) el._originalStaticText = text;
            const map = {
                'Express.js | JWT 인증, 역할기반접근제어, 요청제한, 서킷브레이커': 'Express.js | JWT, RBAC, Rate Limiting, Circuit Breaker',
                'FastAPI | 생산계획, 작업지시, 실적 관리': 'FastAPI | Production planning, work orders, performance',
                'FastAPI | 검사, 불량관리, SPC, 시정조치': 'FastAPI | Inspection, defect management, SPC, corrective action',
                'FastAPI | 설비관리, 예방정비, 예측정비': 'FastAPI | Equipment, preventive & predictive maintenance',
                'Node.js | 실시간 알림, SMS/이메일 연동': 'Node.js | Real-time alerts, SMS/Email integration',
                'Node.js | 센서 데이터 수집, 엣지 통신': 'Node.js | Sensor data collection, Edge communication',
            };
            if (map[text]) el.textContent = map[text];
        });

        // Domain-specific service descriptions (right panel) - use broad selector + content match
        document.querySelectorAll('#microservices .text-muted').forEach(el => {
            const text = el.textContent.trim();
            if (!el._originalStaticText) el._originalStaticText = text;
            const map = {
                'HACCP, 이력추적, 재고관리': 'HACCP, Traceability, Inventory',
                'GMP, 배치기록, 시리얼라이제이션, 콜드체인': 'GMP, Batch Record, Serialization, Cold Chain',
                '공정안전관리, 화학물질 안전, 환경관리': 'PSM, Chemical Safety, Environment',
                '결함탐지, 공정제어, SECS/GEM, 수율관리': 'FDC, APC, SECS/GEM, Yield',
                'IATF 준수, 금형/공구 관리': 'IATF Compliance, Tool Management',
                '셀 추적, 드라이룸, 화성/에이징': 'Cell Tracking, Dryroom, Formation',
                '공정제어, 안전관리, 금형/공구': 'Process Control, Safety, Tool/Mold',
                '규제관리, 멸균관리, 이력추적': 'Regulatory, Sterilization, Traceability',
                'CGMP, 처방관리, 알레르겐, 규제관리': 'CGMP, Formulation, Allergen, Regulatory',
                '스마트팜, 콜드체인, 원료관리': 'SmartFarm, Cold Chain, Raw Material',
                '염색, 가공/후처리, 환경관리': 'Dyeing, Finishing, Environment',
            };
            if (map[text]) el.textContent = map[text];
        });

    } else {
        // Restore Korean for all static elements
        const allSelectors = [...staticSelectors, '#microservices strong', '#microservices small.text-muted', '#microservices .text-muted'];
        allSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                if (el._originalStaticText) el.textContent = el._originalStaticText;
            });
        });

        // Restore stack card titles HTML
        document.querySelectorAll('.stack-card-title').forEach(el => {
            if (el._originalStaticHTML) el.innerHTML = el._originalStaticHTML;
        });

        // Restore footer copyright
        const copyright = document.querySelector('.footer-copyright');
        if (copyright && copyright._originalStaticText) {
            copyright.innerHTML = copyright._originalStaticText;
        }
    }
}

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

    // Apply static translations for non data-i18n elements
    applyStaticTranslations(lang);
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
