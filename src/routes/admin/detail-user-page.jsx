import { useParams } from "react-router-dom";

const DetailUserPage = () => {
  const { userId } = useParams();
  return (
    <div className="w-full h-full flex justify-center items-center">
      <h1 className="text-4xl">Karyawan with id {userId}</h1>
    </div>
  );
};

export default DetailUserPage;
