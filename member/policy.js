        const scriptURL = "https://script.google.com/macros/s/AKfycbxpVMx0fGDg0L08NsHzZI6PsTzJS8kXMxsfdWdJa8C9NaYh4IoiOIcWYlRjjsaPzw8H/exec"; // 🔁 ใส่ URL จาก Deploy Web App

        document.addEventListener('DOMContentLoaded', async function () {
            try {
                const member = JSON.parse(localStorage.getItem('prt_member'));

                if (!member || !member.usernameRoblox) {
                    showAlert('กรุณาเข้าสู่ระบบก่อน', 'danger');
                    window.location.href = '../login.html';
                    return;
                }

                // ใส่ค่า username ลงในช่องฟอร์ม
                document.getElementById('usernameRoblox').value = member.usernameRoblox;

            } catch (error) {
                console.error('เกิดข้อผิดพลาด:', error);
                showAlert('เกิดข้อผิดพลาดบางอย่าง', 'danger');
            }
        });


        const API_URL = "https://script.google.com/macros/s/AKfycbxpVMx0fGDg0L08NsHzZI6PsTzJS8kXMxsfdWdJa8C9NaYh4IoiOIcWYlRjjsaPzw8H/exec";

        let globalData = null;
        
        document.addEventListener("DOMContentLoaded", () => {
          loadRegistrations();
          setupFormSubmission();
        });
        
        function setupFormSubmission() {
          const form = document.getElementById("land-registration-form");
          form.addEventListener("submit", (e) => {
            e.preventDefault();
        
            const usernameRoblox = document.getElementById("usernameRoblox").value;
            const policyType = document.getElementById("policyType").value;
            const policyName = document.getElementById("policyName").value;
            const policyDetails = document.getElementById("policyDetails").value;
        
            const data = {
              usernameRoblox: usernameRoblox,
              policyType: policyType,
              policyName: policyName,
              policyDetails: policyDetails,
              status: status,
              timestamp: new Date().toLocaleString(),
            };
        
            fetch(API_URL, {
              method: "POST",
              mode: "no-cors",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            });
        
            alert("ส่งข้อมูลสำเร็จ");
            form.reset();
            loadRegistrations(); // reload table
          });
        }

        
        function loadRegistrations() {
          fetch(API_URL)
            .then((res) => res.json())
            .then((rows) => {
              const tbody = document.getElementById("registrations-table-body");
              tbody.innerHTML = "";
              rows.forEach((row) => {
                const tr = document.createElement("tr");
                row.forEach((cell) => {
                  const td = document.createElement("td");
                  td.textContent = cell;
                  tr.appendChild(td);
                });
                tbody.appendChild(tr);
              });
            });
        }
