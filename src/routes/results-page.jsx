import HomeLayout from "@/layouts/home-layout";
import goalTarget from "@/assets/goal-target.svg";

const ResultsPage = () => {
  return (
    <HomeLayout>
      <div className="min-h-screen flex justify-center">
        <div className="max-w-screen-2xl min-h-screen flex bg-goal bg-contain bg-no-repeat bg-center bg-clip-content bg-fixed md:bg-none">
          <div className="w-1/2 h-screen hidden md:flex items-center justify-center">
            <img src={goalTarget} width={500} alt="img" />
          </div>
          <div className="w-full md:w-1/2 flex flex-col justify-normal md:justify-center bg-white/85 gap-10 px-2 pt-24 md:pt-0">
            <h1 className="text-4xl font-semibold">Hasil Evaluasi Anda</h1>
            <p>
              <span className="font-semibold">Kode:</span> P073Y2
            </p>
            <p>
              <span className="font-semibold">Hasil:</span> Lorem ipsum dolor
              sit amet consectetur adipisicing elit. Nulla nesciunt aut quasi
              saepe facere excepturi? Laudantium explicabo reprehenderit
              voluptate possimus?
            </p>
            <p>
              <span className="font-semibold">Perlu ditingkatkan:</span> Lorem
              ipsum dolor sit amet, consectetur adipisicing elit. Doloribus, vel
              mollitia. Perspiciatis iure reprehenderit labore at eum vel
              molestiae ipsa, culpa quibusdam rem maxime fugiat, provident
              dignissimos asperiores officiis neque unde dolores ullam quae ut?
            </p>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
};

export default ResultsPage;
