import { useParams, Link } from "react-router-dom";
import { ChevronsRight, Info, Download } from "lucide-react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { generatePdf } from "@/lib/generate-pdf";
import { Loading } from "@/components/dashboard/loading";
import { Button } from "@/components/ui/button";

const DetailEvaluasiPage = () => {
  const { evId } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["get-evaluasi", evId],
    queryFn: fetchEvaluation,
  });

  async function fetchEvaluation() {
    const response = await axios.get(
      `http://localhost:8082/evaluasi/findbyideva/${evId}`
    );

    if (response.status === 200) {
      return response.data;
    }
  }

  function downloadPdf() {
    generatePdf({
      nik: data.nik,
      nama: data.nama,
      divisi: data.divisi,
      jabatan: data.jabatan,
      email: data.email,
      tanggal_masuk: data.tanggalmasuk,
      masa_kerja:data.masakerja,
      tingkatan:data.tingkatan,
      tanggal_evaluasi: data.tanggalevaluasi,
      hasilEvaluasi: data.hasilevaluasi,
      perluDitingkatkan: data.perluditingkatkan,
    });
  }

  if (error) {
    return (
      <div className="w-full h-full flex justify-center items-center flex-col text-center">
        <Info />
        <h1 className="text-xl font-semibold">Error!</h1>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full flex items-center gap-x-2 font-medium p-2">
        <Link to={"/dashboard/evaluasi"} className="hover:underline">
          EVALUASI
        </Link>
        <ChevronsRight />
        <p>{evId}</p>
      </div>
      <div className="w-full h-full overflow-y-auto">
        <div className="w-full h-full">
          {isLoading ? (
            <Loading />
          ) : (
            <div className="p-2 space-y-4 pb-20">
              <h1 className="text-lg md:text-xl font-bold">Detail Evaluasi</h1>
              <div className="my-4">
                <h1 className="font-semibold">NIK: {data.nik}</h1>
                <h1 className="font-semibold">Nama: {data.nama}</h1>
                <h1 className="font-semibold">Divisi: {data.divisi}</h1>
                <h1 className="font-semibold">Jabatan: {data.jabatan}</h1>
                <h1 className="font-semibold">Email: {data.email}</h1>
                <h1 className="font-semibold">
                  Tanggal Masuk: {data.tanggalmasuk}
                </h1>
                <h1 className="font-semibold">Masa Kerja: {data.masakerja}</h1>
                <h1 className="font-semibold">Tingkatan: {data.tingkatan}</h1>
                <h1 className="font-semibold">
                  Kode evaluasi: {data.kodeevaluasi}
                </h1>
                <h1 className="font-semibold">
                  Tanggal Evaluasi: {data.tanggalevaluasi}
                </h1>
              </div>
              <div className="my-4">
                <h1 className="font-semibold">Hasil evaluasi:</h1>
                <p>{data.hasilevaluasi}</p>
              </div>
              <div className="my-4">
                <h1 className="font-semibold">Perlu ditingkatkan:</h1>
                <p>{data.perluditingkatkan}</p>
              </div>
              <div className="flex items-center gap-x-2 my-4">
                <Button variant="sky" onClick={downloadPdf}>
                  <Download className="mr-2 w-4 h-4" />
                  Unduh PDF
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailEvaluasiPage;
