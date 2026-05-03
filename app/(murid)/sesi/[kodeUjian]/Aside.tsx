"use client";
import { useUjian } from "./UjianContext";

const Aside = () => {
  const { soal, currentIndex, setCurrentIndex, jawaban, raguRagu } = useUjian();

  return (
    <aside className="w-80 shrink-0">
      <section className="daftar-soal flex flex-col items-center">
        <p className="text-xl font-semibold text-center mb-3">Daftar Soal</p>
        <div className="soal-soal grid grid-cols-5 gap-3 h-44 md:h-96 overflow-y-auto pr-2 custom-scrollbar content-start justify-items-center w-full">
          {soal.map((item, index) => {
            const isAnswered = !!jawaban[item.id];
            const isRagu = raguRagu[item.id];
            const isActive = currentIndex === index;

            let bgColor = "bg-slate-200 text-black hover:bg-slate-300";
            if (isAnswered)
              bgColor = "bg-green-500 text-white hover:bg-green-600";
            if (isRagu)
              bgColor = "bg-orange-400 text-white hover:bg-orange-500";

            const borderStyle = isActive ? "border-4 border-indigo-600" : "";

            return (
              <div
                key={item.id}
                onClick={() => setCurrentIndex(index)}
                className={`w-12 h-12 flex items-center justify-center font-semibold rounded-lg shadow-sm transition-all cursor-pointer active:scale-95 ${bgColor} ${borderStyle}`}
              >
                {index + 1}
              </div>
            );
          })}
        </div>
      </section>
    </aside>
  );
};
export default Aside;
