import HomeLayout from "@/layouts/home-layout";
import { useState } from "react";
import { Check, ChevronRight, ChevronLeft } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import useLocalStorageState from "use-local-storage-state";
import axios from "axios";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// main element
const EvaluationPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [value] = useLocalStorageState("evData");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  const { data, isLoading, error } = useQuery({
    queryKey: ["get-all-questions", page],
    queryFn: () => fetchAllQuestions(page),
    placeholderData: keepPreviousData,
  });

  async function fetchAllQuestions(page = 1) {
    const response = await axios.get(
      `http://localhost:8082/pertanyaan/pertanyaanjawaban?jabatan=${
        value.jabatan
      }&page=${page - 1}`
    );

    if (response.status === 200) {
      return response.data;
    }
  }

  function goPrev() {
    if (page === 1) return navigate("/evaluasi/user-form");

    // save the current page to url params
    setSearchParams({ page: page - 1 });

    setPage(page - 1);
  }

  function goNext() {
    // save the current page to url params
    setSearchParams({ page: page + 1 });

    setPage(page + 1);
  }

  function onSubmit(e) {
    e.preventDefault();

    // TODO: Submit the data to the API
    navigate("/results");
  }

  if (isLoading) {
    return (
      <HomeLayout>
        <div className="w-full min-h-screen flex flex-col items-center">
          <h1 className="text-xl font-semibold">Loading...</h1>
        </div>
      </HomeLayout>
    );
  }

  if (error) {
    return (
      <HomeLayout>
        <div className="w-full min-h-screen flex flex-col items-center">
          <h1 className="text-xl font-semibold">Error!</h1>
        </div>
      </HomeLayout>
    );
  }

  return (
    <HomeLayout>
      <div className="w-full min-h-screen flex flex-col items-center mb-20">
        <Header />
        <div className="w-full max-w-4xl px-2">
          {data.content.map((item) => (
            <Card key={item.idper} data={item} />
          ))}
          <div className="w-full flex justify-between items-center">
            <Button variant="sky" onClick={goPrev}>
              <ChevronLeft /> Prev
            </Button>

            {/* Just testing ↓↓↓ */}
            <p className="text-xl font-medium">
              {"<<"} {page} {">>"}
            </p>

            {page !== data.totalPages ? (
              <Button variant="sky" onClick={goNext}>
                Next <ChevronRight />
              </Button>
            ) : (
              <Button type="submit" onClick={(e) => onSubmit(e)}>
                Submit
              </Button>
            )}
          </div>
        </div>
      </div>
    </HomeLayout>
  );
};

const Header = () => {
  return (
    <div className="w-full h-[300px] bg-waves bg-cover bg-center flex flex-col items-center text-center pt-24">
      <h1 className="text-4xl font-semibold">Evaluasi HUM</h1>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque,
        expedita.
      </p>
    </div>
  );
};

const Card = ({ data }) => {
  const [value, setValue] = useLocalStorageState("qState", {
    defaultValue: [],
  });

  const [radioValue, setRadioValue] = useState(
    Array.isArray(value)
      ? value.find((e) => e.idper === data.idper)?.jawaban
      : null
  );

  const handleChangeValue = (radioData) => {
    setRadioValue(radioData);
    const newValue = value.filter((e) => e.idper !== data.idper);
    const newData = {
      idper: data.idper,
      jabatan: data.jabatan,
      kodepertanyaan: data.kodepertanyaan,
      koderule: data.koderule,
      idja: data.jawabanList.find((ans) => ans.jawaban === radioData).idja,
      jawaban: radioData,
    };

    setValue([...newValue, newData]);
  };

  return (
    <div className="w-full bg-white shadow-md border p-2 rounded-md mb-4 md:mb-6">
      <h1 className="text-xl sm:text-2xl lg:text-3xl mb-4">
        {data.pertanyaan}
      </h1>

      <Separator />

      <Accordion type="single" collapsible>
        <AccordionItem
          value="item-1"
          className={cn(
            "bg-white border-none outline-none p-2 rounded",
            radioValue && "bg-green-100"
          )}
        >
          <AccordionTrigger>
            <h1 className="flex">
              {radioValue && <Check className="mr-2" />} Your answer here!
            </h1>
          </AccordionTrigger>
          <AccordionContent>
            <RadioGroup
              onValueChange={handleChangeValue}
              className="space-y-3"
              defaultValue={radioValue}
            >
              {data.jawabanList.map((e) => (
                <div key={e.idja} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={e.jawaban}
                    id={`option-one${e.idja}`}
                  />
                  <Label htmlFor={`option-one${e.idja}`}>{e.jawaban}</Label>
                </div>
              ))}
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default EvaluationPage;
