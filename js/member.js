
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
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzqmfKvDHZlQl2smaXv8lPu8gAlKcvJgMxmFUq1oRZZombQXKyasXbR36g6gjMygSNqZw/exec';

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

// ฟังก์ชันเข้าสู่ระบบแบบใหม่
async function loginUser(usernameRoblox, password) {
  try {
    const formData = new FormData();
    formData.append('action', 'login');
    formData.append('usernameRoblox', usernameRoblox);
    formData.append('password', password);
    
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      body: formData,
      redirect: 'follow'
    });
    
    const text = await response.text();
    console.log('Raw response:', text); // <== เพิ่มไว้ดูว่าได้อะไรกลับมา

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      const jsonMatch = text.match(/{.*}/);
      if (jsonMatch) data = JSON.parse(jsonMatch[0]);
      else throw new Error('รูปแบบข้อมูลที่ได้ไม่ถูกต้อง');
    }

    if (data.success && data.user) {
      localStorage.setItem('prt_member', JSON.stringify(data.user));
      window.location.href = 'member/dashboard.html';
    } else {
      throw new Error(data.error || 'เข้าสู่ระบบไม่สำเร็จ (ไม่มีข้อมูลผู้ใช้)');
    }
  } catch (error) {
    console.error('Login error:', error);
    showAlert(error.message || 'เกิดข้อผิดพลาดขณะเข้าสู่ระบบ', 'error');
    return false;
  }
}


// แก้ไข event listener สำหรับฟอร์มเข้าสู่ระบบ
document.getElementById('loginForm')?.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const usernameRoblox = document.getElementById('loginUsernameRoblox').value.trim();
  const password = document.getElementById('loginPassword').value;
  
  if (!usernameRoblox || !password) {
    showAlert('กรุณากรอกอีเมลและรหัสผ่าน', 'error');
    return;
  }
  
  // แสดง loading state
  const submitBtn = this.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> กำลังเข้าสู่ระบบ...';
  
  await loginUser(usernameRoblox, password);
  
  // คืนค่าเดิมให้ปุ่ม
  submitBtn.disabled = false;
  submitBtn.textContent = originalText;
});

// ฟังก์ชันแสดง Alert
function showAlert(message, type = 'success') {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type}`;
  alertDiv.textContent = message;
  
  const container = document.querySelector('.member-section .container');
  container.prepend(alertDiv);
  
  setTimeout(() => {
    alertDiv.remove();
  }, 5000);
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
