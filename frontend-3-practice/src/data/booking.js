// Данные демонстрационной записи.
// В третьей практике они лежат в коде; в четвёртой их заменит сервер.

export const TODAY = { day: 17, month: 9, year: 2026 };

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

// Два набора слотов — как в имитационном сервере из четвёртой практики.
const SLOTS_EVEN_DAY = [
  { time: "10:00", available: true },
  { time: "10:30", available: true },
  { time: "11:00", available: true },
  { time: "11:30", available: true },
  { time: "12:00", available: false },
  { time: "13:00", available: false },
  { time: "14:30", available: true },
  { time: "15:00", available: true },
  { time: "16:00", available: true },
  { time: "17:30", available: true },
  { time: "18:00", available: true },
  { time: "19:30", available: true },
];

const SLOTS_ODD_DAY = [
  { time: "10:00", available: true },
  { time: "10:30", available: true },
  { time: "11:00", available: false },
  { time: "11:30", available: true },
  { time: "12:00", available: true },
  { time: "13:00", available: true },
  { time: "14:30", available: true },
  { time: "15:00", available: true },
  { time: "16:00", available: false },
  { time: "17:30", available: true },
  { time: "18:00", available: true },
  { time: "19:30", available: true },
];

// Возвращаем копии, чтобы состояние React не зависело от исходных массивов.
export function getSlotsForDay(day) {
  const source = day % 2 === 0 ? SLOTS_EVEN_DAY : SLOTS_ODD_DAY;
  return source.map((slot) => ({ ...slot }));
}

// Делит слоты на утро, день и вечер.
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
