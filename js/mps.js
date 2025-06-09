        // ฟังก์ชันหลักสำหรับดึงและแสดงข้อมูล
        async function loadData() {
          try {
            const response = await fetch('https://script.google.com/macros/s/AKfycbx4FXGqc7134cmsUOl6bWBkc-T68gc6evihz4pMLw01LDTtO2hcjkOqO9nXDYUlM9SR/exec');
            const data = await response.json();
            
            // ตรวจสอบก่อนว่า element มีอยู่จริง
            const lastUpdatedElement = document.getElementById('last-updated');
            if (lastUpdatedElement) {
              lastUpdatedElement.textContent = `อัปเดตล่าสุด: ${formatDateTime(data.updatedAt)}`;
            }
            
            // แสดงข้อมูลสส.ปัจจุบัน
            displayCurrentMPs(data.currentMps);
            
            // แสดงข้อมูลอดีตสส.
            displayFormerMPs(data.formerMps);
            
            // แสดงข้อมูลการอภิปราย
            displayDebates(data.debates);
            
          } catch (error) {
            console.error('เกิดข้อผิดพลาดในการโหลดข้อมูล:', error);
            showError('ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่ในภายหลัง');
          }
        }
        
        // ฟังก์ชันแสดงข้อความผิดพลาด
        function showError(message) {
          const errorContainer = document.getElementById('error-container');
          if (errorContainer) {
            errorContainer.innerHTML = `
              <div class="alert alert-error">
                <i class="fas fa-exclamation-circle"></i> ${message}
              </div>
            `;
            errorContainer.style.display = 'block';
          }
        }
        
        // ฟังก์ชันสำหรับจัดการแท็บ
        function setupTabs() {
          const tabButtons = document.querySelectorAll('.tab-button');
          
          if (tabButtons.length > 0) {
            tabButtons.forEach(button => {
              button.addEventListener('click', function() {
                // เปลี่ยนแท็บที่ active
                document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // แสดงเนื้อหาที่เกี่ยวข้อง
                const tabId = this.getAttribute('data-tab');
                document.querySelectorAll('.tab-content').forEach(content => {
                  content.style.display = 'none';
                });
                
                const activeTab = document.getElementById(tabId);
                if (activeTab) {
                  activeTab.style.display = 'block';
                }
              });
            });
            
            // เปิดแท็บแรกโดย default
            tabButtons[0].click();
          }
        }
        
        // โหลดข้อมูลเมื่อหน้าเว็บโหลดเสร็จ
        document.addEventListener('DOMContentLoaded', () => {
          // ตั้งค่าแท็บก่อน
          setupTabs();
          
          // แล้วจึงโหลดข้อมูล
          loadData();
        });
        
        // แสดงข้อมูลสส.ปัจจุบัน
        function displayCurrentMPs(mps) {
          const container = document.getElementById('current-mps-grid');
          container.innerHTML = '';
          
          if (!mps || mps.length === 0) {
            container.innerHTML = '<p class="no-data">ไม่พบข้อมูลสมาชิกสภาผู้แทนราษฎรชุดปัจจุบัน</p>';
            return;
          }
          
          mps.forEach(mp => {
            const card = createMPCard(mp);
            container.appendChild(card);
          });
        }
        
        // แสดงข้อมูลอดีตสส.
        function displayFormerMPs(mps) {
          const container = document.getElementById('former-mps-grid');
          container.innerHTML = '';
          
          if (!mps || mps.length === 0) {
            container.innerHTML = '<p class="no-data">ไม่พบข้อมูลอดีตสมาชิกสภาผู้แทนราษฎร</p>';
            return;
          }
          
          mps.forEach(mp => {
            const card = createMPCard(mp, true);
            container.appendChild(card);
          });
        }
        
        // สร้างการ์ดแสดงข้อมูลสส.
        function createMPCard(mp, isFormer = false) {
          const card = document.createElement('div');
          card.className = 'mp-card';
          
          let badge = '';
          if (isFormer) {
            badge = `<span class="mp-badge former">อดีตสส.</span>`;
          } else if (mp.ประเภท === 'แบ่งเขต') {
            badge = `<span class="mp-badge constituency">สส.เขต</span>`;
          } else {
            badge = `<span class="mp-badge party-list">สส.บัญชีรายชื่อ</span>`;
          }
          
          card.innerHTML = `
            <div class="mp-image-container">
              <img src="${mp.ภาพ || 'images/default-avatar.jpg'}" alt="${mp['ชื่อ-นามสกุล']}" class="mp-image">
              ${badge}
            </div>
            <div class="mp-info">
              <h3 class="mp-name">${mp['ชื่อ-นามสกุล']}</h3>
              ${mp.ประเภท === 'แบ่งเขต' ? `
                <p class="mp-constituency">
                  <i class="fas fa-map-marker-alt"></i> เขต ${mp.เขตเลือกตั้ง} ${mp.จังหวัด}
                </p>
              ` : '
                <p class="mp-constituency">
                  <i class="fas fa-map-marker-alt"></i> บัญชีรายชื่อ ลำดับที่ ${mp.เขตเลือกตั้ง}
                </p>
                '}
              ${isFormer ? `
                <p class="mp-term">
                  <i class="fas fa-calendar-alt"></i> ${mp['ช่วงเวลาที่ดำรงตำแหน่ง']}
                </p>
              ` : ''}
              <div class="mp-actions">
                <button class="btn btn-profile" data-mp-id="${mp.รหัส}">
                  <i class="fas fa-user-circle"></i> ดูประวัติ
                </button>
                ${!isFormer ? `
                  <button class="btn btn-debates" data-mp-id="${mp.รหัส}">
                    <i class="fas fa-comments"></i> การอภิปราย
                  </button>
                ` : ''}
              </div>
            </div>
          `;
          
          return card;
        }
        
        // แสดงข้อมูลการอภิปราย
        function displayDebates(debates) {
          const container = document.getElementById('debates-list');
          container.innerHTML = '';
          
          if (!debates || debates.length === 0) {
            container.innerHTML = '<p class="no-data">ไม่พบข้อมูลการอภิปราย</p>';
            return;
          }
          
          // เรียงลำดับตามวันที่ (ใหม่สุดก่อน)
          debates.sort((a, b) => new Date(b.วันที่) - new Date(a.วันที่));
          
          debates.forEach(debate => {
            const debateItem = createDebateItem(debate);
            container.appendChild(debateItem);
          });
        }
        
        // สร้างรายการการอภิปราย
        function createDebateItem(debate) {
          const item = document.createElement('div');
          item.className = 'debate-card';
          
          item.innerHTML = `
            <div class="debate-header">
                <h3 class="debate-title">${debate.หัวข้อ}</h3>
                <span class="debate-date">${debate.วันที่}</span>
            </div>
            <div class="debate-mp">โดย: ${debate['ชื่อ-นามสกุล']}</div>
            <div class="debate-tags">
              ${debate.ป้ายกำกับ.split(',').map(tag => `
                <span class="tag">${tag.trim()}</span>
              `).join('')}
            </div>
            <p class="debate-excerpt">"${debate.เนื้อหาสรุป}"</p>
            <div class="watch-btn">
              <a href="${debate.ลิงก์วิดีโอ || '#'}" class="btn btn-watch" target="_blank">
                <i class="fas fa-play"></i> ดูเพิ่มเติม
              </a>
            </div>
          `;
          
          return item;
        }
        
        // ฟังก์ชันช่วยเหลือสำหรับการจัดรูปแบบวันที่
        function formatDate(dateString) {
          if (!dateString) return 'ไม่ทราบวันที่';
          const options = { year: 'numeric', month: 'long', day: 'numeric' };
          return new Date(dateString).toLocaleDateString('th-TH', options);
        }
        
        function formatDateTime(datetimeString) {
          if (!datetimeString) return 'ไม่ทราบวันเวลา';
          const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          };
          return new Date(datetimeString).toLocaleDateString('th-TH', options);
        }
        
        // แสดงข้อความผิดพลาด
        function showError(message) {
          const errorContainer = document.getElementById('error-container');
          errorContainer.innerHTML = `
            <div class="alert alert-error">
              <i class="fas fa-exclamation-circle"></i> ${message}
            </div>
          `;
          errorContainer.style.display = 'block';
        }
        
        // โหลดข้อมูลเมื่อหน้าเว็บโหลดเสร็จ
        document.addEventListener('DOMContentLoaded', () => {
          loadData();
          
          // การจัดการเหตุการณ์สำหรับแท็บ
          document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', function() {
              // เปลี่ยนแท็บที่ active
              document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
              this.classList.add('active');
              
              // แสดงเนื้อหาที่เกี่ยวข้อง
              const tabId = this.getAttribute('data-tab');
              document.querySelectorAll('.tab-content').forEach(content => {
                content.style.display = 'none';
              });
              document.getElementById(tabId).style.display = 'block';
            });
          });
        });


document.addEventListener('click', function (event) {
  const button = event.target.closest('button[data-mp-id]');
  if (button) {
    const mpId = button.getAttribute('data-mp-id');
    if (mpId) {
      window.location.href = `/mp/${mpId}`;
    }
  }
});
