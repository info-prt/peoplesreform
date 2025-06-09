document.addEventListener('DOMContentLoaded', function() {
    // Header Scroll Effect
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const closeMenu = document.getElementById('closeMenu');
    const mobileMenu = document.getElementById('mobileMenu');
    
    hamburger.addEventListener('click', function() {
        mobileMenu.classList.add('active');
    });
    
    closeMenu.addEventListener('click', function() {
        mobileMenu.classList.remove('active');
    });

    // Mobile Submenu Toggle
    const mobileSubmenuToggles = document.querySelectorAll('.mobile-has-submenu > a');
    
    mobileSubmenuToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const submenu = this.nextElementSibling;
            submenu.classList.toggle('active');
        });
    });

});
document.addEventListener('DOMContentLoaded', function () {
    const submenuLinks = document.querySelectorAll('.has-submenu > a');

    submenuLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const parent = this.parentElement;

            // ปิด .show ทั้งหมดก่อน
            document.querySelectorAll('.has-submenu.show').forEach(function (item) {
                if (item !== parent) {
                    item.classList.remove('show');
                }
            });

            // toggle ตัวที่คลิก
            parent.classList.toggle('show');
        });
    });

    // คลิกนอกเมนู => ปิดทั้งหมด
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.has-submenu')) {
            document.querySelectorAll('.has-submenu.show').forEach(function (item) {
                item.classList.remove('show');
            });
        }
    });
});
