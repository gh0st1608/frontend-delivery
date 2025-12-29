export interface CategoryMock {
  id: number;
  name: string;
  iconUrl: string;
}

export const MOCK_CATEGORIES: CategoryMock[] = [
  {
    id: 1,
    name: "Hamburguesas",
    iconUrl: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
  },
  {
    id: 2,
    name: "Pizzas",
    iconUrl: "https://cdn-icons-png.flaticon.com/512/3132/3132693.png",
  },
  {
    id: 3,
    name: "Bebidas",
    iconUrl: "https://cdn-icons-png.flaticon.com/512/2738/2738730.png",
  },
  {
    id: 4,
    name: "Postres",
    iconUrl: "https://cdn-icons-png.flaticon.com/512/992/992754.png",
  },
];
