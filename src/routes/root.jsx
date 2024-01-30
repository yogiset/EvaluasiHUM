import HomeLayout from "@/layouts/home-layout";
import appIcon from "@/assets/app-icon.svg";
import { Button } from "@/components/ui/button";

function Root() {
  return (
    <HomeLayout>
      <div className="w-full min-h-screen flex flex-wrap-reverse ">
        <div className="w-full md:w-1/2 min-h-full flex flex-col justify-center items-center md:items-start text-center md:text-left p-2 md:p-5 lg:p-24 xl:p-40 gap-y-3">
          <h1 className="text-2xl md:text-4xl font-semibold">
            SISTEM EVALUASI KARYAWAN
          </h1>
          <h2 className="text-xl md:text-2xl font-medium">
            PT HARAPAN UTAMA MOTOR
          </h2>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. In qui
            voluptatem, dignissimos consequuntur tempora impedit aliquid
            adipisci.
          </p>
          <Button variant="sky" className="w-fit">
            Mulai survey
          </Button>
        </div>
        <div className="w-full md:w-1/2 flex justify-center items-center">
          <img src={appIcon} width={600} height={600} alt="icon" />
        </div>
      </div>
    </HomeLayout>
  );
}

export default Root;
