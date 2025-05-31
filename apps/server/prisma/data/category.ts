export type CategoryType = {
  id: string;
  name: string;
  slug: string;
  description: string;
};

export const Categories: CategoryType[] = [
  {
    id: "01J0A4S8F00000000000000011",
    name: "Android Phones",
    slug: "android-phones",
    description:
      "Explore the latest smartphones running on the versatile Android operating system from various manufacturers.",
  },
  {
    id: "01J0A4S8F00000000000000012",
    name: "iOS (iPhone)",
    slug: "ios-iphone",
    description:
      "Discover Apple's iconic iPhone lineup, known for its intuitive iOS and powerful performance.",
  },
  {
    id: "01J0A4S8F00000000000000013",
    name: "Used Phones",
    slug: "used-phones",
    description:
      "Find great deals on pre-owned smartphones, thoroughly inspected and ready for a new owner.",
  },
  {
    id: "01J0A4S8F00000000000000014",
    name: "New Phones",
    slug: "new-phones",
    description:
      "Browse the newest smartphone models, factory-sealed and with full warranties.",
  },
];
