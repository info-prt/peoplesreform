        // ตัวแปรเก็บข้อมูลนโยบายทั้งหมด
        let allPolicies = [];
        
        // ฟังก์ชันโหลดข้อมูลจาก Google Apps Script
        async function fetchPolicies() {
            try {
                // URL ของ Google Apps Script ที่ deploy เป็น Web App
                const scriptUrl = 'https://script.google.com/macros/s/AKfycbyFb9YiZ2ZVbt6IqqEjZghlsRdztCDMCN7O23lYJcYCYcy5h24cBnGOPTR_5foaK5eq/exec';
                
                const response = await fetch(scriptUrl);
                const data = await response.json();
                
                if (data && data.status === 'success' && data.data) {
                    allPolicies = data.data;
                    displayPolicies(allPolicies);
                    
                    // สร้างหมวดหมู่จากข้อมูลที่มี
                    updateCategories(allPolicies);
                } else {
                    document.getElementById('policiesContainer').innerHTML = 
                        '<div class="loading">ไม่สามารถโหลดข้อมูลนโยบายได้</div>';
                }
            } catch (error) {
                console.error('Error fetching policies:', error);
                document.getElementById('policiesContainer').innerHTML = 
                    '<div class="loading">เกิดข้อผิดพลาดในการโหลดข้อมูล</div>';
            }
        }
        
        // ฟังก์ชันแสดงนโยบาย
        function displayPolicies(policies) {
            const container = document.getElementById('policiesContainer');
            
            if (policies.length === 0) {
                container.innerHTML = '<div class="loading">ไม่พบนโยบายที่ตรงกับเงื่อนไข</div>';
                return;
            }
            
            container.innerHTML = '';
            
            policies.forEach(policy => {
                const policyCard = document.createElement('div');
                policyCard.className = 'policy-card';
                policyCard.setAttribute('data-category', policy.category);
                
                policyCard.innerHTML = `
                    <div class="policy-image">
                        <img src="${policy.image || '../images/policy-default.jpg'}" alt="${policy.title}">
                    </div>
                    <div class="policy-content">
                        <span class="policy-category">${policy.category}</span>
                        <h3 class="policy-title">${policy.title}</h3>
                        <p class="policy-excerpt">${policy.excerpt}</p>
                        <a href="policy-detail.html?id=${policy.id}" class="read-more">อ่านรายละเอียด</a>
                    </div>
                `;
                
                container.appendChild(policyCard);
            });
        }
        
        // ฟังก์ชันอัปเดตหมวดหมู่จากข้อมูล
        function updateCategories(policies) {
            const categoriesContainer = document.getElementById('policyCategories');
            const categories = ['all'];
            
            // หาหมวดหมู่ทั้งหมดจากข้อมูล
            policies.forEach(policy => {
                if (!categories.includes(policy.category)) {
                    categories.push(policy.category);
                }
            });
            
            // สร้างปุ่มหมวดหมู่ (ถ้ามีมากกว่าหมวดหมู่เริ่มต้น)
            if (categories.length > 6) {
                categoriesContainer.innerHTML = '';
                
                categories.forEach(category => {
                    const btn = document.createElement('button');
                    btn.className = `category-btn ${category === 'all' ? 'active' : ''}`;
                    btn.textContent = category === 'all' ? 'ทั้งหมด' : category;
                    btn.setAttribute('data-category', category);
                    
                    btn.addEventListener('click', function() {
                        document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                        this.classList.add('active');
                        
                        if (category === 'all') {
                            displayPolicies(allPolicies);
                        } else {
                            const filtered = allPolicies.filter(p => p.category === category);
                            displayPolicies(filtered);
                        }
                    });
                    
                    categoriesContainer.appendChild(btn);
                });
            }
        }
        
        // ฟังก์ชันค้นหานโยบาย
        function searchPolicies(query) {
            const resultsContainer = document.getElementById('searchResults');
            
            if (!query) {
                resultsContainer.style.display = 'none';
                return;
            }
            
            const lowerQuery = query.toLowerCase();
            const results = allPolicies.filter(policy => 
                policy.title.toLowerCase().includes(lowerQuery) || 
                policy.excerpt.toLowerCase().includes(lowerQuery) ||
                policy.category.toLowerCase().includes(lowerQuery)
            );
            
            resultsContainer.innerHTML = '';
            
            if (results.length === 0) {
                resultsContainer.innerHTML = '<div class="no-results">ไม่พบนโยบายที่ตรงกับคำค้นหา</div>';
            } else {
                results.slice(0, 5).forEach(policy => {
                    const item = document.createElement('div');
                    item.className = 'search-result-item';
                    item.innerHTML = `
                        <h4>${policy.title}</h4>
                        <p>${policy.category} • ${policy.excerpt.substring(0, 60)}...</p>
                    `;
                    
                    item.addEventListener('click', function() {
                        window.location.href = `policy-detail.html?id=${policy.id}`;
                    });
                    
                    resultsContainer.appendChild(item);
                });
            }
            
            resultsContainer.style.display = 'block';
        }
        
        // Event Listeners
        document.addEventListener('DOMContentLoaded', function() {
            // โหลดข้อมูลนโยบาย
            fetchPolicies();
            
            // การค้นหาแบบ real-time
            const searchInput = document.getElementById('policySearch');
            searchInput.addEventListener('input', function() {
                searchPolicies(this.value);
            });
            
            // ปิดผลการค้นหาเมื่อคลิกที่อื่น
            document.addEventListener('click', function(e) {
                if (!e.target.closest('.search-container')) {
                    document.getElementById('searchResults').style.display = 'none';
                }
            });
        });

