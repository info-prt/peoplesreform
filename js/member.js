        // ระบบแท็บ
        const memberTabs = document.querySelectorAll('.member-tab');
        
        memberTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // ลบ active จากแท็บทั้งหมด
                memberTabs.forEach(t => t.classList.remove('active'));
                
                // เพิ่ม active ให้แท็บที่คลิก
                this.classList.add('active');
                
                // ซ่อน content ทั้งหมด
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                
                // แสดง content ที่เกี่ยวข้อง
                const tabId = this.getAttribute('data-tab');
                document.getElementById(tabId + '-tab').classList.add('active');
            });
        });
        
        // ฟังก์ชันจัดการฟอร์มเข้าสู่ระบบ
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            // ตรวจสอบข้อมูล (ควรมีการตรวจสอบกับเซิร์ฟเวอร์ในสภาพแวดล้อมจริง)
            if (email && password) {
                alert('เข้าสู่ระบบสำเร็จ!');
                // ในสภาพแวดล้อมจริงควร redirect ไปหน้าสมาชิกหรือทำการ login
            } else {
                alert('กรุณากรอกอีเมลและรหัสผ่าน');
            }
        });
        
        // ฟังก์ชันจัดการฟอร์มสมัครสมาชิก
        document.getElementById('registerForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const phone = document.getElementById('registerPhone').value;
            const idCard = document.getElementById('registerIdCard').value;
            const address = document.getElementById('registerAddress').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('registerConfirmPassword').value;
            
            // ตรวจสอบข้อมูล
            if (password !== confirmPassword) {
                alert('รหัสผ่านไม่ตรงกัน');
                return;
            }
            
            if (name && email && phone && idCard && address && password) {
                // ในสภาพแวดล้อมจริงควรส่งข้อมูลไปยังเซิร์ฟเวอร์
                alert('สมัครสมาชิกสำเร็จ! ระบบจะทำการตรวจสอบข้อมูลและแจ้งผลกลับไปยังอีเมลของคุณ');
                this.reset();
            } else {
                alert('กรุณากรอกข้อมูลให้ครบถ้วน');
            }
        });
        
        // ลืมรหัสผ่าน
        document.getElementById('forgotPassword').addEventListener('click', function(e) {
            e.preventDefault();
            const email = prompt('กรุณากรอกอีเมลที่ใช้สมัครสมาชิก:');
            if (email) {
                alert('ระบบได้ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลของคุณแล้ว');
            }
        });
