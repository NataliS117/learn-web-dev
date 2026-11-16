// Данные о мастере и услуге. «Сегодня» и слоты теперь приходят с сервера.

export const MASTER = {
  name: "Алина Соколова",
  role: "Мастер маникюра",
  experience: "стаж 7 лет",
  rating: "4,9",
  photo: "/images/master-alina.jpg",
};

export const SERVICE = {
  name: "Маникюр с покрытием",
  duration: "90 минут",
  price: "3 500 ₽",
};

// Делит слоты на утро, день и вечер для удобной отрисовки.
export function groupSlots(slots) {
  const groups = [
    { title: "Утро", slots: [] },
    { title: "День", slots: [] },
    { title: "Вечер", slots: [] },
  ];

  slots.forEach((slot) => {
    const hour = Number(slot.time.slice(0, 2));
    if (hour < 12) {
      groups[0].slots.push(slot);
    } else if (hour < 17) {
      groups[1].slots.push(slot);
    } else {
      groups[2].slots.push(slot);
    }
  });

  return groups.filter((group) => group.slots.length > 0);
}
