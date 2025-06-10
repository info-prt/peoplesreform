// URL ของ Google Apps Script ที่ deploy แล้ว
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxSZaqk0IIKd8Ztnj0jgeHyQg7xb_eDEyUixWJiEScIUmwupODUDvAchU0mRB4IGUv31Q/exec';

// ฟังก์ชันสมัครสมาชิก
async function registerMember(memberData) {
  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'register',
        ...memberData
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      alert(data.message);
      // redirect หรือทำอย่างอื่นหลังจากสมัครสำเร็จ
    } else {
      throw new Error(data.error || 'การสมัครสมาชิกล้มเหลว');
    }
  } catch (error) {
    alert(error.message);
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
document.getElementById('registerForm').addEventListener('submit', function(e) {
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
document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const loginData = {
    usernameRoblox: document.getElementById('loginUsernameRoblox').value,
    password: document.getElementById('loginPassword').value // ในทางปฏิบัติควรเข้ารหัสก่อนส่ง
  };
  
  loginMember(loginData);
});
