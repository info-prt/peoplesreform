        // URL ของ Google Apps Script
        const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz4O7eJYZC-9qiUW5YwhZSrYJfrBkxoWDUcJb6DybPNxAvF9prq2t_IUdVPx8bg_z5F9g/exec';
        
        // ฟังก์ชันดึงข้อมูลกิจกรรม
        async function fetchActivities() {
            try {
                const response = await fetch(SCRIPT_URL);
                const data = await response.json();
                
                if (data && data.activities) {
                    // แสดงเวลาอัปเดตล่าสุด
                    displayLastUpdated(data.updatedAt);
                    
                    // แสดงกิจกรรม
                    displayActivities(data.activities);
                } else {
                    showError('ไม่พบข้อมูลกิจกรรม');
                }
            } catch (error) {
                console.error('Error fetching activities:', error);
                showError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
            }
        }
        
        // ฟังก์ชันแสดงเวลาอัปเดตล่าสุด
        function displayLastUpdated(updatedAt) {
            const lastUpdatedEl = document.getElementById('lastUpdated');
            if (!updatedAt) return;
            
            const updatedDate = new Date(updatedAt);
            const options = { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            };
            
            const formattedDate = updatedDate.toLocaleDateString('th-TH', options);
            lastUpdatedEl.textContent = `อัปเดตล่าสุด: ${formattedDate}`;
        }
        
        // ฟังก์ชันแสดงกิจกรรม
        function displayActivities(activities) {
            const container = document.getElementById('activitiesContainer');
            
            if (!activities || activities.length === 0) {
                container.innerHTML = '<div class="loading">ไม่พบกิจกรรมในขณะนี้</div>';
                return;
            }
            
            container.innerHTML = '';
            
            activities.forEach(activity => {
                const activityCard = document.createElement('div');
                activityCard.className = 'activity-card';
                
                activityCard.innerHTML = `
                    <div class="activity-image">
                        <img src="${activity.img}" alt="${activity.title}">
                    </div>
                    <div class="activity-content">
                        <div class="activity-date">
                            <i class="far fa-calendar-alt"></i>
                            ${activity.date} • ${activity.time}
                        </div>
                        <h3 class="activity-title">${activity.title}</h3>
                        <a href="${activity.link}" class="read-more">ดูรายละเอียด</a>
                    </div>
                `;
                
                container.appendChild(activityCard);
            });
        }
        
        // ฟังก์ชันแสดงข้อความผิดพลาด
        function showError(message) {
            const container = document.getElementById('activitiesContainer');
            container.innerHTML = `
                <div class="loading">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>${message}</p>
                </div>
            `;
        }
        
        // โหลดข้อมูลเมื่อหน้าเว็บโหลดเสร็จ
        document.addEventListener('DOMContentLoaded', fetchActivities);
