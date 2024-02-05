import { useParams } from "react-router-dom";

const DetailKaryawanPage = () => {
  const { karId } = useParams();
  return (
    <div className="w-full h-full flex justify-center items-center">
      <h1 className="text-4xl">Karyawan with id {karId}</h1>
    </div>
  );
};

export default DetailKaryawanPage;
