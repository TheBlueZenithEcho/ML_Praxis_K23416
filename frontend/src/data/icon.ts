export type MenuItem = {
  id: number;
  title: string;
  url: string;
  icon: string; // Class của Bootstrap icon
};

export const menuItems: MenuItem[] = [
  {
    id: 1,
    title: "Home",
    url: "/",
    icon: "bi bi-house"
  },
  {
    id: 2,
    title: "Users",
    url: "/admin_users",
    icon: "bi bi-people"
  },
  {
    id: 3,
    title: "Designers",
    url: "/admin_designers",
    icon: "bi bi-person-square"
  },
  {
    id: 4,
    title: "Interior Design",
    url: "/admin_interior",
    icon: "bi bi-image-alt"
  },
  {
    id: 5,
    title: "Products",
    url: "/admin_products",
    icon: "bi bi-search-heart"
  }
];