// ฟังก์ชันจัดการการคลิกที่ปุ่มหมวดหมู่
function setupCategoryButtons() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // ลบ class active จากปุ่มทั้งหมด
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            
            // เพิ่ม class active ให้ปุ่มที่คลิก
            this.classList.add('active');
            
            // ดึงหมวดหมู่ที่เลือก
            const selectedCategory = this.getAttribute('data-category');
            
            // กรองนโยบายตามหมวดหมู่
            filterPolicies(selectedCategory);
        });
    });
}

// ฟังก์ชันกรองนโยบายตามหมวดหมู่
function filterPolicies(category) {
    if (category === 'all') {
        // แสดงทั้งหมดถ้าเลือก "ทั้งหมด"
        displayPolicies(allPolicies);
    } else {
        // กรองนโยบายตามหมวดหมู่
        const filteredPolicies = allPolicies.filter(policy => 
            policy.category === category
        );
        displayPolicies(filteredPolicies);
    }
}

// ฟังก์ชันแสดงนโยบาย (แก้ไขให้ทำงานกับข้อมูลจริง)
function displayPolicies(policies) {
    const container = document.getElementById('policiesContainer');
    
    if (!policies || policies.length === 0) {
        container.innerHTML = '<div class="loading">ไม่พบนโยบายในหมวดหมู่นี้</div>';
        return;
    }
    
    container.innerHTML = '';
    
    policies.forEach(policy => {
        const policyCard = document.createElement('div');
        policyCard.className = 'policy-card';
        policyCard.setAttribute('data-category', policy.category);
        
        policyCard.innerHTML = `
            <div class="policy-image">
                <img src="${policy.image || '../images/policy-default.jpg'}" alt="${policy.title}">
            </div>
            <div class="policy-content">
                <span class="policy-category">${policy.category}</span>
                <h3 class="policy-title">${policy.title}</h3>
                <p class="policy-excerpt">${policy.excerpt}</p>
                <a href="policy-detail.html?id=${policy.id}" class="read-more">อ่านรายละเอียด</a>
            </div>
        `;
        
        container.appendChild(policyCard);
    });
}

// เรียกใช้ฟังก์ชันเมื่อโหลดหน้าเว็บ
document.addEventListener('DOMContentLoaded', function() {
    // โหลดข้อมูลนโยบาย (ต้องมีฟังก์ชัน fetchPolicies() ที่ทำงานถูกต้อง)
    fetchPolicies();
    
    // ตั้งค่าปุ่มหมวดหมู่
    setupCategoryButtons();
});
