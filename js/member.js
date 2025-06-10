
// ระบบแท็บ
const memberTabs = document.querySelectorAll('.member-tab');

memberTabs.forEach(tab => {
    tab.addEventListener('click', function () {
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

// URL ของ Google Apps Script ที่ deploy แล้ว
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbznL_Q9LvzVG1tYAJtaPySh9EGkCfbU0avEHe17fp4v3WCB2dZByzlZIrQ9DS0NgxDFoA/exec';

// ฟังก์ชันสมัครสมาชิก
async function registerMember(memberData) {
  try {
    // ใช้ /exec?action=register แทนการส่ง action ใน body
    const url = `${SCRIPT_URL}?action=register`;
    
    const response = await fetch(url, {
      method: 'POST',
      mode: 'no-cors', // ใช้ no-cors mode
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(memberData)
    });
    
    // เนื่องจากใช้ no-cors mode เราจะไม่สามารถอ่าน response ได้โดยตรง
    alert('สมัครสมาชิกเรียบร้อยแล้ว ระบบกำลังประมวลผล');
    window.location.reload();
  } catch (error) {
    alert('เกิดข้อผิดพลาดในการสมัครสมาชิก');
    console.error('Registration error:', error);
  }
}

// ฟังก์ชันเข้าสู่ระบบ
async function loginMember(loginData) {
    try {
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'login',
                ...loginData
            })
        });

        const data = await response.json();

        if (data.success) {
            alert(data.message);
            // บันทึกข้อมูลการล็อกอินและ redirect
            localStorage.setItem('member', JSON.stringify(data.member));
            window.location.href = 'member/dashboard.html';
        } else {
            throw new Error(data.error || 'การเข้าสู่ระบบล้มเหลว');
        }
    } catch (error) {
        alert(error.message);
        console.error('Login error:', error);
    }
}

// แก้ไข event listener สำหรับฟอร์มสมัครสมาชิก
document.getElementById('registerForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;

    if (password !== confirmPassword) {
        alert('รหัสผ่านไม่ตรงกัน');
        return;
    }

    const memberData = {
        discordName: document.getElementById('registerDiscordName').value,
        usernameRoblox: document.getElementById('registerUsernameRoblox').value,
        idCard: document.getElementById('registerIdCard').value,
        address: document.getElementById('registerAddress').value,
        password: password // ในทางปฏิบัติควรเข้ารหัสก่อนส่ง
    };

    registerMember(memberData);
});

// แก้ไข event listener สำหรับฟอร์มเข้าสู่ระบบ
document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const loginData = {
        usernameRoblox: document.getElementById('loginUsernameRoblox').value,
        password: document.getElementById('loginPassword').value // ในทางปฏิบัติควรเข้ารหัสก่อนส่ง
    };

    loginMember(loginData);
});
