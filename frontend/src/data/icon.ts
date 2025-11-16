// Tên file: src/data/icon.js (hoặc .ts)
// (SỬA: Thêm 'type' và cấu trúc lại menu)

// Ghi chú: Tôi dùng icon của Bootstrap (bi) làm ví dụ
// Bạn hãy thay 'bi bi-...' bằng class icon bạn đang dùng
export const menuItems = [
    
    // NHÓM 1: CHUNG
    { 
        id: 'h1', 
        title: 'GENERAL', 
        type: 'heading' // Loại là 1 tiêu đề
    },
    { 
        id: 1, 
        title: 'Home', 
        icon: 'bi bi-grid-1x2-fill', // Icon
        url: '/admin_home', 
        type: 'link' // Loại là 1 link
    },
    { 
        id: 2, 
        title: 'Products', 
        icon: 'bi bi-box-seam-fill', 
        url: '/admin_products', 
        type: 'link' 
    },
    { 
        id: 7, 
        title: 'Interior Designs', // Đổi tên từ "Interior Designs"
        icon: 'bi bi-images', 
        url: '/admin_interior', 
        type: 'link' 
    },

    // NHÓM 2: TÀI KHOẢN
    { 
        id: 'h2', 
        title: 'ACCOUNT', 
        type: 'heading' // Loại là 1 tiêu đề
    },
    { 
        id: 3, 
        title: 'Customers', 
        icon: 'bi bi-people-fill', 
        url: '/admin_users', 
        type: 'link' 
    },
    { 
        id: 4, 
        title: 'Designers', 
        icon: 'bi bi-person-workspace', 
        url: '/admin_designers', 
        type: 'link' 
    },

    // NHÓM 3: DUYỆT 
    { 
        id: 'h3', 
        title: 'APPROVAL', 
        type: 'heading' 
    },
    { 
        id: 5, 
        title: 'Pending Approval', // Đổi tên từ "Pending Approval"
        icon: 'bi bi-patch-check-fill', 
        url: '/admin_approval', 
        type: 'link' 
    },
    { 
        id: 6, 
        title: 'Quotation', // Đổi tên từ "Quotation"
        icon: 'bi bi-file-earmark-check-fill', 
        url: '/admin_quotation', 
        type: 'link' 
    }, 
];