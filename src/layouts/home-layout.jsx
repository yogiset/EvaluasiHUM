import { Footer } from "@/components/home/footer";
import { Navbar } from "@/components/home/navbar";

const HomeLayout = ({ children }) => {
  return (
    <main className="font-poppins">
      <Navbar />
      {children}
      <Footer />
    </main>
  );
};

export default HomeLayout;
